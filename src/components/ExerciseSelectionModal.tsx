import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { MappedExercise, WorkoutType } from '../types';
import { PREDEFINED_EXERCISES } from '../data/exercises';

interface ExerciseSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (exercise: MappedExercise) => void;
  workoutType?: WorkoutType;
}

export default function ExerciseSelectionModal({ visible, onClose, onSelect, workoutType }: ExerciseSelectionModalProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [allExercises, setAllExercises] = useState<MappedExercise[]>([]);

  useEffect(() => {
    if (visible) {
      loadExercises();
    } else {
      // Clear search when closed
      setSearchQuery('');
    }
  }, [visible]);

  const loadExercises = async () => {
    try {
      const custom = await storage.getItem<MappedExercise[]>(STORAGE_KEYS.CUSTOM_EXERCISES) || [];
      // Sort alphabetically
      const combined = [...PREDEFINED_EXERCISES, ...custom].sort((a, b) => a.name.localeCompare(b.name));
      setAllExercises(combined);
    } catch (error) {
      console.error('Error loading exercises for selection:', error);
      setAllExercises([...PREDEFINED_EXERCISES].sort((a, b) => a.name.localeCompare(b.name)));
    }
  };

  // Only show results once the user starts typing
  const filteredExercises = searchQuery.trim().length === 0 ? [] : allExercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Treat gym and calisthenics as interchangeable for workout filtering
    const isGymOrCali = workoutType === 'gym' || workoutType === 'calisthenics';
    const isExGymOrCali = ex.type === 'gym' || ex.type === 'calisthenics';
    
    let typeMatch = true;
    if (workoutType) {
      if (isGymOrCali && isExGymOrCali) typeMatch = true;
      else typeMatch = ex.type === workoutType;
    }

    return matchesSearch && typeMatch;
  });

  const renderEmptyState = () => {
    if (searchQuery.trim().length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="barbell-outline" size={48} color={theme.textSecondary} />
          <Text style={[styles.emptyStateText, { color: theme.text }]}>
            Start typing to search
          </Text>
          <Text style={[styles.emptyStateSubtext, { color: theme.textSecondary }]}>
            Search across {allExercises.length} exercises by name.
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.emptyState}>
        <Ionicons name="search-outline" size={48} color={theme.textSecondary} />
        <Text style={[styles.emptyStateText, { color: theme.text }]}>
          No results for "{searchQuery}".
        </Text>
        <Text style={[styles.emptyStateSubtext, { color: theme.textSecondary }]}>
          Can't find it? You can map your own exercises!
        </Text>
        <View style={[styles.hintCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Ionicons name="information-circle" size={22} color={theme.primary} style={{ marginTop: 2 }} />
          <Text style={[styles.hintText, { color: theme.textSecondary }]}>
            Go to <Text style={{ fontWeight: '700', color: theme.text }}>Settings</Text>
            {' → '}
            <Text style={{ fontWeight: '700', color: theme.text }}>Advanced</Text>
            {' → '}
            <Text style={{ fontWeight: '700', color: theme.text }}>Manage Custom Exercises</Text>
            {' '}to add it!
          </Text>
        </View>
      </View>
    );
  };

  if (!visible) return null;

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

      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
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
                {item.primaryMuscles.length > 0 ? ` • ${item.primaryMuscles.map(m => {
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
  hintCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
    alignItems: 'flex-start',
  },
  hintText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
  },
});
