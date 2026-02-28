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
  const { activeRestTimer } = useActiveWorkout();

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: '#f59e0b' }]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <Ionicons name="timer" size={18} color="white" />
          <Text style={styles.text}>Rest Timer</Text>
          <Text style={styles.timer}>{formatTime(activeRestTimer || 0)}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="white" />
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
});

export default RestTimerStatusBar;
