import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { CircularProgress } from '../components/CircularProgress';
import { storage, STORAGE_KEYS } from '../utils/storage';

interface CaloriesScreenProps {
  onOpenSettings: () => void;
}

interface FoodEntry {
  id: string;
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
  timestamp: Date;
  date: string;
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

const getTodayDate = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

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
  const size = 28;
  const strokeWidth = 2.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(progress, 100) / 100) * circumference;

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
          stroke={isOverLimit ? '#F44336' : '#2196F3'}
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

export default function CaloriesScreen({ onOpenSettings }: CaloriesScreenProps) {
  const { theme } = useTheme();
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDate());
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
      setProtein('');
      setCarbs('');
      setFats('');
      setShowAddModal(false);
    }
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
    return Math.min((dayTotal / goalCalories) * 100, 100);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
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

        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: theme.primary }]}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add-circle-outline" size={22} color="white" />
          <Text style={styles.addButtonText}>Add Food</Text>
        </TouchableOpacity>

        {entries.length > 0 && (
          <View style={styles.entriesContainer}>
            <Text style={[styles.entriesTitle, { color: theme.text }]}>Entries</Text>
            {entries.slice().reverse().map((entry) => (
              <View key={entry.id} style={[styles.entryCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={styles.entryLeft}>
                  <Text style={[styles.entryTime, { color: theme.textSecondary }]}>
                    {formatTime(entry.timestamp)}
                  </Text>
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
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Add Food</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={28} color={theme.text} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalScrollContent} keyboardShouldPersistTaps="handled">
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
                <Text style={styles.submitButtonText}>Add</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
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
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  settingsButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  chartContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 16,
  },
  caloriesSection: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  macrosSection: {
    flex: 1,
    justifyContent: 'space-around',
    gap: 8,
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
    fontSize: 11,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  macroValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  macroGoal: {
    fontSize: 11,
  },
  addButton: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  entriesContainer: {
    gap: 12,
  },
  entriesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  entryCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  entryLeft: {
    flex: 1,
    gap: 4,
  },
  entryTime: {
    fontSize: 12,
  },
  entryMacros: {
    flexDirection: 'row',
    gap: 12,
  },
  entryMacroText: {
    fontSize: 13,
    fontWeight: '600',
  },
  entryCaloriesText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 20,
  },
  modalContent: {
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalScrollContent: {
    paddingBottom: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
  },
  submitButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  historyModalContent: {
    borderRadius: 20,
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
    borderRadius: 8,
    marginBottom: 12,
  },
  todayButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  monthNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  monthNavButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  monthSection: {
    marginBottom: 24,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
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
});
