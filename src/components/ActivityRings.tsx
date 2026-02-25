import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface ActivityRingsProps {
  steps: number;
  stepsGoal: number;
  exerciseMinutes: number;
  exerciseGoal: number;
  caloriesBurned: number;
  caloriesGoal: number;
  size?: number;
}

export default function ActivityRings({
  steps,
  stepsGoal,
  exerciseMinutes,
  exerciseGoal,
  caloriesBurned,
  caloriesGoal,
  size = 120,
}: ActivityRingsProps) {
  const strokeWidth = size * 0.08; // 8% of size
  const gap = size * 0.05; // 5% gap between rings
  
  // Calculate radii for three concentric circles
  const outerRadius = (size / 2) - (strokeWidth / 2);
  const middleRadius = outerRadius - strokeWidth - gap;
  const innerRadius = middleRadius - strokeWidth - gap;
  
  const center = size / 2;
  
  // Calculate progress percentages (cap at 100%)
  const stepsProgress = Math.min((steps / stepsGoal) * 100, 100);
  const exerciseProgress = Math.min((exerciseMinutes / exerciseGoal) * 100, 100);
  const caloriesProgress = Math.min((caloriesBurned / caloriesGoal) * 100, 100);
  
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
        {/* Outer Ring - Calories Burned (Red) */}
        {/* Background */}
        <Circle
          cx={center}
          cy={center}
          r={outerRadius}
          stroke="rgba(255, 59, 48, 0.15)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress */}
        <Circle
          cx={center}
          cy={center}
          r={outerRadius}
          stroke="#FF453A"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={outerCircumference}
          strokeDashoffset={getStrokeDashoffset(outerCircumference, caloriesProgress)}
          strokeLinecap="round"
          rotation="-90"
          origin={`${center}, ${center}`}
        />
        
        {/* Middle Ring - Exercise Minutes (Green) */}
        {/* Background */}
        <Circle
          cx={center}
          cy={center}
          r={middleRadius}
          stroke="rgba(52, 199, 89, 0.15)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress */}
        <Circle
          cx={center}
          cy={center}
          r={middleRadius}
          stroke="#32D74B"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={middleCircumference}
          strokeDashoffset={getStrokeDashoffset(middleCircumference, exerciseProgress)}
          strokeLinecap="round"
          rotation="-90"
          origin={`${center}, ${center}`}
        />
        
        {/* Inner Ring - Steps (Blue) */}
        {/* Background */}
        <Circle
          cx={center}
          cy={center}
          r={innerRadius}
          stroke="rgba(83, 131, 184, 0.15)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress */}
        <Circle
          cx={center}
          cy={center}
          r={innerRadius}
          stroke="#0A84FF"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={innerCircumference}
          strokeDashoffset={getStrokeDashoffset(innerCircumference, stepsProgress)}
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
