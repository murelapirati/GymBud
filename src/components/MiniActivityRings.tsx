import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface MiniActivityRingsProps {
  stepsProgress: number;
  exerciseProgress: number;
  caloriesProgress: number;
  size?: number;
}

export default function MiniActivityRings({
  stepsProgress,
  exerciseProgress,
  caloriesProgress,
  size = 32,
}: MiniActivityRingsProps) {
  const strokeWidth = size * 0.1; // 10% of size for mini version
  const gap = size * 0.04; // 4% gap between rings
  
  // Calculate radii for three concentric circles
  const outerRadius = (size / 2) - (strokeWidth / 2);
  const middleRadius = outerRadius - strokeWidth - gap;
  const innerRadius = middleRadius - strokeWidth - gap;
  
  const center = size / 2;
  
  // Ensure progress values are valid percentages (0-100 for main, 0-200 for overage support)
  const cappedStepsProgress = Math.max(0, Math.min(stepsProgress, 100));
  const cappedExerciseProgress = Math.max(0, Math.min(exerciseProgress, 100));
  
  // For calories, we need to handle overage (can go beyond 100%)
  const consumedCaloriesProgress = Math.min(Math.max(caloriesProgress, 0), 100);
  const overCaloriesProgress = Math.max(caloriesProgress - 100, 0);
  const cappedOverCaloriesProgress = Math.min(overCaloriesProgress, 100);
  
  // Calculate circumferences
  const getCircumference = (radius: number) => 2 * Math.PI * radius;
  
  const outerCircumference = getCircumference(outerRadius);
  const middleCircumference = getCircumference(middleRadius);
  const innerCircumference = getCircumference(innerRadius);
  
  // Calculate stroke dash offsets for progress
  const getStrokeDashoffset = (circumference: number, progress: number) => {
    return circumference - (circumference * progress) / 100;
  };
  
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Outer Ring - Calories Burned (Red) - Background */}
        <Circle
          cx={center}
          cy={center}
          r={outerRadius}
          stroke="rgba(255, 59, 48, 0.12)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Outer Ring - Consumed calories up to 100% (Primary color) */}
        <Circle
          cx={center}
          cy={center}
          r={outerRadius}
          stroke="#FF3B30"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={outerCircumference}
          strokeDashoffset={getStrokeDashoffset(outerCircumference, consumedCaloriesProgress)}
          strokeLinecap="round"
          rotation="-90"
          origin={`${center}, ${center}`}
        />
        {/* Outer Ring - Overage (Red overlay) - only shows when over 100% */}
        {overCaloriesProgress > 0 && (
          <Circle
            cx={center}
            cy={center}
            r={outerRadius}
            stroke="#D32F2F"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={outerCircumference}
            strokeDashoffset={getStrokeDashoffset(outerCircumference, cappedOverCaloriesProgress)}
            strokeLinecap="round"
            rotation="-90"
            origin={`${center}, ${center}`}
          />
        )}
        
        {/* Middle Ring - Exercise Minutes (Green) - Background */}
        <Circle
          cx={center}
          cy={center}
          r={middleRadius}
          stroke="rgba(52, 199, 89, 0.12)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Middle Ring - Progress */}
        <Circle
          cx={center}
          cy={center}
          r={middleRadius}
          stroke="#34C759"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={middleCircumference}
          strokeDashoffset={getStrokeDashoffset(middleCircumference, cappedExerciseProgress)}
          strokeLinecap="round"
          rotation="-90"
          origin={`${center}, ${center}`}
        />
        
        {/* Inner Ring - Steps (Blue) - Background */}
        <Circle
          cx={center}
          cy={center}
          r={innerRadius}
          stroke="rgba(83, 131, 184, 0.12)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Inner Ring - Progress */}
        <Circle
          cx={center}
          cy={center}
          r={innerRadius}
          stroke="#5383B8"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={innerCircumference}
          strokeDashoffset={getStrokeDashoffset(innerCircumference, cappedStepsProgress)}
          strokeLinecap="round"
          rotation="-90"
          origin={`${center}, ${center}`}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
