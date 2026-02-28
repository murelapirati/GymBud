import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
export const STORAGE_KEYS = {
  THEME: '@gymapp_theme',
  CALORIES: '@gymapp_calories',
  WORKOUTS: '@gymapp_workouts',
  WORKOUT_HISTORY: '@gymapp_workout_history',
  DAILY_ACTIVITY: '@gymapp_daily_activity',
  RECIPES: '@gymapp_recipes',
  GOALS: '@gymapp_goals',
  GOAL_PRESETS: '@gymapp_goal_presets',
  WORKOUT_GOALS: '@gymapp_workout_goals',
  STEP_OFFSET: '@gymapp_step_offset',
  STEP_MULTIPLIER: '@gymapp_step_multiplier',
} as const;

// Generic storage functions
export const storage = {
  // Save data
  setItem: async (key: string, value: any): Promise<void> => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      throw error;
    }
  },

  // Get data
  getItem: async <T>(key: string): Promise<T | null> => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      if (jsonValue == null) return null;
      
      try {
        return JSON.parse(jsonValue);
      } catch (parseError) {
        // If JSON parse fails, clear the corrupted value
        console.warn(`Corrupted data in ${key}, clearing it`);
        await AsyncStorage.removeItem(key);
        return null;
      }
    } catch (error) {
      console.error(`Error loading ${key}:`, error);
      return null;
    }
  },

  // Remove data
  removeItem: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
      throw error;
    }
  },

  // Clear all app data
  clearAll: async (): Promise<void> => {
    try {
      const keys = Object.values(STORAGE_KEYS);
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  },
};
