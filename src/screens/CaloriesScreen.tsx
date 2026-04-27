import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  SafeAreaView,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useActiveWorkout } from '../context/ActiveWorkoutContext';
import { useGlobalDate } from '../context/GlobalDateContext';
import { CircularProgress } from '../components/CircularProgress';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { getTodayDate } from '../utils/date';
import { BarcodeScannerModal } from '../components/BarcodeScannerModal';
import { ProductDetailsModal } from '../components/ProductDetailsModal';
import { RecipeLogModal } from '../components/RecipeLogModal';
import { fetchProductByBarcode } from '../utils/foodApi';
import { ScannedProduct, CachedProduct } from '../types';
import type { Recipe } from '../types';

interface CaloriesScreenProps {
  onOpenSettings: () => void;
}

interface FoodEntry {
  id: string;
  name?: string;
  servingAmount?: string;
  imageUrl?: string;
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
  timestamp: Date;
  date: string;
  recipeId?: string;
  barcode?: string;
}

interface DailyCaloriesData {
  [date: string]: FoodEntry[];
}

interface Goals {
  calories: number;
  proteinPercent: number;
  carbsPercent: number;
  fatsPercent: number;
}



// Small circular progress indicator for macros
const MacroCircle = ({ progress, color }: { progress: number; color: string }) => {
  const size = 40;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E0E0E0"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
    </View>
  );
};

