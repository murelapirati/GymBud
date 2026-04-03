import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../context/ThemeContext';
import { Recipe, RecipeIngredient, ScannedProduct } from '../types';
import { IngredientPickerModal } from '../components/IngredientPickerModal';
import { ProductDetailsModal } from '../components/ProductDetailsModal';

interface RecipeEditScreenProps {
  recipe?: Recipe;
  onBack: () => void;
  onSave: (recipe: Recipe) => void;
}

export default function RecipeEditScreen({ recipe, onBack, onSave }: RecipeEditScreenProps) {
  const { theme } = useTheme();
  const isEditing = !!recipe;

  const [name, setName] = useState(recipe?.name ?? '');
  const [servings, setServings] = useState(recipe ? String(recipe.servings) : '1');
  const [totalWeightG, setTotalWeightG] = useState(recipe?.totalWeightG ? String(recipe.totalWeightG) : '');
  const [notes, setNotes] = useState(recipe?.notes ?? '');
  const [imageUri, setImageUri] = useState<string | undefined>(recipe?.imageUri);
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>(recipe?.ingredients ?? []);

  const [showIngredientPicker, setShowIngredientPicker] = useState(false);
  const [pendingProduct, setPendingProduct] = useState<ScannedProduct | null>(null);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const totals = ingredients.reduce(
    (acc, ing) => ({
      calories: acc.calories + ing.calories,
      protein: acc.protein + ing.protein,
      carbs: acc.carbs + ing.carbs,
      fat: acc.fat + ing.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const parsedServings = Math.max(1, parseInt(servings) || 1);
  const perServing = {
    calories: Math.round(totals.calories / parsedServings),
    protein: Math.round((totals.protein / parsedServings) * 10) / 10,
    carbs: Math.round((totals.carbs / parsedServings) * 10) / 10,
    fat: Math.round((totals.fat / parsedServings) * 10) / 10,
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraStatus.status !== 'granted') {
        Alert.alert('Permission needed', 'Camera or photo library access is required to add a photo.');
        return;
      }
    }
    Alert.alert('Add Photo', 'Choose a source', [
      {
        text: 'Take Photo',
        onPress: async () => {
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
          });
          if (!result.canceled) setImageUri(result.assets[0].uri);
        },
      },
      {
        text: 'Choose from Library',
        onPress: async () => {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
          });
          if (!result.canceled) setImageUri(result.assets[0].uri);
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleProductSelected = (product: ScannedProduct) => {
    setPendingProduct(product);
    setShowIngredientPicker(false);
    setShowProductDetails(true);
  };

  const handleIngredientAdd = (
    calories: number,
    protein: number,
    carbs: number,
    fat: number,
    name: string,
    barcode: string,
    servingAmount: string,
    imageUrl?: string,
  ) => {
    const amount = parseFloat(servingAmount) || 0;
    const unit = servingAmount.replace(/[\d.]/g, '').trim() || 'g';
    const ingredient: RecipeIngredient = {
      id: Date.now().toString(),
      name,
      amount,
      unit,
      calories: Math.round(calories),
      protein: Math.round(protein * 10) / 10,
      carbs: Math.round(carbs * 10) / 10,
      fat: Math.round(fat * 10) / 10,
      imageUrl,
      barcode: barcode || undefined,
    };
    setIngredients(prev => [...prev, ingredient]);
    setShowProductDetails(false);
    setPendingProduct(null);
  };

  const handleRemoveIngredient = (id: string) => {
    Alert.alert('Remove Ingredient', 'Remove this ingredient from the recipe?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => setIngredients(prev => prev.filter(i => i.id !== id)) },
    ]);
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Name required', 'Please give your recipe a name.');
      return;
    }
    if (ingredients.length === 0) {
      Alert.alert('No ingredients', 'Add at least one ingredient before saving.');
      return;
    }
    setIsSaving(true);
    const now = Date.now();
    const saved: Recipe = {
      id: recipe?.id ?? now.toString(),
      name: name.trim(),
      servings: parsedServings,
      totalWeightG: totalWeightG ? parseFloat(totalWeightG) : undefined,
      ingredients,
      totalCalories: Math.round(totals.calories),
      totalProtein: Math.round(totals.protein * 10) / 10,
      totalCarbs: Math.round(totals.carbs * 10) / 10,
      totalFat: Math.round(totals.fat * 10) / 10,
      imageUri,
      notes: notes.trim() || undefined,
      createdAt: recipe?.createdAt ?? now,
      updatedAt: now,
    };
    setIsSaving(false);
    onSave(saved);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border, backgroundColor: theme.background }]}>
        <TouchableOpacity onPress={onBack} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          {isEditing ? 'Edit Recipe' : 'New Recipe'}
        </Text>
        <TouchableOpacity
          onPress={handleSave}
          style={[styles.saveBtn, { backgroundColor: theme.primary }]}
          disabled={isSaving}
        >
          {isSaving
            ? <ActivityIndicator size="small" color="#fff" />
            : <Text style={styles.saveBtnText}>Save</Text>}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {/* Photo */}
          <TouchableOpacity style={[styles.photoSection, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={handlePickImage}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.photo} resizeMode="cover" />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Ionicons name="camera-outline" size={36} color={theme.textSecondary} />
                <Text style={[styles.photoLabel, { color: theme.textSecondary }]}>Add Photo</Text>
              </View>
            )}
            {imageUri && (
              <View style={[styles.photoOverlay]}>
                <Ionicons name="camera-outline" size={20} color="#fff" />
              </View>
            )}
          </TouchableOpacity>

          {/* Name */}
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>RECIPE NAME</Text>
            <TextInput
              style={[styles.nameInput, { color: theme.text, borderBottomColor: theme.border }]}
              placeholder="e.g. Omelette, Pancakes…"
              placeholderTextColor={theme.textSecondary}
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Servings + Weight */}
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>PORTIONS</Text>
            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={[styles.fieldLabel, { color: theme.text }]}>Servings this makes</Text>
                <TextInput
                  style={[styles.fieldInput, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                  placeholder="1"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="number-pad"
                  value={servings}
                  onChangeText={setServings}
                />
              </View>
              <View style={styles.halfField}>
                <Text style={[styles.fieldLabel, { color: theme.text }]}>Total weight (g) <Text style={{ color: theme.textSecondary }}>optional</Text></Text>
                <TextInput
                  style={[styles.fieldInput, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                  placeholder="e.g. 400"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="decimal-pad"
                  value={totalWeightG}
                  onChangeText={setTotalWeightG}
                />
              </View>
            </View>
          </View>

          {/* Ingredients */}
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>INGREDIENTS ({ingredients.length})</Text>
              <TouchableOpacity
                style={[styles.addIngBtn, { backgroundColor: theme.primary }]}
                onPress={() => setShowIngredientPicker(true)}
              >
                <Ionicons name="add" size={18} color="#fff" />
                <Text style={styles.addIngBtnText}>Add</Text>
              </TouchableOpacity>
            </View>

            {ingredients.length === 0 ? (
              <TouchableOpacity style={[styles.emptyIngredients, { borderColor: theme.border }]} onPress={() => setShowIngredientPicker(true)}>
                <Ionicons name="add-circle-outline" size={32} color={theme.textSecondary} />
                <Text style={[styles.emptyIngredientsText, { color: theme.textSecondary }]}>Tap to add ingredients</Text>
              </TouchableOpacity>
            ) : (
              ingredients.map(ing => (
                <View key={ing.id} style={[styles.ingredientRow, { borderBottomColor: theme.border }]}>
                  {ing.imageUrl ? (
                    <Image source={{ uri: ing.imageUrl }} style={styles.ingImage} resizeMode="contain" />
                  ) : (
                    <View style={[styles.ingImagePlaceholder, { backgroundColor: theme.surface }]}>
                      <Ionicons name="nutrition-outline" size={18} color={theme.textSecondary} />
                    </View>
                  )}
                  <View style={styles.ingInfo}>
                    <Text style={[styles.ingName, { color: theme.text }]} numberOfLines={1}>{ing.name}</Text>
                    <Text style={[styles.ingDetail, { color: theme.textSecondary }]}>
                      {ing.amount}{ing.unit} · {ing.calories} kcal · {ing.protein}g P · {ing.carbs}g C · {ing.fat}g F
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => handleRemoveIngredient(ing.id)} style={styles.removeBtn}>
                    <Ionicons name="trash-outline" size={18} color={theme.error} />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>

          {/* Nutrition Totals */}
          {ingredients.length > 0 && (
            <View style={[styles.card, { backgroundColor: theme.card }]}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>NUTRITION</Text>
              <View style={styles.nutritionGrid}>
                {[
                  { label: 'Total', cals: totals.calories, p: totals.protein, c: totals.carbs, f: totals.fat },
                  { label: `Per Serving (×${parsedServings})`, cals: perServing.calories, p: perServing.protein, c: perServing.carbs, f: perServing.fat },
                ].map(row => (
                  <View key={row.label} style={[styles.nutritionRow, { borderColor: theme.border }]}>
                    <Text style={[styles.nutritionRowLabel, { color: theme.textSecondary }]}>{row.label}</Text>
                    <View style={styles.macroRow}>
                      <View style={styles.macroItem}>
                        <Text style={[styles.macroValue, { color: theme.primary }]}>{row.cals}</Text>
                        <Text style={[styles.macroLabel, { color: theme.textSecondary }]}>kcal</Text>
                      </View>
                      <View style={styles.macroItem}>
                        <Text style={[styles.macroValue, { color: theme.text }]}>{row.p}g</Text>
                        <Text style={[styles.macroLabel, { color: theme.textSecondary }]}>protein</Text>
                      </View>
                      <View style={styles.macroItem}>
                        <Text style={[styles.macroValue, { color: theme.text }]}>{row.c}g</Text>
                        <Text style={[styles.macroLabel, { color: theme.textSecondary }]}>carbs</Text>
                      </View>
                      <View style={styles.macroItem}>
                        <Text style={[styles.macroValue, { color: theme.text }]}>{row.f}g</Text>
                        <Text style={[styles.macroLabel, { color: theme.textSecondary }]}>fat</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Notes */}
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>NOTES <Text style={{ color: theme.textSecondary }}>(optional)</Text></Text>
            <TextInput
              style={[styles.notesInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface }]}
              placeholder="Instructions, tips…"
              placeholderTextColor={theme.textSecondary}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <IngredientPickerModal
        visible={showIngredientPicker}
        onClose={() => setShowIngredientPicker(false)}
        onSelectProduct={handleProductSelected}
      />

      <ProductDetailsModal
        visible={showProductDetails}
        product={pendingProduct}
        onClose={() => { setShowProductDetails(false); setPendingProduct(null); }}
        onAdd={handleIngredientAdd}
        addButtonLabel="Add to Recipe"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerBtn: { padding: 4, marginRight: 8 },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '700' },
  saveBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  content: { padding: 16, gap: 12, paddingBottom: 60 },
  photoSection: {
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photo: { width: '100%', height: '100%' },
  photoPlaceholder: { alignItems: 'center', gap: 8 },
  photoLabel: { fontSize: 14 },
  photoOverlay: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 16,
    padding: 6,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  label: { fontSize: 12, fontWeight: '700', letterSpacing: 0.8 },
  nameInput: {
    fontSize: 20,
    fontWeight: '600',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  row: { flexDirection: 'row', gap: 12 },
  halfField: { flex: 1, gap: 6 },
  fieldLabel: { fontSize: 13 },
  fieldInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addIngBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  addIngBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  emptyIngredients: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 28,
    gap: 8,
  },
  emptyIngredientsText: { fontSize: 14 },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 10,
  },
  ingImage: { width: 40, height: 40, borderRadius: 8 },
  ingImagePlaceholder: {
    width: 40, height: 40, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  ingInfo: { flex: 1 },
  ingName: { fontSize: 15, fontWeight: '600' },
  ingDetail: { fontSize: 12, marginTop: 2 },
  removeBtn: { padding: 4 },
  nutritionGrid: { gap: 10 },
  nutritionRow: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  nutritionRowLabel: { fontSize: 13, fontWeight: '600' },
  macroRow: { flexDirection: 'row', justifyContent: 'space-between' },
  macroItem: { alignItems: 'center' },
  macroValue: { fontSize: 16, fontWeight: '700' },
  macroLabel: { fontSize: 11 },
  notesInput: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    minHeight: 100,
  },
  error: { color: '#F44336' },
});
