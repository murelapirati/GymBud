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

export interface Workout {
  id: string;
  date: string; // YYYY-MM-DD format
  exercises: Exercise[];
  duration?: number; // in minutes
  notes?: string;
  createdAt: number;
}

// Storage data structures
export interface CaloriesData {
  dailyEntries: Record<string, DailyCalories>; // key: YYYY-MM-DD
  recipes: Recipe[];
}

export interface WorkoutsData {
  workouts: Workout[];
}
