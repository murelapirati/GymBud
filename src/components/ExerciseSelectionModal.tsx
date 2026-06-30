import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { MappedExercise, WorkoutType, MuscleGroup } from '../types';
import { PREDEFINED_EXERCISES } from '../data/exercises';

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

const DIFFICULTY_PRESETS = [
  { label: 'Standard Lift', value: 1.0, description: 'Matches Bench Press / Squat' },
  { label: 'Heavy Compound', value: 1.2, description: 'Harder than standard (e.g. Deadlift)' },
  { label: 'Assistance Lift', value: 0.8, description: 'Dumbbell work / Machine rows' },
  { label: 'Accessory / Isolation', value: 0.4, description: 'Curls / Extensions / Flyes' },
  { label: 'Bodyweight', value: 0.6, description: 'Pushups / Dips' },
];

interface ExerciseSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (exercise: MappedExercise) => void;
  workoutType?: WorkoutType;
}

export default function ExerciseSelectionModal({ visible, onClose, onSelect, workoutType }: ExerciseSelectionModalProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  
  // Search & Filtering State
  const [searchQuery, setSearchQuery] = useState('');
  const [allExercises, setAllExercises] = useState<MappedExercise[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'strength' | 'cardio' | 'stretching'>('all');

  // Inline Creation Form State
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<'gym' | 'calisthenics' | 'cardio' | 'stretching'>('gym');
  const [primaryMuscles, setPrimaryMuscles] = useState<Set<MuscleGroup>>(new Set());
  const [secondaryMuscles, setSecondaryMuscles] = useState<Set<MuscleGroup>>(new Set());
  const [difficultyMultiplier, setDifficultyMultiplier] = useState(1.0);

  // Auto-calibrate difficulty multiplier based on selected primary muscles
  useEffect(() => {
    if (primaryMuscles.size > 0) {
      const isAccessoryOnly = Array.from(primaryMuscles).every(m => 
        m === 'biceps' || 
        m === 'triceps' || 
        m === 'forearms' || 
        m === 'abs' || 
        m === 'obliques' || 
        m === 'calves' || 
        m === 'side_delts' || 
        m === 'rear_delts'
      );
      if (isAccessoryOnly) {
        if (primaryMuscles.has('calves')) {
          setDifficultyMultiplier(0.4);
        } else {
          setDifficultyMultiplier(0.5);
        }
      } else {
        if (newType === 'calisthenics') {
          setDifficultyMultiplier(0.6);
        } else {
          setDifficultyMultiplier(1.0);
        }
      }
    }
  }, [primaryMuscles, newType]);

  useEffect(() => {
    if (visible) {
      loadExercises();
      // Initialize tab based on active workout type
      if (workoutType === 'gym' || workoutType === 'calisthenics') {
        setActiveTab('strength');
      } else if (workoutType === 'cardio') {
        setActiveTab('cardio');
      } else if (workoutType === 'stretching') {
        setActiveTab('stretching');
      } else {
        setActiveTab('all');
      }
    } else {
      setSearchQuery('');
      setShowCreateForm(false);
    }
  }, [visible, workoutType]);

  const loadExercises = async () => {
    try {
      const custom = await storage.getItem<MappedExercise[]>(STORAGE_KEYS.CUSTOM_EXERCISES) || [];
      const combined = [...PREDEFINED_EXERCISES, ...custom].sort((a, b) => a.name.localeCompare(b.name));
      setAllExercises(combined);
    } catch (error) {
      console.error('Error loading exercises for selection:', error);
      setAllExercises([...PREDEFINED_EXERCISES].sort((a, b) => a.name.localeCompare(b.name)));
    }
  };

  // Filter exercises based on active tab and search query
  const filteredExercises = allExercises.filter(ex => {
    const matchesSearch = searchQuery.trim().length === 0 || ex.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesTab = true;
    if (activeTab === 'strength') {
      matchesTab = ex.type === 'gym' || ex.type === 'calisthenics';
    } else if (activeTab === 'cardio') {
      matchesTab = ex.type === 'cardio';
    } else if (activeTab === 'stretching') {
      matchesTab = ex.type === 'stretching';
    }

    return matchesSearch && matchesTab;
  });

  const exactMatchExists = allExercises.some(ex => ex.name.trim().toLowerCase() === searchQuery.trim().toLowerCase());
  const showCreateOption = searchQuery.trim().length > 0 && !exactMatchExists;

  const handleOpenCreateForm = () => {
    setNewName(searchQuery.trim());
    if (activeTab === 'strength') {
      setNewType(workoutType === 'calisthenics' ? 'calisthenics' : 'gym');
    } else if (activeTab === 'cardio') {
      setNewType('cardio');
    } else if (activeTab === 'stretching') {
      setNewType('stretching');
    } else {
      setNewType(workoutType || 'gym');
    }
    setPrimaryMuscles(new Set());
    setSecondaryMuscles(new Set());
    setDifficultyMultiplier(1.0);
    setShowCreateForm(true);
  };

  const handleSaveCustomExercise = async () => {
    if (!newName.trim()) {
      Alert.alert('Error', 'Please enter an exercise name.');
      return;
    }
    
    if ((newType === 'gym' || newType === 'calisthenics') && primaryMuscles.size === 0) {
      Alert.alert('Error', 'Please select at least one primary muscle.');
      return;
    }

    // Auto resolve difficulty multiplier for cardio/stretching
    let finalMultiplier = difficultyMultiplier;
    if (newType === 'cardio') finalMultiplier = 0.1;
    if (newType === 'stretching') finalMultiplier = 0.05;

    const newExercise: MappedExercise = {
      id: `custom_${Date.now()}`,
      name: newName.trim(),
      type: newType,
      primaryMuscles: Array.from(primaryMuscles),
      secondaryMuscles: Array.from(secondaryMuscles),
      difficultyMultiplier: finalMultiplier,
    };

    try {
      const custom = await storage.getItem<MappedExercise[]>(STORAGE_KEYS.CUSTOM_EXERCISES) || [];
      await storage.setItem(STORAGE_KEYS.CUSTOM_EXERCISES, [...custom, newExercise]);
      onSelect(newExercise);
      setShowCreateForm(false);
      onClose();
    } catch (error) {
      console.error('Error saving custom exercise inline:', error);
      Alert.alert('Error', 'Failed to save custom exercise.');
    }
  };

  const toggleMuscle = (muscle: MuscleGroup, isPrimary: boolean) => {
    if (isPrimary) {
      setPrimaryMuscles(prev => {
        const next = new Set(prev);
        if (next.has(muscle)) next.delete(muscle);
        else next.add(muscle);
        return next;
      });
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
      setPrimaryMuscles(prev => {
        const next = new Set(prev);
        next.delete(muscle);
        return next;
      });
    }
  };

  const renderMuscleChips = (isPrimary: boolean) => {
    const selectedSet = isPrimary ? primaryMuscles : secondaryMuscles;
    const selectedColor = isPrimary ? theme.primary : '#8B5CF6';

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

  const renderEmptyState = () => {
    if (searchQuery.trim().length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="barbell-outline" size={48} color={theme.textSecondary} />
          <Text style={[styles.emptyStateText, { color: theme.text }]}>
            No exercises in this category
          </Text>
          <Text style={[styles.emptyStateSubtext, { color: theme.textSecondary }]}>
            Try changing tabs or use the search bar above.
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.emptyState}>
        <Ionicons name="search-outline" size={48} color={theme.textSecondary} />
        <Text style={[styles.emptyStateText, { color: theme.text }]}>
          No results for "{searchQuery}"
        </Text>
        <Text style={[styles.emptyStateSubtext, { color: theme.textSecondary }]}>
          You can create this exercise custom inline!
        </Text>
      </View>
    );
  };

  if (!visible) return null;

  if (showCreateForm) {
    return (
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[StyleSheet.absoluteFillObject, styles.overlay, { backgroundColor: theme.background, paddingTop: insets.top }]}
      >
        <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
          <TouchableOpacity onPress={() => setShowCreateForm(false)} style={styles.closeButton}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Create Exercise</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.formScroll} contentContainerStyle={styles.formScrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.formContainer}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Exercise Name</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
              placeholder="e.g. Incline Bench Press"
              placeholderTextColor={theme.textSecondary}
              value={newName}
              onChangeText={setNewName}
            />

            <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 16 }]}>Exercise Type</Text>
            <View style={styles.typeSelector}>
              {(['gym', 'calisthenics', 'cardio', 'stretching'] as const).map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.typeOption,
                    { 
                      backgroundColor: newType === t ? theme.primary : theme.surface,
                      borderColor: newType === t ? theme.primary : theme.border
                    }
                  ]}
                  onPress={() => setNewType(t)}
                >
                  <Text style={[styles.typeOptionText, { color: newType === t ? 'white' : theme.text }]}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {(newType === 'gym' || newType === 'calisthenics') && (
              <>
                <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 24 }]}>Primary Target Muscles</Text>
                <Text style={[styles.helpText, { color: theme.textSecondary }]}>Select the main muscles that do the work.</Text>
                {renderMuscleChips(true)}

                <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 24 }]}>Secondary / Stabilizer Muscles</Text>
                <Text style={[styles.helpText, { color: theme.textSecondary }]}>Select helping or stabilization muscles.</Text>
                {renderMuscleChips(false)}

                <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 24 }]}>Difficulty / Stability Profile</Text>
                <Text style={[styles.helpText, { color: theme.textSecondary }]}>How does this lift load compare to standard barbell exercises?</Text>
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
              </>
            )}

            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: theme.primary, marginTop: 32 }]}
              onPress={handleSaveCustomExercise}
            >
              <Text style={styles.saveButtonText}>Save & Add to Workout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={[StyleSheet.absoluteFillObject, styles.overlay, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Select Exercise</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={[styles.searchContainer, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <View style={[styles.searchBar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Ionicons name="search" size={20} color={theme.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search exercises..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="words"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Tabs */}
      <View style={[styles.tabBar, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        {(['all', 'strength', 'cardio', 'stretching'] as const).map(tab => {
          const isActive = activeTab === tab;
          const label = tab === 'all' ? 'All' : tab === 'strength' ? 'Strength' : tab === 'cardio' ? 'Cardio' : 'Stretch';
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tabItem, isActive && { borderBottomColor: theme.primary }]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabLabel, { color: isActive ? theme.primary : theme.textSecondary, fontWeight: isActive ? '700' : '500' }]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          showCreateOption ? (
            <TouchableOpacity
              style={[styles.createOptionButton, { backgroundColor: theme.primary + '15', borderColor: theme.primary }]}
              onPress={handleOpenCreateForm}
            >
              <Ionicons name="add-circle" size={22} color={theme.primary} style={{ marginRight: 8 }} />
              <Text style={[styles.createOptionText, { color: theme.primary }]}>
                Create custom exercise "{searchQuery.trim()}"
              </Text>
            </TouchableOpacity>
          ) : null
        }
        ListEmptyComponent={renderEmptyState}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.exerciseItem, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => {
              onSelect(item);
              onClose();
            }}
          >
            <View style={styles.exerciseInfo}>
              <Text style={[styles.exerciseName, { color: theme.text }]}>{item.name}</Text>
              <Text style={[styles.exerciseType, { color: theme.textSecondary }]}>
                {item.type.charAt(0).toUpperCase() + item.type.slice(1)} 
                {item.primaryMuscles && item.primaryMuscles.length > 0 ? ` • ${item.primaryMuscles.map(m => {
                  const parts = m.split('_');
                  return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
                }).join(', ')}` : ''}
              </Text>
            </View>
            <Ionicons name="add-circle" size={24} color={theme.primary} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    zIndex: 999,
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabLabel: {
    fontSize: 14,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
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
  createOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    marginBottom: 16,
  },
  createOptionText: {
    fontSize: 15,
    fontWeight: '700',
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  formScroll: {
    flex: 1,
  },
  formScrollContent: {
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
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  typeOption: {
    flex: 1,
    minWidth: '45%',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  typeOptionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
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
  saveButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
