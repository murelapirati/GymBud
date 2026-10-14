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
  MEASUREMENT_SYSTEM: '@gymapp_measurement_system',
  WORKOUT_TEMPLATES: '@gymapp_workout_templates',
  PROMPT_SAVE_TEMPLATE: '@gymapp_prompt_save_template',
  PRODUCT_CACHE: '@gymapp_product_cache',
  LIBRARY_COLLAPSED_SECTIONS: '@gymapp_library_collapsed_sections',
  CUSTOM_EXERCISES: '@gymapp_custom_exercises',
  MUSCLE_STATUS: '@gymapp_muscle_status',
  BODY_GENDER: '@gymapp_body_gender',
  RANKING_VERSION: '@gymapp_ranking_version',
  USER_BODYWEIGHT: '@gymapp_user_bodyweight',
  RECENT_FOODS: '@gymapp_recent_foods',
  USER_FOODS: '@gymapp_user_foods',
  LIBRARY_FOLDERS: '@gymapp_library_folders',
  REST_TIMER_SOUND: '@gymapp_rest_timer_sound',
  REST_TIMER_VIBRATION: '@gymapp_rest_timer_vibration',
  REST_TIMER_NOTIFICATION: '@gymapp_rest_timer_notification',
} as const;

// Generic storage functions
export const storage = {
  // Save data
  setItem: async (key: string, value: unknown): Promise<void> => {
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
