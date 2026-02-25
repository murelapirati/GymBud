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
  
  // Cap progress at 100%
  const cappedStepsProgress = Math.min(stepsProgress, 100);
  const cappedExerciseProgress = Math.min(exerciseProgress, 100);
  const cappedCaloriesProgress = Math.min(caloriesProgress, 100);
  
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
          stroke="rgba(255, 59, 48, 0.15)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Outer Ring - Progress */}
        <Circle
          cx={center}
          cy={center}
          r={outerRadius}
          stroke="#FF453A"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={outerCircumference}
          strokeDashoffset={getStrokeDashoffset(outerCircumference, cappedCaloriesProgress)}
          strokeLinecap="round"
          rotation="-90"
          origin={`${center}, ${center}`}
        />
        
        {/* Middle Ring - Exercise Minutes (Green) - Background */}
        <Circle
          cx={center}
          cy={center}
          r={middleRadius}
          stroke="rgba(52, 199, 89, 0.15)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Middle Ring - Progress */}
        <Circle
          cx={center}
          cy={center}
          r={middleRadius}
          stroke="#32D74B"
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
          stroke="rgba(83, 131, 184, 0.15)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Inner Ring - Progress */}
        <Circle
          cx={center}
          cy={center}
          r={innerRadius}
          stroke="#0A84FF"
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
