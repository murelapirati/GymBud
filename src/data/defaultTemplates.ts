import { WorkoutTemplate } from '../types';

export const DEFAULT_TEMPLATES: WorkoutTemplate[] = [
  {
    id: 'default_push',
    name: 'Push (Chest / Shoulders / Triceps)',
    workoutType: 'strength',
    createdAt: 0,
    exercises: [
      { id: 'dt_1', name: 'Dumbbell Flyes', type: 'strength', equipment: 'dumbbell', mechanic: 'isolation' },
      { id: 'dt_2', name: 'Dumbbell Bench Press', type: 'strength', equipment: 'dumbbell', mechanic: 'compound' },
      { id: 'dt_3', name: 'Lateral Raises', type: 'strength', equipment: 'dumbbell', mechanic: 'isolation' },
      { id: 'dt_4', name: 'Dumbbell Shoulder Press', type: 'strength', equipment: 'dumbbell', mechanic: 'compound' },
      { id: 'dt_5', name: 'Lying Dumbbell Tricep Extension', type: 'strength', equipment: 'dumbbell', mechanic: 'isolation' },
    ],
  },
  {
    id: 'default_pull',
    name: 'Pull (Back / Biceps)',
    workoutType: 'strength',
    createdAt: 0,
    exercises: [
      { id: 'dt_6', name: 'Seated Bent-Over Rear Delt Raise', type: 'strength', equipment: 'dumbbell', mechanic: 'isolation' },
      { id: 'dt_7', name: 'Bent Over Two-Dumbbell Row', type: 'strength', equipment: 'dumbbell', mechanic: 'compound' },
      { id: 'dt_8', name: 'Concentration Curls', type: 'strength', equipment: 'dumbbell', mechanic: 'isolation' },
      { id: 'dt_9', name: 'Hammer Curl', type: 'strength', equipment: 'dumbbell', mechanic: 'compound' },
    ],
  },
  {
    id: 'default_legs',
    name: 'Legs (Quads / Hamstrings / Glutes)',
    workoutType: 'strength',
    createdAt: 0,
    exercises: [
      { id: 'dt_10', name: 'Stiff-Legged Dumbbell Deadlift', type: 'strength', equipment: 'dumbbell', mechanic: 'isolation' },
      { id: 'dt_11', name: 'Dumbbell Squat', type: 'strength', equipment: 'dumbbell', mechanic: 'compound' },
      { id: 'dt_12', name: 'Bulgarian Split Squat', type: 'strength', equipment: 'dumbbell', mechanic: 'compound' },
      { id: 'dt_13', name: 'Dumbbell Lunges', type: 'strength', equipment: 'dumbbell', mechanic: 'compound' },
    ],
  },
  {
    id: 'default_upper',
    name: 'Upper Body (Full)',
    workoutType: 'strength',
    createdAt: 0,
    exercises: [
      { id: 'dt_14', name: 'Dumbbell Flyes', type: 'strength', equipment: 'dumbbell', mechanic: 'isolation' },
      { id: 'dt_15', name: 'Dumbbell Bench Press', type: 'strength', equipment: 'dumbbell', mechanic: 'compound' },
      { id: 'dt_16', name: 'Bent Over Two-Dumbbell Row', type: 'strength', equipment: 'dumbbell', mechanic: 'compound' },
      { id: 'dt_17', name: 'Lateral Raises', type: 'strength', equipment: 'dumbbell', mechanic: 'isolation' },
      { id: 'dt_18', name: 'Dumbbell Shoulder Press', type: 'strength', equipment: 'dumbbell', mechanic: 'compound' },
      { id: 'dt_19', name: 'Concentration Curls', type: 'strength', equipment: 'dumbbell', mechanic: 'isolation' },
    ],
  },
  {
    id: 'default_fullbody',
    name: 'Full Body',
    workoutType: 'strength',
    createdAt: 0,
    exercises: [
      { id: 'dt_20', name: 'Dumbbell Squat', type: 'strength', equipment: 'dumbbell', mechanic: 'compound' },
      { id: 'dt_21', name: 'Dumbbell Bench Press', type: 'strength', equipment: 'dumbbell', mechanic: 'compound' },
      { id: 'dt_22', name: 'Bent Over Two-Dumbbell Row', type: 'strength', equipment: 'dumbbell', mechanic: 'compound' },
      { id: 'dt_23', name: 'Dumbbell Shoulder Press', type: 'strength', equipment: 'dumbbell', mechanic: 'compound' },
      { id: 'dt_24', name: 'Hammer Curl', type: 'strength', equipment: 'dumbbell', mechanic: 'compound' },
      { id: 'dt_25', name: 'Lying Dumbbell Tricep Extension', type: 'strength', equipment: 'dumbbell', mechanic: 'isolation' },
    ],
  },
];
