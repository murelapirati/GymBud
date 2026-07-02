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

const PRIMARY_OPTIONS = [
  { id: 'chest', label: 'Chest' },
  { id: 'lats', label: 'Lats' },
  { id: 'upper_back', label: 'Upper Back' },
  { id: 'shoulders', label: 'Shoulders' },
  { id: 'biceps', label: 'Biceps' },
  { id: 'triceps', label: 'Triceps' },
  { id: 'forearms', label: 'Forearms' },
  { id: 'abs', label: 'Abs' },
  { id: 'quads', label: 'Quads' },
  { id: 'hamstrings', label: 'Hamstrings' },
  { id: 'glutes', label: 'Glutes' },
  { id: 'calves', label: 'Calves' }
] as const;

const SECONDARY_SUGGESTIONS: Record<string, { primary: MuscleGroup[], secondary: MuscleGroup[] }> = {
  'chest+compound':      { primary: ['chest'], secondary: ['front_delts', 'triceps'] },
  'chest+isolation':     { primary: ['chest'], secondary: ['front_delts'] },
  'lats+compound':       { primary: ['lats', 'upper_back'], secondary: ['biceps', 'rear_delts'] },
  'upper_back+compound': { primary: ['upper_back', 'lats'], secondary: ['biceps', 'rear_delts'] },
  'shoulders+compound':  { primary: ['front_delts', 'side_delts'], secondary: ['triceps'] },
  'shoulders+isolation': { primary: ['side_delts'], secondary: ['front_delts'] },
  'biceps+isolation':    { primary: ['biceps'], secondary: ['forearms'] },
  'biceps+compound':     { primary: ['biceps'], secondary: ['forearms', 'lats'] },
  'triceps+isolation':   { primary: ['triceps'], secondary: [] },
  'triceps+compound':    { primary: ['triceps', 'chest'], secondary: ['front_delts'] },
  'quads+compound':      { primary: ['quads'], secondary: ['glutes', 'hamstrings', 'calves'] },
  'quads+isolation':     { primary: ['quads'], secondary: [] },
  'hamstrings+compound': { primary: ['hamstrings', 'glutes'], secondary: ['lower_back', 'calves'] },
  'hamstrings+isolation':{ primary: ['hamstrings'], secondary: [] },
  'glutes+compound':     { primary: ['glutes', 'hamstrings'], secondary: ['quads', 'lower_back'] },
  'abs+isolation':       { primary: ['abs'], secondary: ['obliques'] },
  'calves+isolation':    { primary: ['calves'], secondary: [] },
  'forearms+isolation':  { primary: ['forearms'], secondary: [] },
};

