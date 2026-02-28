import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../../utils/theme';

interface StepCounterCardProps {
  theme: Theme;
  todaySteps: number;
  stepGoal: number;
}

export const StepCounterCard: React.FC<StepCounterCardProps> = ({
  theme,
  todaySteps,
  stepGoal,
}) => {
  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.stepsHeader}>
        <View style={styles.stepsTitleContainer}>
          <Ionicons name="walk" size={24} color={theme.primary} />
          <Text style={[styles.cardTitle, { color: theme.text, marginBottom: 0, marginLeft: 8 }]}>
            Today's Steps
          </Text>
        </View>
      </View>
      <View style={styles.stepsContent}>
        <Text style={[styles.stepsCount, { color: theme.primary }]}>
          {todaySteps.toLocaleString()}
        </Text>
        <Text style={[styles.stepsLabel, { color: theme.textSecondary }]}>steps</Text>
      </View>
      <View style={styles.stepsProgressBar}>
        <View style={[styles.stepsProgressBackground, { backgroundColor: theme.border }]}>
          <View
            style={[
              styles.stepsProgressFill,
              {
                backgroundColor: theme.primary,
                width: `${Math.min((todaySteps / stepGoal) * 100, 100)}%`,
              },
            ]}
          />
        </View>
        <View style={styles.stepsGoalRow}>
          <Text style={[styles.stepsGoalText, { color: theme.textSecondary }]}>0</Text>
          <Text style={[styles.stepsGoalText, { color: theme.textSecondary }]}>
            {stepGoal.toLocaleString()}
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
  stepsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepsTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepsContent: {
    alignItems: 'center',
    marginBottom: 16,
  },
  stepsCount: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  stepsLabel: {
    fontSize: 13,
    marginTop: 2,
  },
  stepsProgressBar: {
    gap: 8,
  },
  stepsProgressBackground: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  stepsProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  stepsGoalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  stepsGoalText: {
    fontSize: 12,
  },
});