// Mini circular progress for calendar days
const MiniCalendarCircle = ({ progress, isOverLimit }: { progress: number; isOverLimit: boolean }) => {
  const { theme } = useTheme();
  const size = 28;
  const strokeWidth = 2.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate progress for consumed (capped at 100%)
  const consumedProgress = Math.min(progress, 100);
  const consumedOffset = circumference - (consumedProgress / 100) * circumference;
  
  // Calculate overage progress (only when over 100%)
  const overProgress = Math.max(progress - 100, 0);
  const overOffset = circumference - (Math.min(overProgress, 100) / 100) * circumference;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme.border}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Consumed calories circle - always shows up to 100% */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme.primary}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={consumedOffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        {/* Over limit circle (red) - only shows when over 100% */}
        {isOverLimit && overProgress > 0 && (
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#F44336"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={overOffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        )}
      </Svg>
    </View>
  );
};

export default function CaloriesScreen({ onOpenSettings }: CaloriesScreenProps) {
  const { theme } = useTheme();
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<FoodEntry | null>(null);
  const [editingName, setEditingName] = useState('');
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showRecipeSelectModal, setShowRecipeSelectModal] = useState(false);
  const [showRecipeLogModal, setShowRecipeLogModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [scannedProduct, setScannedProduct] = useState<ScannedProduct | null>(null);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  const [productCache, setProductCache] = useState<Record<string, CachedProduct>>({});
  const isAlertShowing = useRef(false);
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');
  const { selectedDate, setSelectedDate } = useGlobalDate();
  const [viewingMonth, setViewingMonth] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [allDatesData, setAllDatesData] = useState<DailyCaloriesData>({});
  const [goals, setGoals] = useState<Goals>({
    calories: 2000,
    proteinPercent: 30,
    carbsPercent: 40,
    fatsPercent: 30,
  });

  const loadAllData = async () => {
    try {
      const data = await storage.getItem<DailyCaloriesData>(STORAGE_KEYS.CALORIES);
      if (data) {
        setAllDatesData(data);
        if (data[selectedDate]) {
          const loadedEntries = data[selectedDate].map((entry: FoodEntry) => ({
            ...entry,
            timestamp: new Date(entry.timestamp),
          }));
          setEntries(loadedEntries);
        } else {
          setEntries([]);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const loadEntries = async () => {
    try {
      const todayDate = getTodayDate();
      const data = await storage.getItem<DailyCaloriesData>(STORAGE_KEYS.CALORIES);
      if (data && data[todayDate]) {
        const loadedEntries = data[todayDate].map((entry: FoodEntry) => ({
          ...entry,
          timestamp: new Date(entry.timestamp),
        }));
        setEntries(loadedEntries);
      }
    } catch (error) {
      console.error('Error loading entries:', error);
    }
  };

  const loadGoals = async () => {
    try {
      const storedGoals = await storage.getItem<Goals>(STORAGE_KEYS.GOALS);
      if (storedGoals) {
        setGoals(storedGoals);
      }
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  };

  const saveEntries = async () => {
    try {
      const existingData = await storage.getItem<DailyCaloriesData>(STORAGE_KEYS.CALORIES) || {};
      existingData[selectedDate] = entries;
      await storage.setItem(STORAGE_KEYS.CALORIES, existingData);
      setAllDatesData(existingData);
    } catch (error) {
      console.error('Error saving entries:', error);
    }
  };

  // Load entries from storage on mount
  useEffect(() => {
    loadAllData();
    loadGoals();
    loadRecipes();
    // loadProductCache(); // Disabled for Expo Go
  }, []);

  // Load entries when selected date changes
  useEffect(() => {
    loadAllData();
  }, [selectedDate]);

  // Save entries whenever they change
  useEffect(() => {
    if (entries.length > 0) {
      saveEntries();
    }
  }, [entries]);

  const loadProductCache = async () => {
    try {
      const cache = await storage.getItem<Record<string, CachedProduct>>(STORAGE_KEYS.PRODUCT_CACHE);
      if (cache) {
        setProductCache(cache);
      }
    } catch (error) {
      console.error('Error loading product cache:', error);
    }
  };

  const saveToCache = async (product: ScannedProduct) => {
    try {
      const cachedProduct: CachedProduct = {
        ...product,
        cachedAt: Date.now(),
        lastUsed: Date.now(),
      };
      const updatedCache = {
        ...productCache,
        [product.barcode]: cachedProduct,
      };
      await storage.setItem(STORAGE_KEYS.PRODUCT_CACHE, updatedCache);
      setProductCache(updatedCache);
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  };

  const handleBarcodeScan = async (barcode: string) => {
    setIsLoadingProduct(true);
    setShowScannerModal(false);

    try {
      if (productCache[barcode]) {
        const cached = productCache[barcode];
        cached.lastUsed = Date.now();
        await storage.setItem(STORAGE_KEYS.PRODUCT_CACHE, { ...productCache, [barcode]: cached });
        setScannedProduct(cached);
        setShowProductModal(true);
      } else {
        const product = await fetchProductByBarcode(barcode);
        
        if (product) {
          await saveToCache(product);
          setScannedProduct(product);
          setShowProductModal(true);
        } else if (!isAlertShowing.current) {
          isAlertShowing.current = true;
          Alert.alert(
            'Product Not Found',
            'Could not find this product in the database. Please enter macros manually.',
            [{ text: 'OK', onPress: () => { isAlertShowing.current = false; } }]
          );
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      if (!isAlertShowing.current) {
        isAlertShowing.current = true;
        Alert.alert(
          'Error',
          'Failed to fetch product information. Please try again.',
          [{ text: 'OK', onPress: () => { isAlertShowing.current = false; } }]
        );
      }
    } finally {
      setIsLoadingProduct(false);
    }
  };

  const loadRecipes = async () => {
    try {
      const saved = await storage.getItem<Recipe[]>(STORAGE_KEYS.RECIPES) || [];
      setSavedRecipes(saved);
    } catch (e) { /* ignore */ }
  };

  const handleLogRecipe = (calories: number, protein: number, carbs: number, fat: number, name: string) => {
    const now = new Date();
    const newEntry: FoodEntry = {
      id: Date.now().toString(),
      name,
      protein,
      carbs,
      fats: fat,
      calories,
      timestamp: now,
      date: selectedDate,
      recipeId: selectedRecipe?.id,
    };
    setEntries(prev => [...prev, newEntry]);
    setShowRecipeLogModal(false);
    setSelectedRecipe(null);
  };

  const handleAddScannedProduct = (
    calories: number,
    protein: number,
    carbs: number,
    fat: number,
    name: string,
    barcode: string,
    servingAmount: string,
    imageUrl?: string
  ) => {
    const now = new Date();
    const newEntry: FoodEntry = {
      id: Date.now().toString(),
      name,
      servingAmount,
      imageUrl,
      protein,
      carbs,
      fats: fat,
      calories,
      timestamp: now,
      date: selectedDate,
      barcode,
    };
    setEntries(prev => [...prev, newEntry]);
  };

  const totalCalories = entries.reduce((sum, entry) => sum + entry.calories, 0);
  const goalCalories = goals.calories;

  const totalProtein = entries.reduce((sum, entry) => sum + entry.protein, 0);
  const totalCarbs = entries.reduce((sum, entry) => sum + entry.carbs, 0);
  const totalFats = entries.reduce((sum, entry) => sum + entry.fats, 0);

  const goalProtein = Math.round((goalCalories * (goals.proteinPercent / 100)) / 4);
  const goalCarbs = Math.round((goalCalories * (goals.carbsPercent / 100)) / 4);
  const goalFats = Math.round((goalCalories * (goals.fatsPercent / 100)) / 9);

  const handleAddFood = () => {
    const p = parseFloat(protein || '0');
    const c = parseFloat(carbs || '0');
    const f = parseFloat(fats || '0');
    if (!isNaN(p) && !isNaN(c) && !isNaN(f)) {
      const calories = Math.round(p * 4 + c * 4 + f * 9);
      if (editingEntry) {
        setEntries(prev => prev.map(e =>
          e.id === editingEntry.id
            ? { ...e, protein: p, carbs: c, fats: f, calories, name: editingName.trim() || undefined }
            : e
        ));
      } else {
        const now = new Date();
        const newEntry: FoodEntry = {
          id: Date.now().toString(),
          protein: p,
          carbs: c,
          fats: f,
          calories,
          timestamp: now,
          date: selectedDate,
        };
        setEntries(prev => [...prev, newEntry]);
      }
      setProtein('');
      setCarbs('');
      setFats('');
      setEditingEntry(null);
      setEditingName('');
      setShowAddModal(false);
    }
  };

  const handleEditEntry = (entry: FoodEntry) => {
    setEditingEntry(entry);
    setEditingName(entry.name || '');
    setProtein(entry.protein.toString());
    setCarbs(entry.carbs.toString());
    setFats(entry.fats.toString());
    setShowAddModal(true);
  };

  const handleDeleteEntry = (entryId: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== entryId));
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const getCalendarMonths = () => {
    const [year, month] = viewingMonth.split('-').map(Number);
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const daysInMonth = lastDay.getDate();
    
    const days: string[] = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const dateString = `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push(dateString);
    }
    
    return days;
  };

  const getMonthName = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const changeMonth = (offset: number) => {
    const [year, month] = viewingMonth.split('-').map(Number);
    const date = new Date(year, month - 1 + offset, 1);
    const newMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    setViewingMonth(newMonth);
  };

  const canGoNextMonth = () => {
    const [year, month] = viewingMonth.split('-').map(Number);
    const viewing = new Date(year, month - 1);
    const today = new Date();
    const currentMonth = new Date(today.getFullYear(), today.getMonth());
    return viewing < currentMonth;
  };

  const getProgressPercentage = (dateString: string) => {
    if (!allDatesData[dateString]) return 0;
    const dayTotal = allDatesData[dateString].reduce((sum, entry) => sum + entry.calories, 0);
    // Don't cap at 100% - allow overage to be displayed
    return (dayTotal / goalCalories) * 100;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      {/* Full-screen loading overlay while barcode API call is in progress */}
      {isLoadingProduct && (
        <View style={[styles.loadingOverlay, { backgroundColor: 'rgba(0,0,0,0.55)' }]}>
          <View style={[styles.loadingCard, { backgroundColor: theme.card }]}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={[styles.loadingText, { color: theme.text }]}>Looking up product…</Text>
            <Text style={[styles.loadingSubText, { color: theme.textSecondary }]}>This may take a moment</Text>
          </View>
        </View>
      )}
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Calorie Tracker</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity onPress={() => setShowHistoryModal(true)} style={styles.settingsButton}>
              <Ionicons name="calendar-outline" size={24} color={theme.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onOpenSettings} style={styles.settingsButton}>
              <Ionicons name="settings-outline" size={24} color={theme.primary} />
            </TouchableOpacity>
          </View>
        </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.chartContainer}>
          <View style={styles.caloriesSection}>
            <CircularProgress
              size={180}
              strokeWidth={18}
              caloriesConsumed={totalCalories}
              caloriesTarget={goalCalories}
            />
          </View>
          
          <View style={styles.macrosSection}>
            <View style={styles.macroItem}>
              <MacroCircle 
                progress={Math.min((totalProtein / goalProtein) * 100, 100)} 
                color="#FF3B3B"
              />
              <View style={styles.macroInfo}>
                <Text style={[styles.macroLabel, { color: theme.textSecondary }]}>Protein</Text>
                <Text style={[styles.macroValue, { color: theme.text }]}>
                  {totalProtein}g
                </Text>
                <Text style={[styles.macroGoal, { color: theme.textSecondary }]}>/ {goalProtein}g</Text>
              </View>
            </View>

            <View style={styles.macroItem}>
              <MacroCircle 
                progress={Math.min((totalCarbs / goalCarbs) * 100, 100)} 
                color="#ffee03"
              />
              <View style={styles.macroInfo}>
                <Text style={[styles.macroLabel, { color: theme.textSecondary }]}>Carbs</Text>
                <Text style={[styles.macroValue, { color: theme.text }]}>
                  {totalCarbs}g
                </Text>
                <Text style={[styles.macroGoal, { color: theme.textSecondary }]}>/ {goalCarbs}g</Text>
              </View>
            </View>

            <View style={styles.macroItem}>
              <MacroCircle 
                progress={Math.min((totalFats / goalFats) * 100, 100)} 
                color="#c50fd6"
              />
              <View style={styles.macroInfo}>
                <Text style={[styles.macroLabel, { color: theme.textSecondary }]}>Fats</Text>
                <Text style={[styles.macroValue, { color: theme.text }]}>
                  {totalFats}g
                </Text>
                <Text style={[styles.macroGoal, { color: theme.textSecondary }]}>/ {goalFats}g</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: theme.primary }]}
            onPress={() => setShowAddModal(true)}
          >
            <Ionicons name="add-circle-outline" size={22} color="white" />
            <Text style={styles.addButtonText}>Add Food</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.recipesButton, { backgroundColor: theme.primary }]}
            onPress={() => { loadRecipes(); setShowRecipeSelectModal(true); }}
          >
            <Ionicons name="restaurant-outline" size={22} color="white" />
            <Text style={styles.addButtonText}>Recipes</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.scanButton, { backgroundColor: theme.primary }]}
            onPress={() => setShowScannerModal(true)}
          >
            <Ionicons name="barcode-outline" size={22} color="white" />
            <Text style={styles.scanButtonText}>Scan</Text>
          </TouchableOpacity>
        </View>

        {entries.length > 0 && (
          <View style={styles.entriesContainer}>
            <Text style={[styles.entriesTitle, { color: theme.text }]}>Entries</Text>
            {entries.slice().reverse().map((entry) => (
              <TouchableOpacity
                key={entry.id}
                style={[styles.entryCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                onPress={() => handleEditEntry(entry)}
                activeOpacity={0.7}
              >
                {entry.imageUrl && (
                  <Image
                    source={{ uri: entry.imageUrl }}
                    style={styles.entryImage}
                    resizeMode="contain"
                    onError={() => {}}
                  />
                )}
                <View style={styles.entryLeft}>
                  <Text style={[styles.entryTime, { color: theme.textSecondary }]}>
                    {formatTime(entry.timestamp)}
                  </Text>
                  {entry.name && (
                    <Text style={[styles.entryName, { color: theme.text }]} numberOfLines={1}>
                      {entry.name}{entry.servingAmount ? ` · ${entry.servingAmount}` : ''}
                    </Text>
                  )}
                  <View style={styles.entryMacros}>
                    <Text style={[styles.entryMacroText, { color: '#FF3B3B' }]}>P: {entry.protein}g</Text>
                    <Text style={[styles.entryMacroText, { color: '#ffee03' }]}>C: {entry.carbs}g</Text>
                    <Text style={[styles.entryMacroText, { color: '#c50fd6' }]}>F: {entry.fats}g</Text>
                  </View>
                  <Text style={[styles.entryCaloriesText, { color: theme.primary }]}>
                    +{entry.calories} cal
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => handleDeleteEntry(entry.id)}
                >
                  <Ionicons name="trash-outline" size={20} color={theme.error} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => { setShowAddModal(false); setEditingEntry(null); setEditingName(''); setProtein(''); setCarbs(''); setFats(''); }}
      >
        <TouchableOpacity 
          activeOpacity={1} 
          style={styles.modalOverlay}
          onPress={() => { setShowAddModal(false); setEditingEntry(null); setEditingName(''); setProtein(''); setCarbs(''); setFats(''); }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingView}
          >
            <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
              <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, { color: theme.text }]}>
                    {editingEntry ? 'Edit Entry' : 'Add Food'}
                  </Text>
                  <TouchableOpacity onPress={() => { setShowAddModal(false); setEditingEntry(null); setEditingName(''); setProtein(''); setCarbs(''); setFats(''); }}>
                    <Ionicons name="close" size={28} color={theme.text} />
                  </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.modalScrollContent} keyboardShouldPersistTaps="handled">
                  {editingEntry && (
                    <View style={styles.inputGroup}>
                      <Text style={[styles.inputLabel, { color: theme.text }]}>Name</Text>
                      <TextInput
                        style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                        placeholder={editingEntry.name || 'Entry name'}
                        placeholderTextColor={theme.textSecondary}
                        value={editingName}
                        onChangeText={setEditingName}
                      />
                    </View>
                  )}
                  <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: theme.text }]}>Protein (grams)</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                      placeholder="0"
                      placeholderTextColor={theme.textSecondary}
                      keyboardType="decimal-pad"
                      value={protein}
                      onChangeText={setProtein}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: theme.text }]}>Carbs (grams)</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                      placeholder="0"
                      placeholderTextColor={theme.textSecondary}
                      keyboardType="decimal-pad"
                      value={carbs}
                      onChangeText={setCarbs}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: theme.text }]}>Fats (grams)</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                      placeholder="0"
                      placeholderTextColor={theme.textSecondary}
                      keyboardType="decimal-pad"
                      value={fats}
                      onChangeText={setFats}
                    />
                  </View>

                  <TouchableOpacity 
                    style={[styles.submitButton, { backgroundColor: theme.primary }]}
                    onPress={handleAddFood}
                  >
                    <Text style={styles.submitButtonText}>{editingEntry ? 'Save' : 'Add'}</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={showHistoryModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowHistoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.historyModalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Calorie History</Text>
              <TouchableOpacity onPress={() => setShowHistoryModal(false)}>
                <Ionicons name="close" size={28} color={theme.text} />
              </TouchableOpacity>
            </View>

            {selectedDate !== getTodayDate() && (
              <TouchableOpacity
                style={[styles.todayButton, { backgroundColor: theme.primary }]}
                onPress={() => {
                  setSelectedDate(getTodayDate());
                  const now = new Date();
                  setViewingMonth(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
                  setShowHistoryModal(false);
                }}
              >
                <Ionicons name="today-outline" size={20} color="white" />
                <Text style={styles.todayButtonText}>Go to Today</Text>
              </TouchableOpacity>
            )}

            <View style={styles.monthNavigation}>
              <TouchableOpacity 
                style={[styles.monthNavButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
                onPress={() => changeMonth(-1)}
              >
                <Ionicons name="chevron-back" size={24} color={theme.text} />
              </TouchableOpacity>
              
              <Text style={[styles.monthTitle, { color: theme.text }]}>
                {getMonthName(viewingMonth)}
              </Text>

              <TouchableOpacity 
                style={[styles.monthNavButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
                onPress={() => changeMonth(1)}
                disabled={!canGoNextMonth()}
              >
                <Ionicons 
                  name="chevron-forward" 
                  size={24} 
                  color={canGoNextMonth() ? theme.text : theme.textSecondary} 
                />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.calendarScrollView}
              contentContainerStyle={styles.calendarScrollContent}
              showsVerticalScrollIndicator={true}
            >
              <View style={styles.calendarGrid}>
                {getCalendarMonths().map((dateString) => {
                  const date = new Date(dateString + 'T00:00:00');
                  const hasData = !!allDatesData[dateString];
                  const dayTotal = hasData ? allDatesData[dateString].reduce((sum, entry) => sum + entry.calories, 0) : 0;
                  const progress = getProgressPercentage(dateString);
                  const isToday = dateString === getTodayDate();
                  const isSelected = dateString === selectedDate;
                  const isFuture = new Date(dateString) > new Date(getTodayDate());
                  const isOverLimit = dayTotal > goalCalories;

                  return (
                    <TouchableOpacity
                      key={dateString}
                      style={[
                        styles.calendarDay,
                        { backgroundColor: theme.surface },
                        isSelected && { backgroundColor: theme.primary + '20', borderColor: theme.primary, borderWidth: 2 },
                        isToday && !isSelected && { borderColor: theme.primary, borderWidth: 1 },
                        isFuture && { opacity: 0.3 },
                      ]}
                      onPress={() => {
                        if (!isFuture) {
                          setSelectedDate(dateString);
                          setShowHistoryModal(false);
                        }
                      }}
                      disabled={isFuture}
                    >
                      <Text style={[styles.calendarDayNumber, { color: theme.text }]}>
                        {date.getDate()}
                      </Text>
                      <Text style={[styles.calendarDayName, { color: theme.textSecondary }]}>
                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </Text>
                      
                      <View style={styles.miniProgressContainer}>
                        {hasData && !isFuture ? (
                          <MiniCalendarCircle progress={progress} isOverLimit={isOverLimit} />
                        ) : (
                          <View style={[styles.emptyMiniCircle, { borderColor: theme.border }]} />
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <BarcodeScannerModal
        visible={showScannerModal}
        onClose={() => setShowScannerModal(false)}
        onScan={handleBarcodeScan}
        isExternallyLoading={isLoadingProduct}
      />

      <ProductDetailsModal
        visible={showProductModal}
        product={scannedProduct}
        onClose={() => {
          setShowProductModal(false);
          setScannedProduct(null);
        }}
        onAdd={handleAddScannedProduct}
      />

      {/* Recipe Select Modal */}
      <Modal
        visible={showRecipeSelectModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRecipeSelectModal(false)}
      >
        <View style={styles.recipeSelectOverlay}>
          <Pressable style={styles.recipeSelectBackdrop} onPress={() => setShowRecipeSelectModal(false)} />
          <View style={[styles.recipeSelectSheet, { backgroundColor: theme.card }]}>
            <View style={styles.recipeSelectHeader}>
              <Text style={[styles.recipeSelectTitle, { color: theme.text }]}>Log a Recipe</Text>
              <TouchableOpacity onPress={() => setShowRecipeSelectModal(false)}>
                <Ionicons name="close" size={26} color={theme.text} />
              </TouchableOpacity>
            </View>
            {savedRecipes.length === 0 ? (
              <View style={styles.recipeSelectEmpty}>
                <Ionicons name="restaurant-outline" size={48} color={theme.textSecondary} />
                <Text style={[styles.recipeSelectEmptyText, { color: theme.textSecondary }]}>No recipes yet.</Text>
                <Text style={[styles.recipeSelectEmptySubtext, { color: theme.textTertiary }]}>Create one in the Library tab.</Text>
              </View>
            ) : (
              <ScrollView style={{ maxHeight: 400 }}>
                {savedRecipes.map(recipe => (
                  <TouchableOpacity
                    key={recipe.id}
                    style={[styles.recipeSelectItem, { borderBottomColor: theme.border }]}
                    onPress={() => {
                      setSelectedRecipe(recipe);
                      setShowRecipeSelectModal(false);
                      setShowRecipeLogModal(true);
                    }}
                  >
                    {recipe.imageUri ? (
                      <Image source={{ uri: recipe.imageUri }} style={styles.recipeSelectImage} resizeMode="cover" />
                    ) : (
                      <View style={[styles.recipeSelectImagePlaceholder, { backgroundColor: theme.surface }]}>
                        <Ionicons name="restaurant-outline" size={22} color={theme.textSecondary} />
                      </View>
                    )}
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.recipeSelectName, { color: theme.text }]} numberOfLines={1}>{recipe.name}</Text>
                      <Text style={[styles.recipeSelectMeta, { color: theme.textSecondary }]}>
                        {recipe.totalCalories} kcal · {recipe.servings} serving{recipe.servings !== 1 ? 's' : ''}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      <RecipeLogModal
        visible={showRecipeLogModal}
        recipe={selectedRecipe}
        onClose={() => { setShowRecipeLogModal(false); setSelectedRecipe(null); }}
        onLog={handleLogRecipe}
      />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingCard: {
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    gap: 12,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
  },
  loadingSubText: {
    fontSize: 13,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  settingsButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  chartContainer: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  caloriesSection: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  macrosSection: {
    flex: 1,
    justifyContent: 'space-around',
    gap: 10,
  },
  macroItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  macroInfo: {
    flex: 1,
  },
  macroLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  macroValue: {
    fontSize: 17,
    fontWeight: '700',
  },
  macroGoal: {
    fontSize: 11,
  },
  addButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  recipesButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  scanButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  entriesContainer: {
    gap: 10,
  },
  entriesTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  entryCard: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  entryImage: {
    width: 48,
    height: 48,
    borderRadius: 10,
    flexShrink: 0,
  },
  entryLeft: {
    flex: 1,
    gap: 3,
  },
  entryTime: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  entryName: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 1,
    marginBottom: 3,
  },
  entryMacros: {
    flexDirection: 'row',
    gap: 10,
  },
  entryMacroText: {
    fontSize: 12,
    fontWeight: '700',
  },
  entryCaloriesText: {
    fontSize: 15,
    fontWeight: '800',
    marginTop: 2,
  },
  deleteButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 20,
  },
  keyboardAvoidingView: {
    width: '100%',
    maxWidth: 420,
  },
  modalContent: {
    borderRadius: 24,
    padding: 22,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  modalScrollContent: {
    paddingBottom: 10,
  },
  inputGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  input: {
    padding: 13,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  submitButton: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  historyModalContent: {
    borderRadius: 24,
    padding: 20,
    width: '95%',
    maxWidth: 700,
    maxHeight: '85%',
    flex: 1,
  },
  todayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  todayButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  monthNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  monthNavButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  monthSection: {
    marginBottom: 24,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },

  calendarScrollView: {
    flex: 1,
  },
  calendarScrollContent: {
    paddingBottom: 20,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  calendarDay: {
    width: '13.5%',
    aspectRatio: 0.75,
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  calendarDayNumber: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  calendarDayName: {
    fontSize: 9,
    textTransform: 'uppercase',
  },
  miniProgressContainer: {
    alignItems: 'center',
    gap: 0,
    marginTop: 4,
  },
  emptyMiniCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2.5,
    opacity: 0.3,
  },
  recipeSelectOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  recipeSelectBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  recipeSelectSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
    paddingBottom: 32,
  },
  recipeSelectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  recipeSelectTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  recipeSelectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  recipeSelectImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  recipeSelectImagePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recipeSelectName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  recipeSelectMeta: {
    fontSize: 13,
  },
  recipeSelectEmpty: {
    alignItems: 'center',
    padding: 40,
    gap: 8,
  },
  recipeSelectEmptyText: {
    fontSize: 16,
    fontWeight: '600',
  },
  recipeSelectEmptySubtext: {
    fontSize: 14,
  },
});
