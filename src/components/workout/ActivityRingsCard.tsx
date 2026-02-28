import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '../../utils/theme';
import ActivityRings from '../ActivityRings';

interface ActivityRingsCardProps {
  theme: Theme;
  todaySteps: number;
  stepGoal: number;
  todayExerciseMinutes: number;
  exerciseMinutesGoal: number;
  todayCaloriesBurned: number;
  caloriesBurnedGoal: number;
}

export const ActivityRingsCard: React.FC<ActivityRingsCardProps> = ({
  theme,
  todaySteps,
  stepGoal,
  todayExerciseMinutes,
  exerciseMinutesGoal,
  todayCaloriesBurned,
  caloriesBurnedGoal,
}) => {
  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.activityHeader}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Today's Activity</Text>
      </View>
      <View style={styles.ringsContainer}>
        <ActivityRings
          steps={todaySteps}
          stepsGoal={stepGoal}
          exerciseMinutes={todayExerciseMinutes}
          exerciseGoal={exerciseMinutesGoal}
          caloriesBurned={todayCaloriesBurned}
          caloriesGoal={caloriesBurnedGoal}
          size={180}
        />
      </View>
      <View style={styles.ringLegend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#5383B8' }]} />
          <Text style={[styles.legendText, { color: theme.textSecondary }]}>
            {todaySteps.toLocaleString()} / {stepGoal.toLocaleString()} steps
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#34C759' }]} />
          <Text style={[styles.legendText, { color: theme.textSecondary }]}>
            {todayExerciseMinutes} / {exerciseMinutesGoal} min
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#FF3B30' }]} />
          <Text style={[styles.legendText, { color: theme.textSecondary }]}>
            {todayCaloriesBurned.toLocaleString()} / {caloriesBurnedGoal.toLocaleString()} cal
          </Text>
        </View>
      </View>
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
  activityHeader: {
    marginBottom: 16,
  },
  ringsContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  ringLegend: {
    marginTop: 16,
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 14,
  },
});
