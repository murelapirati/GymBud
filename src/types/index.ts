// Calorie tracking types
export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  timestamp: number;
  date: string; // YYYY-MM-DD format
}

export interface DailyCalories {
  date: string; // YYYY-MM-DD format
  entries: FoodEntry[];
  totalCalories: number;
  targetCalories?: number;
}

export interface Recipe {
  id: string;
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  ingredients?: string[];
  instructions?: string;
  createdAt: number;
}

// Workout tracking types
export type WorkoutType = 'gym' | 'cardio' | 'calisthenics' | 'stretching';

export interface Exercise {
  id: string;
  name: string;
  sets: Set[];
  notes?: string;
}

export interface Set {
  id: string;
  reps: number;
  weight?: number;
  duration?: number; // in seconds
  completed: boolean;
}

// Gym workout - sets, reps, weight
export interface GymExercise {
  id: string;
  name: string;
  sets: {
    id: string;
    reps: number;
    weight: number;
    completed: boolean;
    completedAt?: Date;
  }[];
  restTimer: number;
  notes?: string;
}

// Cardio workout - just duration
export interface CardioExercise {
  id: string;
  name: string;
  duration: number; // in seconds
  distance?: number; // optional, in km
  notes?: string;
}

// Calisthenics - bodyweight + optional extra weight
export interface CalisthenicsExercise {
  id: string;
  name: string;
  sets: {
    id: string;
    reps: number;
    extraWeight?: number; // optional extra weight
    completed: boolean;
    completedAt?: Date;
  }[];
  restTimer: number;
  notes?: string;
}

// Stretching/Pilates - time-based named exercises
export interface StretchingExercise {
  id: string;
  name: string;
  duration: number; // in seconds
  notes?: string;
}

export interface Workout {
  id: string;
  date: string; // YYYY-MM-DD format
  workoutType: WorkoutType;
  exercises: Exercise[];
  duration?: number; // in minutes
  notes?: string;
  createdAt: number;
  intensity?: number;
}

// Storage data structures
export interface CaloriesData {
  dailyEntries: Record<string, DailyCalories>; // key: YYYY-MM-DD
  recipes: Recipe[];
}

export interface WorkoutsData {
  workouts: Workout[];
}
