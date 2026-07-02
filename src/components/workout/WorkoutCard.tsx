import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../../utils/theme';
import { useMeasurementSystem } from '../../hooks/useMeasurementSystem';
import { formatWeight } from '../../utils/measurements';

export type WorkoutType = 'strength' | 'cardio' | 'stretching';

interface WorkoutSet {
  id: string;
  reps: number;
  weight?: number;
  completed: boolean;
  completedAt?: number;
}

interface WorkoutExercise {
  id: string;
  name: string;
  sets: WorkoutSet[];
  restTimer?: number;
  previousWeight?: number;
  previousReps?: number;
}

interface WorkoutSession {
  id: string;
  date: string;
  title?: string;
  workoutType?: WorkoutType;
  exercises: WorkoutExercise[];
  notes?: string;
  duration?: number;
  intensity?: number;
  startTime?: number;
  endTime?: number;
}

interface WorkoutCardProps {
  workout: WorkoutSession;
  workoutIndex: number;
  totalWorkouts: number;
  theme: Theme;
  isToday: boolean;
  showTitle: string; // "Today's Workout", "Workout 1", etc.
  onEdit?: () => void;
  onDelete: () => void;
  onAddNotes?: () => void;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({
  workout,
  workoutIndex,
  totalWorkouts,
  theme,
  isToday,
  showTitle,
  onEdit,
  onDelete,
  onAddNotes,
}) => {
  const { measurementSystem } = useMeasurementSystem();

  const getIntensityLabel = (intensity: number) => {
    if (intensity === 0) return 'Very Easy';
    if (intensity <= 3) return 'Easy';
    if (intensity <= 5) return 'Moderate';
    if (intensity <= 7) return 'Hard';
    if (intensity <= 9) return 'Very Hard';
    return 'Max Effort';
  };

  const getWorkoutTypeInfo = (type?: WorkoutType) => {
    switch (type) {
      case 'strength':
        return { icon: 'barbell-outline' as keyof typeof Ionicons.glyphMap, label: 'Strength', color: '#FF6B6B' };
      case 'cardio':
        return { icon: 'heart-outline' as keyof typeof Ionicons.glyphMap, label: 'Cardio', color: '#4ECDC4' };
      case 'stretching':
        return { icon: 'fitness-outline' as keyof typeof Ionicons.glyphMap, label: 'Stretching', color: '#F38181' };
      default:
        return { icon: 'barbell-outline' as keyof typeof Ionicons.glyphMap, label: 'Strength', color: '#FF6B6B' };
    }
  };

  const workoutTypeInfo = getWorkoutTypeInfo(workout.workoutType);

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.workoutHeader}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>
          {showTitle}
        </Text>
        <View style={styles.workoutHeaderActions}>
          {isToday && onEdit && (
            <TouchableOpacity onPress={onEdit} style={styles.editNotesIconButton}>
              <Ionicons name="create-outline" size={20} color={theme.primary} />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={onDelete} style={styles.deleteIconButton}>
            <Ionicons name="trash-outline" size={20} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>

      {workout.title && (
        <Text style={[styles.workoutTitle, { color: theme.text }]}>
          {workout.title}
        </Text>
      )}

      {/* Workout Type Badge */}
      <View style={[styles.workoutTypeBadge, { backgroundColor: workoutTypeInfo.color + '20', borderColor: workoutTypeInfo.color + '40' }]}>
        <Ionicons name={workoutTypeInfo.icon} size={16} color={workoutTypeInfo.color} />
        <Text style={[styles.workoutTypeText, { color: workoutTypeInfo.color }]}>
          {workoutTypeInfo.label}
        </Text>
      </View>

      {workout.duration !== undefined && workout.duration !== null && (
        <Text style={[styles.workoutDuration, { color: theme.textSecondary }]}>
          {workout.duration} minutes
        </Text>
      )}

      {workout.intensity !== undefined && workout.intensity !== null && (
        <View style={styles.intensityBadge}>
          <Ionicons name="flame" size={14} color="#FF6B35" />
          <Text style={[styles.intensityText, { color: theme.text }]}>
            Intensity: {workout.intensity}/10
          </Text>
          <Text style={[styles.intensityLabel, { color: theme.textSecondary }]}>
            {getIntensityLabel(workout.intensity)}
          </Text>
        </View>
      )}

      {workout.exercises && workout.exercises.length > 0 ? (
        workout.exercises.map((exercise: any) => {
          // Cardio activity
          if (exercise.type === 'cardio') {
            return (
              <View key={exercise.id} style={styles.exerciseItem}>
                <View style={styles.exerciseInfo}>
                  <Text style={[styles.exerciseName, { color: theme.text }]}>
                    {exercise.name}
                  </Text>
                  <Text style={[styles.exerciseDetails, { color: theme.textSecondary }]}>
                    {Math.floor(exercise.duration / 60)} min
                    {exercise.distance && ` • ${exercise.distance} km`}
                    {exercise.heartRate && ` • ${exercise.heartRate} BPM`}
                  </Text>
                </View>
              </View>
            );
          }
          
          // Stretching activity
          if (exercise.type === 'stretching') {
            return (
              <View key={exercise.id} style={styles.exerciseItem}>
                <View style={styles.exerciseInfo}>
                  <Text style={[styles.exerciseName, { color: theme.text }]}>
                    {exercise.name}
                  </Text>
                  <Text style={[styles.exerciseDetails, { color: theme.textSecondary }]}>
                    {Math.floor(exercise.duration / 60)} min
                  </Text>
                </View>
              </View>
            );
          }
          
          // Strength (with sets)
          const displayWeight = exercise.sets[0]?.weight ?? exercise.sets[0]?.extraWeight;
          const weightLabel = '';
          const formattedWeight = displayWeight ? formatWeight(displayWeight, measurementSystem, 1) : '';
          
          return (
            <View key={exercise.id} style={styles.exerciseItem}>
              <View style={styles.exerciseInfo}>
                <Text style={[styles.exerciseName, { color: theme.text }]}>
                  {exercise.name}
                </Text>
                <Text style={[styles.exerciseDetails, { color: theme.textSecondary }]}>
                  {exercise.sets?.length || 0} sets
                  {exercise.sets && exercise.sets.length > 0 && ` × ${exercise.sets[0].reps} reps`}
                  {formattedWeight ? ` @ ${formattedWeight}${weightLabel}` : ''}
                </Text>
              </View>
            </View>
          );
        })
      ) : (
        <Text style={[styles.emptyExerciseText, { color: theme.textSecondary }]}>
          No exercises logged
        </Text>
      )}

      {workout.notes && (
        <View style={styles.notesContainer}>
          <Text style={[styles.notesLabel, { color: theme.textSecondary }]}>Notes:</Text>
          <Text style={[styles.notesText, { color: theme.text }]}>{workout.notes}</Text>
        </View>
      )}

      {!workout.notes && isToday && onAddNotes && (
        <TouchableOpacity onPress={onAddNotes} style={styles.addNotesButton}>
          <Ionicons name="add-circle-outline" size={18} color={theme.primary} />
          <Text style={[styles.addNotesText, { color: theme.primary }]}>Add notes</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 12,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  workoutHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  editNotesIconButton: {
    padding: 4,
  },
  deleteIconButton: {
    padding: 4,
  },
  workoutTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 8,
  },
  workoutTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
    borderWidth: 1,
  },
  workoutTypeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  workoutDuration: {
    fontSize: 14,
    marginBottom: 8,
  },
  intensityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  intensityText: {
    fontSize: 13,
    fontWeight: '600',
  },
  intensityLabel: {
    fontSize: 12,
    marginLeft: 4,
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  exerciseDetails: {
    fontSize: 14,
  },
  emptyExerciseText: {
    fontSize: 14,
    fontStyle: 'italic',
    paddingVertical: 8,
  },
  notesContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  notesLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
  },
  addNotesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  addNotesText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
