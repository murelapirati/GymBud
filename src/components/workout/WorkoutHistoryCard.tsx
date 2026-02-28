import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Theme } from '../../utils/theme';

interface WorkoutHistoryCardProps {
  date: string;
  formattedDate: string;
  workoutCount: number;
  workoutTitle?: string;
  totalExercises: number;
  theme: Theme;
  onPress: () => void;
}

export const WorkoutHistoryCard: React.FC<WorkoutHistoryCardProps> = ({
  date,
  formattedDate,
  workoutCount,
  workoutTitle,
  totalExercises,
  theme,
  onPress,
}) => {
  return (
    <TouchableOpacity
      key={date}
      style={[styles.historyCard, { backgroundColor: theme.card, borderColor: theme.border }]}
      onPress={onPress}
    >
      <Text style={[styles.historyDate, { color: theme.textSecondary }]}>
        {formattedDate}
      </Text>
      {workoutCount > 1 && (
        <Text style={[styles.historyTitle, { color: theme.text }]}>
          {workoutCount} workouts
        </Text>
      )}
      {workoutCount === 1 && workoutTitle && (
        <Text style={[styles.historyTitle, { color: theme.text }]}>
          {workoutTitle}
        </Text>
      )}
      <Text style={[styles.historyExerciseCount, { color: theme.text }]}>
        {totalExercises} exercise{totalExercises !== 1 ? 's' : ''}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  historyCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  historyDate: {
    fontSize: 13,
    marginBottom: 4,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  historyExerciseCount: {
    fontSize: 14,
  },
});