const getDerivedMultiplier = (mechanic: 'compound' | 'isolation', equipment: string, primarySet: Set<MuscleGroup>): number => {
  if (mechanic === 'isolation') {
    if (primarySet.has('calves')) {
      return 0.4;
    }
    if (primarySet.has('abs') || primarySet.has('obliques')) {
      return 0.35;
    }
    return 0.5;
  }
  // compound:
  const map: Record<string, number> = {
    barbell: 1.0,
    dumbbell: 0.85,
    cable: 0.9,
    machine: 0.8,
    bodyweight: 0.6,
    other: 0.9,
  };
  return map[equipment] ?? 1.0;
};

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
  const [newType, setNewType] = useState<'strength' | 'cardio' | 'stretching'>('strength');
  const [primaryMuscles, setPrimaryMuscles] = useState<Set<MuscleGroup>>(new Set());
  const [secondaryMuscles, setSecondaryMuscles] = useState<Set<MuscleGroup>>(new Set());
  const [difficultyMultiplier, setDifficultyMultiplier] = useState(1.0);
  const [equipmentFilter, setEquipmentFilter] = useState<MappedExercise['equipment'] | 'all'>('all');
  const [newEquipment, setNewEquipment] = useState<MappedExercise['equipment']>('other');
  const [selectedPrimaryGroup, setSelectedPrimaryGroup] = useState<MuscleGroup | 'shoulders' | null>(null);
  const [mechanic, setMechanic] = useState<'compound' | 'isolation'>('compound');

  // Auto-populate primaryMuscles and secondaryMuscles when selectedPrimaryGroup or mechanic changes
  useEffect(() => {
    if (selectedPrimaryGroup) {
      const key = `${selectedPrimaryGroup}+${mechanic}`;
      let suggestion: { primary: MuscleGroup[], secondary: MuscleGroup[] };
      if (SECONDARY_SUGGESTIONS[key]) {
        suggestion = SECONDARY_SUGGESTIONS[key];
      } else if (selectedPrimaryGroup === 'shoulders') {
        suggestion = mechanic === 'isolation'
          ? { primary: ['side_delts'], secondary: ['front_delts'] }
          : { primary: ['front_delts', 'side_delts'], secondary: ['triceps'] };
      } else {
        suggestion = { primary: [selectedPrimaryGroup as MuscleGroup], secondary: [] };
      }
      setPrimaryMuscles(new Set(suggestion.primary));
      setSecondaryMuscles(new Set(suggestion.secondary));
    } else {
      setPrimaryMuscles(new Set());
      setSecondaryMuscles(new Set());
    }
  }, [selectedPrimaryGroup, mechanic]);

  const cycleMuscleRole = (muscle: MuscleGroup) => {
    if (primaryMuscles.has(muscle)) {
      // Primary -> Secondary
      setPrimaryMuscles(prev => {
        const next = new Set(prev);
        next.delete(muscle);
        return next;
      });
      setSecondaryMuscles(prev => {
        const next = new Set(prev);
        next.add(muscle);
        return next;
      });
    } else if (secondaryMuscles.has(muscle)) {
      // Secondary -> Removed
      setSecondaryMuscles(prev => {
        const next = new Set(prev);
        next.delete(muscle);
        return next;
      });
    } else {
      // Removed -> Primary
      setPrimaryMuscles(prev => {
        const next = new Set(prev);
        next.add(muscle);
        return next;
      });
    }
  };

  const getDisplayMuscles = () => {
    if (!selectedPrimaryGroup) return [];
    const key = `${selectedPrimaryGroup}+${mechanic}`;
    const suggestion = SECONDARY_SUGGESTIONS[key] ?? { primary: [selectedPrimaryGroup as MuscleGroup], secondary: [] };
    const union = new Set<MuscleGroup>([
      ...suggestion.primary,
      ...suggestion.secondary,
      ...Array.from(primaryMuscles),
      ...Array.from(secondaryMuscles),
    ]);
    return Array.from(union).filter(m => m !== ('shoulders' as any));
  };

  useEffect(() => {
    if (visible) {
      loadExercises();
      // Initialize tab based on active workout type
      if (workoutType === 'strength') {
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

  // Filter exercises based on active tab, search query, and equipment filter
  const filteredExercises = allExercises.filter(ex => {
    const matchesSearch = searchQuery.trim().length === 0 || ex.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEquipment = equipmentFilter === 'all' || ex.equipment === equipmentFilter;
    
    let matchesTab = true;
    if (activeTab === 'strength') {
      matchesTab = ex.type === 'strength';
    } else if (activeTab === 'cardio') {
      matchesTab = ex.type === 'cardio';
    } else if (activeTab === 'stretching') {
      matchesTab = ex.type === 'stretching';
    }

    return matchesSearch && matchesEquipment && matchesTab;
  });

  const isFiltering = searchQuery.trim().length > 0 || equipmentFilter !== 'all';

  const exactMatchExists = allExercises.some(ex => ex.name.trim().toLowerCase() === searchQuery.trim().toLowerCase());
  const showCreateOption = searchQuery.trim().length > 0 && !exactMatchExists;

  const handleOpenCreateForm = () => {
    setNewName(searchQuery.trim());
    if (activeTab === 'strength') {
      setNewType('strength');
    } else if (activeTab === 'cardio') {
      setNewType('cardio');
    } else if (activeTab === 'stretching') {
      setNewType('stretching');
    } else {
      setNewType('strength');
    }
    setSelectedPrimaryGroup(null);
    setMechanic('compound');
    setNewEquipment('other');
    setPrimaryMuscles(new Set());
    setSecondaryMuscles(new Set());
    setShowCreateForm(true);
  };

  const handleSaveCustomExercise = async () => {
    if (!newName.trim()) {
      Alert.alert('Error', 'Please enter an exercise name.');
      return;
    }
    
    if (newType === 'strength' && primaryMuscles.size === 0) {
      Alert.alert('Error', 'Please select at least one primary muscle.');
      return;
    }

    const finalMultiplier = newType === 'strength'
      ? getDerivedMultiplier(mechanic, newEquipment, primaryMuscles)
      : (newType === 'cardio' ? 0.1 : 0.05);

    const newExercise: MappedExercise = {
      id: `custom_${Date.now()}`,
      name: newName.trim(),
      type: newType,
      primaryMuscles: newType === 'strength' ? Array.from(primaryMuscles) : [],
      secondaryMuscles: newType === 'strength' ? Array.from(secondaryMuscles) : [],
      difficultyMultiplier: finalMultiplier,
      mechanic: newType === 'strength' ? mechanic : undefined,
      equipment: newType === 'strength' ? newEquipment : undefined,
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

            <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 16 }]}>Category</Text>
            <View style={styles.chipRow}>
              {(['strength', 'cardio', 'stretching'] as const).map((cat) => {
                const label = cat === 'stretching' ? 'Stretch' : cat.charAt(0).toUpperCase() + cat.slice(1);
                const isSelected = newType === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.formChip,
                      {
                        backgroundColor: isSelected ? theme.primary : theme.surface,
                        borderColor: isSelected ? theme.primary : theme.border,
                        flex: 1,
                        alignItems: 'center',
                      }
                    ]}
                    onPress={() => setNewType(cat)}
                  >
                    <Text style={{ color: isSelected ? 'white' : theme.text, fontWeight: '600' }}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {newType === 'strength' && (
              <>
                <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 16 }]}>Equipment</Text>
                <View style={[styles.chipRow, { flexWrap: 'wrap', gap: 8 }]}>
                  {(['dumbbell', 'barbell', 'bodyweight', 'cable', 'machine', 'other'] as const).map((eq) => {
                    const isSelected = newEquipment === eq;
                    return (
                      <TouchableOpacity
                        key={eq}
                        style={[
                          styles.formChip,
                          {
                            backgroundColor: isSelected ? theme.primary : theme.surface,
                            borderColor: isSelected ? theme.primary : theme.border,
                          }
                        ]}
                        onPress={() => setNewEquipment(eq)}
                      >
                        <Text style={{ color: isSelected ? 'white' : theme.text, fontWeight: '600' }}>
                          {eq.charAt(0).toUpperCase() + eq.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 16 }]}>Type</Text>
                <View style={styles.toggleContainer}>
                  {(['compound', 'isolation'] as const).map((mech) => {
                    const isSelected = mechanic === mech;
                    return (
                      <TouchableOpacity
                        key={mech}
                        style={[
                          styles.toggleButton,
                          {
                            backgroundColor: isSelected ? theme.primary : theme.surface,
                            borderColor: isSelected ? theme.primary : theme.border,
                            flex: 1,
                            alignItems: 'center',
                            paddingVertical: 12,
                          }
                        ]}
                        onPress={() => setMechanic(mech)}
                      >
                        <Text style={{ color: isSelected ? 'white' : theme.text, fontWeight: '600' }}>
                          {mech.charAt(0).toUpperCase() + mech.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 16 }]}>Primary Muscle</Text>
                <View style={[styles.chipRow, { flexWrap: 'wrap', gap: 8 }]}>
                  {PRIMARY_OPTIONS.map((opt) => {
                    const isSelected = selectedPrimaryGroup === opt.id;
                    return (
                      <TouchableOpacity
                        key={opt.id}
                        style={[
                          styles.formChip,
                          {
                            backgroundColor: isSelected ? theme.primary : theme.surface,
                            borderColor: isSelected ? theme.primary : theme.border,
                          }
                        ]}
                        onPress={() => setSelectedPrimaryGroup(opt.id)}
                      >
                        <Text style={{ color: isSelected ? 'white' : theme.text, fontWeight: '600' }}>
                          {opt.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {selectedPrimaryGroup && (
                  <>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 8 }}>
                      <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 0 }]}>Muscles</Text>
                      <View style={[styles.badge, { backgroundColor: theme.primary + '20', marginLeft: 8 }]}>
                        <Text style={[styles.badgeText, { color: theme.primary }]}>Auto-suggested</Text>
                      </View>
                    </View>
                    <Text style={[styles.helpText, { color: theme.textSecondary, marginBottom: 12 }]}>
                      Tap any row to change or remove.
                    </Text>

                    <View style={[styles.muscleListContainer, { borderColor: theme.border }]}>
                      {getDisplayMuscles().map((muscle, idx, arr) => {
                        const isPrimary = primaryMuscles.has(muscle);
                        const isSecondary = secondaryMuscles.has(muscle);
                        const status = isPrimary ? 'Primary' : isSecondary ? 'Secondary' : 'Removed';
                        const statusColor = isPrimary ? theme.primary : isSecondary ? '#8B5CF6' : theme.textSecondary;
                        const statusBg = isPrimary ? theme.primary + '15' : isSecondary ? '#8B5CF615' : theme.border + '30';
                        const muscleLabel = MUSCLE_GROUPS.find(g => g.id === muscle)?.label || muscle;

                        return (
                          <TouchableOpacity
                            key={muscle}
                            style={[
                              styles.muscleRow,
                              { 
                                borderBottomColor: theme.border,
                                borderBottomWidth: idx === arr.length - 1 ? 0 : 1
                              }
                            ]}
                            onPress={() => cycleMuscleRole(muscle)}
                          >
                            <Text style={[styles.muscleRowLabel, { color: status === 'Removed' ? theme.textSecondary : theme.text, opacity: status === 'Removed' ? 0.6 : 1 }]}>
                              {muscleLabel}
                            </Text>
                            <View style={[styles.statusBadge, { backgroundColor: statusBg, borderColor: statusColor }]}>
                              <Text style={[styles.statusBadgeText, { color: statusColor }]}>
                                {status}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </>
                )}

                <View style={[styles.multiplierRow, { backgroundColor: theme.surface, borderColor: theme.border, marginTop: 24 }]}>
                  <Text style={[styles.multiplierLabel, { color: theme.textSecondary }]}>Difficulty multiplier</Text>
                  <Text style={[styles.multiplierValue, { color: theme.text }]}>
                    {getDerivedMultiplier(mechanic, newEquipment, primaryMuscles).toFixed(2)}{' '}
                    <Text style={{ fontSize: 13, color: theme.textSecondary }}>
                      ({mechanic === 'isolation'
                        ? (primaryMuscles.has('calves') ? 'calves isolation' : (primaryMuscles.has('abs') || primaryMuscles.has('obliques') ? 'core isolation' : 'isolation'))
                        : `${mechanic} + ${newEquipment}`})
                    </Text>
                  </Text>
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

      {/* Equipment filter bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.equipFilterBar, { backgroundColor: theme.card, borderBottomColor: theme.border }]}
        contentContainerStyle={styles.equipFilterContent}
      >
        {(['all', 'dumbbell', 'barbell', 'bodyweight', 'cable', 'machine'] as const).map((eq) => {
          const isActive = equipmentFilter === eq;
          const label = eq === 'all' ? 'All' : eq.charAt(0).toUpperCase() + eq.slice(1);
          return (
            <TouchableOpacity
              key={eq}
              style={[
                styles.equipChip,
                {
                  backgroundColor: isActive ? theme.primary + '22' : theme.surface,
                  borderColor: isActive ? theme.primary : theme.border,
                  marginRight: 8,
                }
              ]}
              onPress={() => setEquipmentFilter(eq)}
            >
              <Text style={[styles.equipChipText, { color: isActive ? theme.primary : theme.textSecondary }]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <FlatList
        data={(() => {
          if (isFiltering) return filteredExercises;
          const GROUP_ORDER = ['chest','lats','upper_back','lower_back','front_delts','side_delts','rear_delts','biceps','triceps','forearms','abs','obliques','quads','hamstrings','glutes','calves'];
          const groups: Record<string, MappedExercise[]> = {};
          filteredExercises.forEach(ex => {
            const key = ex.primaryMuscles?.[0] ?? '__other';
            if (!groups[key]) groups[key] = [];
            groups[key].push(ex);
          });
          const result: (MappedExercise | { __sectionHeader: string })[] = [];
          const orderedKeys = [...GROUP_ORDER.filter(k => groups[k]), ...Object.keys(groups).filter(k => !GROUP_ORDER.includes(k))];
          orderedKeys.forEach(key => {
            const label = key === '__other' ? 'Other' : key.split('_').map((w:string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            result.push({ __sectionHeader: label });
            const sorted = [...groups[key]].sort((a, b) => {
              const aCustom = a.id.startsWith('custom_') ? 0 : 1;
              const bCustom = b.id.startsWith('custom_') ? 0 : 1;
              return aCustom - bCustom || a.name.localeCompare(b.name);
            });
            sorted.forEach(ex => result.push(ex));
          });
          return result;
        })()}
        keyExtractor={(item: any) => item.__sectionHeader ? `header_${item.__sectionHeader}` : item.id}
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
        renderItem={({ item }: { item: any }) => {
          if (item.__sectionHeader) {
            return (
              <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>
                {item.__sectionHeader.toUpperCase()}
              </Text>
            );
          }
          const ex: MappedExercise = item;
          const isCustom = ex.id.startsWith('custom_');
          // Equipment badge
          const eqBadge: Record<string, { bg: string; text: string; border: string }> = {
            dumbbell:   { bg: '#3B82F622', text: '#60a5fa', border: '#3B82F644' },
            barbell:    { bg: '#f5955422', text: '#f59554', border: '#f5955444' },
            bodyweight: { bg: '#34d39922', text: '#34d399', border: '#34d39944' },
            cable:      { bg: theme.primary + '22', text: theme.primary, border: theme.primary + '44' },
            machine:    { bg: theme.surface, text: theme.textSecondary, border: theme.border },
          };
          const badge = ex.equipment && eqBadge[ex.equipment] ? eqBadge[ex.equipment] : null;
          const mechLabel = ex.mechanic ? (ex.mechanic.charAt(0).toUpperCase() + ex.mechanic.slice(1)) : '';
          // Muscle chips
          const fmtMuscle = (m: string) => m.split('_').map((p:string) => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
          const uniquePrim = Array.from(new Set(ex.primaryMuscles || []));
          const uniqueSec = Array.from(new Set(ex.secondaryMuscles || [])).filter(m => !uniquePrim.includes(m));
          const primSlice = uniquePrim.slice(0, 3);
          const secSlice = uniqueSec.slice(0, 2);
          const primExtra = uniquePrim.length - primSlice.length;
          const secExtra = uniqueSec.length - secSlice.length;
          const totalExtra = primExtra + secExtra;
          return (
            <TouchableOpacity
              style={[styles.exerciseItem, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={() => { onSelect(ex); onClose(); }}
            >
              <View style={styles.exerciseInfo}>
                <View style={styles.exerciseNameRow}>
                  <Text style={[styles.exerciseName, { color: theme.text }]}>{ex.name}</Text>
                  {isCustom && (
                    <View style={[styles.customBadge, { backgroundColor: theme.primary + '22', borderColor: theme.primary + '44' }]}>
                      <Text style={[styles.customBadgeText, { color: theme.primary }]}>Custom</Text>
                    </View>
                  )}
                </View>
                <View style={styles.mechRow}>
                  {mechLabel ? <Text style={[styles.mechLabel, { color: theme.textSecondary }]}>{mechLabel}</Text> : null}
                  {badge ? (
                    <View style={[styles.eqBadge, { backgroundColor: badge.bg, borderColor: badge.border }]}>
                      <Text style={[styles.eqBadgeText, { color: badge.text }]}>
                        {ex.equipment!.charAt(0).toUpperCase() + ex.equipment!.slice(1)}
                      </Text>
                    </View>
                  ) : null}
                </View>
                <View style={styles.muscleChipRow}>
                  {primSlice.map(m => (
                    <View key={`p_${m}`} style={[styles.muscleChip, { backgroundColor: theme.primary + '22', borderColor: theme.primary + '44' }]}>
                      <Text style={[styles.muscleChipText, { color: theme.primary }]}>● {fmtMuscle(m)}</Text>
                    </View>
                  ))}
                  {secSlice.map(m => (
                    <View key={`s_${m}`} style={[styles.muscleChip, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                      <Text style={[styles.muscleChipText, { color: theme.textSecondary }]}>○ {fmtMuscle(m)}</Text>
                    </View>
                  ))}
                  {totalExtra > 0 && (
                    <View style={[styles.muscleChip, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                      <Text style={[styles.muscleChipText, { color: theme.textSecondary }]}>+{totalExtra} more</Text>
                    </View>
                  )}
                </View>
              </View>
              <Ionicons name="add-circle" size={24} color={theme.primary} />
            </TouchableOpacity>
          );
        }}
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
  equipFilterBar: {
    borderBottomWidth: 1,
    height: 52,
  },
  equipFilterContent: {
    paddingHorizontal: 12,
    alignItems: 'center',
    flexDirection: 'row',
  },
  equipChip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  equipChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    paddingHorizontal: 4,
    paddingTop: 16,
    paddingBottom: 6,
  },
  exerciseNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  mechRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  mechLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  eqBadge: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  eqBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  muscleChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  muscleChip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  muscleChipText: {
    fontSize: 11,
    fontWeight: '500',
  },
  customBadge: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  customBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  formChip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  toggleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  toggleButton: {
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  muscleListContainer: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  muscleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  muscleRowLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  statusBadge: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  multiplierRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  multiplierLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  multiplierValue: {
    fontSize: 15,
    fontWeight: '700',
  },
});
