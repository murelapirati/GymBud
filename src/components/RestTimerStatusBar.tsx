import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useActiveWorkout } from '../context/ActiveWorkoutContext';

interface RestTimerStatusBarProps {
  onPress: () => void;
}

const RestTimerStatusBar: React.FC<RestTimerStatusBarProps> = ({ onPress }) => {
  const { theme } = useTheme();
  const {
    activeRestTimer,
    restTimerCompleted,
    addExtraRestTime,
    cancelRestTimer,
    clearRestTimerCompleted,
  } = useActiveWorkout();

  if (!activeRestTimer && !restTimerCompleted) {
    return null;
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (restTimerCompleted) {
    return (
      <TouchableOpacity
        style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.border }]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.content}>
          <View style={styles.leftSection}>
            <View style={[styles.restDot, { backgroundColor: theme.primary }]} />
            <Text style={[styles.restLabel, { color: theme.primary }]}>REST OVER</Text>
            <Text style={[styles.subText, { color: theme.textSecondary }]}>Ready for next set</Text>
          </View>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={(e) => {
              e.stopPropagation();
              clearRestTimerCompleted();
            }}
          >
            <Text style={[styles.actionButtonText, { color: theme.text }]}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.border }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <Ionicons name="timer-outline" size={16} color={theme.primary} />
          <Text style={[styles.restLabel, { color: theme.textSecondary }]}>REST</Text>
          <Text style={[styles.timerText, { color: theme.text }]}>
            {formatTime(activeRestTimer || 0)}
          </Text>
        </View>
        <View style={styles.rightActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={(e) => {
              e.stopPropagation();
              addExtraRestTime(30);
            }}
          >
            <Text style={[styles.actionButtonText, { color: theme.text }]}>+30s</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={(e) => {
              e.stopPropagation();
              cancelRestTimer();
            }}
          >
            <Text style={[styles.actionButtonText, { color: theme.textSecondary }]}>Skip</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  restDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  restLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  timerText: {
    fontSize: 16,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  subText: {
    fontSize: 12,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default RestTimerStatusBar;
