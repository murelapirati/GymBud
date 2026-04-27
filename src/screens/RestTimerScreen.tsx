import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';
import { useActiveWorkout } from '../context/ActiveWorkoutContext';

interface RestTimerScreenProps {
  onBack: () => void;
}

const RestTimerScreen: React.FC<RestTimerScreenProps> = ({ onBack }) => {
  const { theme } = useTheme();
  const { activeRestTimer, restTimerInitialSeconds, cancelRestTimer, addExtraRestTime } = useActiveWorkout();

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progress = restTimerInitialSeconds > 0 ? ((restTimerInitialSeconds - (activeRestTimer || 0)) / restTimerInitialSeconds) : 0;
  
  // Circle properties
  const size = 280;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - progress * circumference;

  const handleSkip = () => {
    cancelRestTimer();
    onBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Rest Timer</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Timer Display with Circular Progress */}
      <View style={styles.timerContainer}>
        <Svg width={size} height={size}>
          {/* Background circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={theme.border}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={theme.primary}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        <View style={styles.timerTextContainer}>
          <Text style={[styles.timerText, { color: theme.text }]}>
            {formatTime(activeRestTimer || 0)}
          </Text>
          <Text style={[styles.timerLabel, { color: theme.textSecondary }]}>remaining</Text>
        </View>
      </View>

      {/* Add Time Buttons */}
      <View style={styles.addTimeContainer}>
        <TouchableOpacity
          style={[styles.addTimeButton, { backgroundColor: theme.card }]}
          onPress={() => addExtraRestTime(30)}
        >
          <Ionicons name="add" size={20} color={theme.text} />
          <Text style={[styles.addTimeText, { color: theme.text }]}>30s</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.addTimeButton, { backgroundColor: theme.card }]}
          onPress={() => addExtraRestTime(60)}
        >
          <Ionicons name="add" size={20} color={theme.text} />
          <Text style={[styles.addTimeText, { color: theme.text }]}>1m</Text>
        </TouchableOpacity>
      </View>

      {/* Skip Button */}
      <TouchableOpacity
        style={[styles.skipButton, { backgroundColor: theme.error }]}
        onPress={handleSkip}
      >
        <Ionicons name="close-circle-outline" size={24} color="white" />
        <Text style={styles.skipButtonText}>Skip Rest</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 36,
  },
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  timerTextContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 64,
    fontWeight: '600',
  },
  timerLabel: {
    fontSize: 16,
    marginTop: 8,
  },
  addTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  addTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  addTimeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    margin: 20,
    padding: 16,
    borderRadius: 12,
  },
  skipButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default RestTimerScreen;
