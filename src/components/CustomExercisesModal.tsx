import React, { useState, useEffect } from 'react';
import { Modal, StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { MappedExercise, MuscleGroup } from '../types';

const MUSCLE_GROUPS: { id: MuscleGroup; label: string }[] = [
  { id: 'chest', label: 'Chest' },
  { id: 'lats', label: 'Lats' },
  { id: 'upper_back', label: 'Upper Back' },
  { id: 'lower_back', label: 'Lower Back' },
  { id: 'front_delts', label: 'Front Delts' },
  { id: 'side_delts', label: 'Side Delts' },
  { id: 'rear_delts', label: 'Rear Delts' },
  { id: 'biceps', label: 'Biceps' },
  { id: 'triceps', label: 'Triceps' },
  { id: 'forearms', label: 'Forearms' },
  { id: 'abs', label: 'Abs' },
  { id: 'obliques', label: 'Obliques' },
  { id: 'quads', label: 'Quads' },
  { id: 'hamstrings', label: 'Hamstrings' },
  { id: 'glutes', label: 'Glutes' },
  { id: 'calves', label: 'Calves' },
];

interface CustomExercisesModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function CustomExercisesModal({ visible, onClose }: CustomExercisesModalProps) {
  const { theme } = useTheme();
  const [exercises, setExercises] = useState<MappedExercise[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [type, setType] = useState<'gym' | 'calisthenics' | 'cardio' | 'stretching'>('gym');
  const [primaryMuscles, setPrimaryMuscles] = useState<Set<MuscleGroup>>(new Set());
  const [secondaryMuscles, setSecondaryMuscles] = useState<Set<MuscleGroup>>(new Set());
  const [difficultyMultiplier, setDifficultyMultiplier] = useState(1.0);

  const DIFFICULTY_PRESETS = [
    { label: 'Standard Lift', value: 1.0, description: 'Matches Bench Press / Squat' },
    { label: 'Heavy Compound', value: 1.2, description: 'Harder than standard (e.g. Deadlift)' },
    { label: 'Assistance Lift', value: 0.8, description: 'Dumbbell work / Machine rows' },
    { label: 'Accessory / Isolation', value: 0.4, description: 'Curls / Extensions / Flyes' },
    { label: 'Bodyweight', value: 0.6, description: 'Pushups / Dips' },
  ];

  useEffect(() => {
    if (visible) {
      loadExercises();
    }
  }, [visible]);

  const loadExercises = async () => {
    try {
      const saved = await storage.getItem<MappedExercise[]>(STORAGE_KEYS.CUSTOM_EXERCISES);
      if (saved) {
        setExercises(saved);
      }
    } catch (error) {
      console.error('Error loading custom exercises:', error);
    }
  };

  const saveExercises = async (newExercises: MappedExercise[]) => {
    try {
      await storage.setItem(STORAGE_KEYS.CUSTOM_EXERCISES, newExercises);
      setExercises(newExercises);
    } catch (error) {
      console.error('Error saving custom exercises:', error);
      Alert.alert('Error', 'Failed to save exercise.');
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Exercise', 'Are you sure you want to delete this custom exercise?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive',
        onPress: () => {
          const newExercises = exercises.filter(ex => ex.id !== id);
          saveExercises(newExercises);
        }
      }
    ]);
  };
  const handleSaveExercise = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter an exercise name.');
      return;
    }
    if (primaryMuscles.size === 0) {
      Alert.alert('Error', 'Please select at least one primary muscle.');
      return;
    }

    const exerciseData: MappedExercise = {
      id: editingExerciseId || `custom_${Date.now()}`,
      name: name.trim(),
      type,
      primaryMuscles: Array.from(primaryMuscles),
      secondaryMuscles: Array.from(secondaryMuscles),
      difficultyMultiplier,
    };

    if (editingExerciseId) {
      saveExercises(exercises.map(ex => ex.id === editingExerciseId ? exerciseData : ex));
    } else {
      saveExercises([...exercises, exerciseData]);
    }
    
    // Reset form
    setName('');
    setType('gym');
    setPrimaryMuscles(new Set());
    setSecondaryMuscles(new Set());
    setDifficultyMultiplier(1.0);
    setEditingExerciseId(null);
    setShowAddForm(false);
  };

  const handleEdit = (ex: MappedExercise) => {
    setName(ex.name);
    setType(ex.type as any);
    setPrimaryMuscles(new Set(ex.primaryMuscles));
    setSecondaryMuscles(new Set(ex.secondaryMuscles));
    setDifficultyMultiplier(ex.difficultyMultiplier || 1.0);
    setEditingExerciseId(ex.id);
    setShowAddForm(true);
  };

  const toggleMuscle = (muscle: MuscleGroup, isPrimary: boolean) => {
    if (isPrimary) {
      setPrimaryMuscles(prev => {
        const next = new Set(prev);
        if (next.has(muscle)) next.delete(muscle);
        else next.add(muscle);
        return next;
      });
      // Remove from secondary if it was there
      setSecondaryMuscles(prev => {
        const next = new Set(prev);
        next.delete(muscle);
        return next;
      });
    } else {
      setSecondaryMuscles(prev => {
        const next = new Set(prev);
        if (next.has(muscle)) next.delete(muscle);
        else next.add(muscle);
        return next;
      });
      // Remove from primary if it was there
      setPrimaryMuscles(prev => {
        const next = new Set(prev);
        next.delete(muscle);
        return next;
      });
    }
  };

  const renderMuscleChips = (isPrimary: boolean) => {
    const selectedSet = isPrimary ? primaryMuscles : secondaryMuscles;
    const selectedColor = isPrimary ? theme.primary : theme.secondary || '#8B5CF6';

    return (
      <View style={styles.chipContainer}>
        {MUSCLE_GROUPS.map((mg) => {
          const isSelected = selectedSet.has(mg.id);
          return (
            <TouchableOpacity
              key={mg.id}
              style={[
                styles.chip,
                { backgroundColor: isSelected ? selectedColor : theme.surface, borderColor: theme.border }
              ]}
              onPress={() => toggleMuscle(mg.id, isPrimary)}
            >
              <Text style={[
                styles.chipText,
                { color: isSelected ? 'white' : theme.textSecondary }
              ]}>
                {mg.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView 
        style={[styles.container, { backgroundColor: theme.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
          <TouchableOpacity onPress={() => {
            if (showAddForm) {
              setShowAddForm(false);
              setEditingExerciseId(null);
              setName('');
              setPrimaryMuscles(new Set());
              setSecondaryMuscles(new Set());
            } else {
              onClose();
            }
          }} style={styles.closeButton}>
            <Ionicons name={showAddForm ? "arrow-back" : "close"} size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            {showAddForm ? (editingExerciseId ? 'Edit Exercise' : 'New Exercise') : 'Custom Exercises'}
          </Text>
          <TouchableOpacity 
            onPress={() => setShowAddForm(!showAddForm)} 
            style={styles.addButton}
          >
            <Ionicons name={showAddForm ? "list" : "add"} size={24} color={theme.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
          {showAddForm ? (
            <View style={styles.formContainer}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>New Exercise Details</Text>
              
              <TextInput
                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                placeholder="Exercise Name (e.g. Couch Dips)"
                placeholderTextColor={theme.textSecondary}
                value={name}
                onChangeText={setName}
              />

              <View style={[styles.typeSelector, { flexWrap: 'wrap' }]}>
                {(['gym', 'calisthenics', 'cardio', 'stretching'] as const).map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[
                      styles.typeOption,
                      { 
                        backgroundColor: type === t ? theme.primary : theme.surface,
                        borderColor: theme.border,
                        minWidth: '45%'
                      }
                    ]}
                    onPress={() => setType(t)}
                  >
                    <Text style={{ color: type === t ? 'white' : theme.text }}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 24 }]}>Primary Muscles</Text>
              <Text style={[styles.helpText, { color: theme.textSecondary }]}>Select the main muscle groups this exercise targets.</Text>
              {renderMuscleChips(true)}

              <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 24 }]}>Secondary Muscles</Text>
              <Text style={[styles.helpText, { color: theme.textSecondary }]}>Select any secondary or stabilizing muscles.</Text>
              {renderMuscleChips(false)}

              <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 24 }]}>Difficulty Profile</Text>
              <Text style={[styles.helpText, { color: theme.textSecondary }]}>How does this exercise compare to a standard barbell lift?</Text>
              <View style={styles.difficultyContainer}>
                {DIFFICULTY_PRESETS.map((preset) => (
                  <TouchableOpacity
                    key={preset.value}
                    style={[
                      styles.difficultyOption,
                      { 
                        backgroundColor: difficultyMultiplier === preset.value ? theme.primary + '15' : theme.surface,
                        borderColor: difficultyMultiplier === preset.value ? theme.primary : theme.border
                      }
                    ]}
                    onPress={() => setDifficultyMultiplier(preset.value)}
                  >
                    <View style={styles.difficultyHeader}>
                      <Text style={[styles.difficultyLabel, { color: theme.text }]}>{preset.label}</Text>
                      {difficultyMultiplier === preset.value && (
                        <Ionicons name="checkmark-circle" size={20} color={theme.primary} />
                      )}
                    </View>
                    <Text style={[styles.difficultyDescription, { color: theme.textSecondary }]}>
                      {preset.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: theme.primary }]}
                onPress={handleSaveExercise}
              >
                <Text style={styles.saveButtonText}>
                  {editingExerciseId ? 'Update Exercise' : 'Save Custom Exercise'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.listContainer}>
              {exercises.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="barbell-outline" size={64} color={theme.border} />
                  <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                    No custom exercises yet.{'\n'}Tap the + button to add one.
                  </Text>
                </View>
              ) : (
                exercises.map((ex) => (
                  <View key={ex.id} style={[styles.exerciseCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <View style={styles.exerciseInfo}>
                      <Text style={[styles.exerciseName, { color: theme.text }]}>{ex.name}</Text>
                       <Text style={[styles.exerciseType, { color: theme.textSecondary }]}>
                        {ex.type} • {ex.primaryMuscles.map(m => MUSCLE_GROUPS.find(g => g.id === m)?.label).join(', ')}
                      </Text>
                    </View>
                    <View style={styles.actionButtons}>
                      <TouchableOpacity onPress={() => handleEdit(ex)} style={styles.actionButton}>
                        <Ionicons name="pencil-outline" size={20} color={theme.primary} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDelete(ex.id)} style={styles.actionButton}>
                        <Ionicons name="trash-outline" size={20} color={theme.error} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  addButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  formContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 13,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  typeOption: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  saveButton: {
    marginTop: 32,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    gap: 12,
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  exerciseType: {
    fontSize: 13,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 15,
    lineHeight: 22,
  },
  difficultyContainer: {
    gap: 10,
  },
  difficultyOption: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  difficultyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  difficultyLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  difficultyDescription: {
    fontSize: 12,
  },
});
