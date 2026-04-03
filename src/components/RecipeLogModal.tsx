import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import type { Recipe } from '../types';

interface RecipeLogModalProps {
  visible: boolean;
  recipe: Recipe | null;
  onClose: () => void;
  onLog: (calories: number, protein: number, carbs: number, fat: number, name: string) => void;
}

const SERVING_PRESETS = [0.5, 1, 1.5, 2, 3, 4];

export const RecipeLogModal: React.FC<RecipeLogModalProps> = ({
  visible,
  recipe,
  onClose,
  onLog,
}) => {
  const { theme } = useTheme();
  const [mode, setMode] = useState<'servings' | 'grams'>('servings');
  const [selectedServings, setSelectedServings] = useState(1);
  const [customServings, setCustomServings] = useState('');
  const [showCustomServings, setShowCustomServings] = useState(false);
  const [customGrams, setCustomGrams] = useState('');

  useEffect(() => {
    if (recipe) {
      setMode('servings');
      setSelectedServings(1);
      setCustomServings('');
      setShowCustomServings(false);
      setCustomGrams('');
    }
  }, [recipe]);

  if (!recipe) return null;

  const canUseGrams = recipe.totalWeightG != null && recipe.totalWeightG > 0;

  const fraction = (() => {
    if (mode === 'servings') {
      const s = showCustomServings
        ? customServings !== '' ? parseFloat(customServings) || selectedServings : selectedServings
        : selectedServings;
      return s / recipe.servings;
    } else {
      const g = parseFloat(customGrams) || (recipe.totalWeightG ?? 0);
      return recipe.totalWeightG ? g / recipe.totalWeightG : 1;
    }
  })();

  const preview = {
    calories: Math.round(recipe.totalCalories * fraction),
    protein: Math.round(recipe.totalProtein * fraction * 10) / 10,
    carbs: Math.round(recipe.totalCarbs * fraction * 10) / 10,
    fat: Math.round(recipe.totalFat * fraction * 10) / 10,
  };

  const servingDisplayAmount = (() => {
    if (mode === 'servings') {
      const s = showCustomServings
        ? customServings !== '' ? parseFloat(customServings) || selectedServings : selectedServings
        : selectedServings;
      return `${s} serving${s !== 1 ? 's' : ''}`;
    }
    const g = customGrams !== '' ? customGrams : String(recipe.totalWeightG ?? '');
    return `${g}g`;
  })();

  const handleLog = () => {
    onLog(preview.calories, preview.protein, preview.carbs, preview.fat, `${recipe.name} · ${servingDisplayAmount}`);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.kvView}
        >
          <View style={[styles.sheet, { backgroundColor: theme.card }]}>
            {/* Handle */}
            <View style={[styles.handle, { backgroundColor: theme.border }]} />

            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                {recipe.imageUri ? (
                  <Image source={{ uri: recipe.imageUri }} style={styles.recipeImage} resizeMode="cover" />
                ) : (
                  <View style={[styles.recipeImagePlaceholder, { backgroundColor: theme.surface }]}>
                    <Ionicons name="restaurant-outline" size={22} color={theme.textSecondary} />
                  </View>
                )}
                <View style={{ flex: 1 }}>
                  <Text style={[styles.recipeName, { color: theme.text }]} numberOfLines={2}>{recipe.name}</Text>
                  <Text style={[styles.recipeMeta, { color: theme.textSecondary }]}>
                    {recipe.totalCalories} kcal total · {recipe.servings} servings
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={26} color={theme.text} />
              </TouchableOpacity>
            </View>

            <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scrollContent}>
              {/* Mode Toggle */}
              <View style={[styles.modeToggle, { backgroundColor: theme.surface }]}>
                <TouchableOpacity
                  style={[styles.modeOption, mode === 'servings' && { backgroundColor: theme.primary }]}
                  onPress={() => setMode('servings')}
                >
                  <Text style={[styles.modeOptionText, { color: mode === 'servings' ? '#fff' : theme.text }]}>
                    Servings
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modeOption, mode === 'grams' && { backgroundColor: theme.primary }, !canUseGrams && styles.modeOptionDisabled]}
                  onPress={() => canUseGrams && setMode('grams')}
                  disabled={!canUseGrams}
                >
                  <Text style={[styles.modeOptionText, { color: mode === 'grams' ? '#fff' : canUseGrams ? theme.text : theme.textSecondary }]}>
                    Grams{!canUseGrams ? ' (set total weight)' : ''}
                  </Text>
                </TouchableOpacity>
              </View>

              {mode === 'servings' ? (
                <>
                  <View style={styles.servingGrid}>
                    {SERVING_PRESETS.map(value => {
                      const isActive = !showCustomServings && selectedServings === value;
                      return (
                        <TouchableOpacity
                          key={value}
                          style={[
                            styles.servingBtn,
                            {
                              backgroundColor: theme.surface,
                              borderColor: isActive ? theme.primary : theme.border,
                              borderWidth: isActive ? 2 : 1,
                            },
                          ]}
                          onPress={() => { setSelectedServings(value); setShowCustomServings(false); setCustomServings(''); }}
                        >
                          <Text style={[styles.servingBtnText, { color: isActive ? theme.primary : theme.text }]}>
                            {value}×
                          </Text>
                          <Text style={[styles.servingBtnSub, { color: theme.textSecondary }]}>
                            {Math.round(recipe.totalCalories * (value / recipe.servings))} kcal
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  <TouchableOpacity
                    style={[styles.customBtn, { backgroundColor: theme.surface, borderColor: showCustomServings ? theme.primary : theme.border, borderWidth: showCustomServings ? 2 : 1 }]}
                    onPress={() => { setShowCustomServings(true); setCustomServings(''); }}
                  >
                    <Ionicons name="create-outline" size={18} color={showCustomServings ? theme.primary : theme.text} />
                    <Text style={{ color: showCustomServings ? theme.primary : theme.text, fontSize: 14, fontWeight: '500' }}>Custom amount</Text>
                  </TouchableOpacity>

                  {showCustomServings && (
                    <View style={styles.customRow}>
                      <TextInput
                        style={[styles.customInput, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                        placeholder={`${selectedServings}`}
                        placeholderTextColor={theme.textSecondary}
                        keyboardType="decimal-pad"
                        value={customServings}
                        onChangeText={setCustomServings}
                        autoFocus
                      />
                      <Text style={[styles.customLabel, { color: theme.textSecondary }]}>servings</Text>
                    </View>
                  )}
                </>
              ) : (
                <View style={styles.customRow}>
                  <TextInput
                    style={[styles.customInput, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border, flex: 1 }]}
                    placeholder={String(recipe.totalWeightG ?? '')}
                    placeholderTextColor={theme.textSecondary}
                    keyboardType="decimal-pad"
                    value={customGrams}
                    onChangeText={setCustomGrams}
                    autoFocus
                  />
                  <Text style={[styles.customLabel, { color: theme.textSecondary }]}>g</Text>
                </View>
              )}

              {/* Macro preview */}
              <View style={[styles.preview, { backgroundColor: theme.surface }]}>
                <View style={styles.previewRow}>
                  <Text style={[styles.previewLabel, { color: theme.textSecondary }]}>Calories</Text>
                  <Text style={[styles.previewVal, { color: theme.primary }]}>{preview.calories}</Text>
                </View>
                <View style={styles.previewRow}>
                  <Text style={[styles.previewLabel, { color: theme.textSecondary }]}>Protein</Text>
                  <Text style={[styles.previewVal, { color: theme.text }]}>{preview.protein}g</Text>
                </View>
                <View style={styles.previewRow}>
                  <Text style={[styles.previewLabel, { color: theme.textSecondary }]}>Carbs</Text>
                  <Text style={[styles.previewVal, { color: theme.text }]}>{preview.carbs}g</Text>
                </View>
                <View style={styles.previewRow}>
                  <Text style={[styles.previewLabel, { color: theme.textSecondary }]}>Fat</Text>
                  <Text style={[styles.previewVal, { color: theme.text }]}>{preview.fat}g</Text>
                </View>
              </View>
            </ScrollView>

            {/* Log button */}
            <TouchableOpacity style={[styles.logBtn, { backgroundColor: theme.primary }]} onPress={handleLog}>
              <Ionicons name="checkmark-circle-outline" size={22} color="#fff" />
              <Text style={styles.logBtnText}>Log to Diary</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  kvView: { justifyContent: 'flex-end' },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingBottom: 32,
    maxHeight: '90%',
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    alignSelf: 'center', marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 12,
  },
  headerLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  recipeImage: { width: 52, height: 52, borderRadius: 10 },
  recipeImagePlaceholder: { width: 52, height: 52, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  recipeName: { fontSize: 17, fontWeight: '700' },
  recipeMeta: { fontSize: 13, marginTop: 2 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 16, gap: 12 },
  modeToggle: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 4,
  },
  modeOption: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 12 },
  modeOptionDisabled: { opacity: 0.5 },
  modeOptionText: { fontSize: 14, fontWeight: '600' },
  servingGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  servingBtn: {
    width: '30%',
    flexGrow: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    gap: 2,
  },
  servingBtnText: { fontSize: 16, fontWeight: '700' },
  servingBtnSub: { fontSize: 11 },
  customBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
  },
  customRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  customInput: {
    borderWidth: 1, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 20, fontWeight: '700',
    minWidth: 100,
  },
  customLabel: { fontSize: 16 },
  preview: {
    borderRadius: 14,
    padding: 14,
    gap: 8,
    marginTop: 4,
  },
  previewRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  previewLabel: { fontSize: 14 },
  previewVal: { fontSize: 16, fontWeight: '700' },
  logBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 8,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  logBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
