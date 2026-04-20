import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';

type CircularProgressProps = {
  size?: number;
  strokeWidth?: number;
  caloriesConsumed: number;
  caloriesTarget: number;
};

export const CircularProgress: React.FC<CircularProgressProps> = ({
  size = 200,
  strokeWidth = 20,
  caloriesConsumed,
  caloriesTarget,
}) => {
  const { theme } = useTheme();
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  // Calculate progress percentages
  const consumedPercentage = Math.min((caloriesConsumed / caloriesTarget) * 100, 100);
  const overPercentage = Math.min(Math.max(((caloriesConsumed - caloriesTarget) / caloriesTarget) * 100, 0), 100);
  
  // Calculate stroke dash offsets
  const consumedOffset = circumference - (consumedPercentage / 100) * circumference;
  const overOffset = circumference - (overPercentage / 100) * circumference;
  
  const caloriesRemaining = caloriesTarget - caloriesConsumed;
  const isOverLimit = caloriesConsumed > caloriesTarget;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background circle (gray) */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme.border}
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Consumed calories circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme.primary}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={consumedOffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
        
        {/* Over limit circle (red) - only shows when over target */}
        {isOverLimit && (
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={theme.error}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={overOffset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        )}
      </Svg>
      
      {/* Center text */}
      <View style={styles.centerContent}>
        <Text style={[styles.remainingText, { 
          color: isOverLimit ? theme.error : theme.primary,
          textShadowColor: 'rgba(0, 0, 0, 0.3)',
          textShadowOffset: { width: 0, height: 2 },
          textShadowRadius: 4,
        }]}>
          {isOverLimit ? '+' : ''}{Math.abs(caloriesRemaining).toLocaleString()}
        </Text>
        <Text style={[styles.label, { 
          color: theme.textSecondary,
          textShadowColor: 'rgba(0, 0, 0, 0.2)',
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 2,
        }]}>
          {isOverLimit ? 'over' : 'remaining'}
        </Text>
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <Text style={[styles.targetText, { 
          color: theme.text,
          textShadowColor: 'rgba(0, 0, 0, 0.2)',
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 2,
        }]}>
          {caloriesConsumed.toLocaleString()} / {caloriesTarget.toLocaleString()}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    transform: [{ rotate: '0deg' }],
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  remainingText: {
    fontSize: 40,
    fontWeight: '600',
  },
  label: {
    fontSize: 16,
    marginTop: 4,
    fontWeight: '600',
  },
  divider: {
    width: 40,
    height: 1,
    marginVertical: 8,
  },
  targetText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
