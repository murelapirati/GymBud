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
  barcode?: string; // for scanned products
}

// Scanned product from OpenFoodFacts API
export interface ScannedProduct {
  barcode: string;
  name: string;
  brand?: string;
  servingSize: number; // in grams or ml
  servingSizeUnit: string; // 'g', 'ml', etc.
  totalSize?: number; // total product quantity (e.g., 500 for a 500ml bottle)
  totalSizeUnit?: string; // unit of totalSize
  nutriments: {
    energyKcal: number; // calories per 100g
    proteins: number; // grams per 100g
    carbohydrates: number; // grams per 100g
    fat: number; // grams per 100g
  };
  imageUrl?: string;
}

// Cached product for offline access
export interface CachedProduct extends ScannedProduct {
  cachedAt: number;
  lastUsed: number;
}

export interface DailyCalories {
  date: string; // YYYY-MM-DD format
  entries: FoodEntry[];
  totalCalories: number;
  targetCalories?: number;
}

export interface RecipeIngredient {
  id: string;
  name: string;
  amount: number;   // weight/volume used in this recipe
  unit: string;     // 'g' or 'ml'
  calories: number; // calculated for this amount
  protein: number;
  carbs: number;
  fat: number;
  imageUrl?: string;
  barcode?: string;
}

export interface Recipe {
  id: string;
  name: string;
  servings: number;         // how many portions this recipe makes
  totalWeightG?: number;    // optional: total finished dish weight in grams
  ingredients: RecipeIngredient[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  imageUri?: string;        // local device URI from camera / gallery
  notes?: string;
  createdAt: number;
  updatedAt: number;
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
  intensity?: number; // RPE 0-10
}

// Muscle & Body Map Types
export type MuscleGroup = 
  | 'chest' 
  | 'lats' 
  | 'upper_back' 
  | 'lower_back'
  | 'front_delts'
  | 'side_delts'
  | 'rear_delts'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'abs'
  | 'obliques'
  | 'quads'
  | 'hamstrings'
  | 'glutes'
  | 'calves';

export type RankTier = 
  | 'dirt' 
  | 'wood' 
  | 'stone' 
  | 'iron' 
  | 'bronze' 
  | 'gold' 
  | 'diamond' 
  | 'emerald' 
  | 'master' 
  | 'olympian';

export interface MuscleStatus {
  muscle: MuscleGroup;
  currentScore: number;
  bestScore: number;
  rank: RankTier;
  lastTrained: string; // YYYY-MM-DD
}

export interface MappedExercise {
  id: string;
  name: string;
  type: 'gym' | 'calisthenics' | 'cardio' | 'stretching';
  primaryMuscles: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];
  difficultyMultiplier: number; // 1.0 is standard (e.g. flat bench)
}

// Workout Template types
export interface WorkoutTemplate {
  id: string;
  name: string;
  workoutType: WorkoutType;
  exercises: TemplateExercise[];
  createdAt: number;
  lastUsed?: number;
}

export interface TemplateExercise {
  id: string;
  name: string;
  restTimer?: number; // for gym/calisthenics
  duration?: number; // for cardio/stretching (default duration)
  type?: 'gym' | 'calisthenics' | 'cardio' | 'stretching'; // exercise type within template
}

// Storage data structures
export interface CaloriesData {
  dailyEntries: Record<string, DailyCalories>; // key: YYYY-MM-DD
  recipes: Recipe[];
}

export interface WorkoutsData {
  workouts: Workout[];
}
