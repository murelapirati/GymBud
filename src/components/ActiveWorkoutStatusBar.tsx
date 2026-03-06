import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useActiveWorkout } from '../context/ActiveWorkoutContext';

interface ActiveWorkoutStatusBarProps {
  onPress: () => void;
}

const ActiveWorkoutStatusBar: React.FC<ActiveWorkoutStatusBarProps> = ({ onPress }) => {
  const { theme } = useTheme();
  const { workoutDuration, activeRestTimer, workoutType } = useActiveWorkout();

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getWorkoutTypeInfo = () => {
    switch (workoutType) {
      case 'gym':
        return { icon: 'barbell' as keyof typeof Ionicons.glyphMap, label: 'Gym' };
      case 'cardio':
        return { icon: 'heart' as keyof typeof Ionicons.glyphMap, label: 'Cardio' };
      case 'calisthenics':
        return { icon: 'body' as keyof typeof Ionicons.glyphMap, label: 'Calisthenics' };
      case 'stretching':
        return { icon: 'fitness' as keyof typeof Ionicons.glyphMap, label: 'Stretching' };
      default:
        return { icon: 'barbell' as keyof typeof Ionicons.glyphMap, label: 'Workout' };
    }
  };

  const workoutInfo = getWorkoutTypeInfo();

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: '#10b981' }]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <Ionicons name={workoutInfo.icon} size={18} color="white" />
          <Text style={styles.text}>Active {workoutInfo.label} Workout</Text>
          <Text style={styles.timer}>{formatTime(workoutDuration)}</Text>
        </View>
        {activeRestTimer !== null && activeRestTimer > 0 && (
          <View style={styles.restSection}>
            <Ionicons name="timer-outline" size={16} color="white" />
            <Text style={styles.restTimer}>Rest: {formatTime(activeRestTimer)}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 16,
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
  text: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  timer: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.9,
  },
  restSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  restTimer: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default ActiveWorkoutStatusBar;
