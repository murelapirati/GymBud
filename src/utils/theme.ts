export const lightTheme = {
  // Accent
  primary: '#7C5CFC',
  primaryDark: '#5B3ED6',
  primaryLight: '#A98DFD',
  accent: '#7C5CFC',
  accentMuted: '#7C5CFC18',

  // Backgrounds
  background: '#F4F3FF',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  cardBorder: '#EAE8FF',

  // Text
  text: '#0F0F14',
  textSecondary: '#5C5A72',
  textTertiary: '#9996B3',

  // UI
  border: '#E5E3F5',
  success: '#10B981',
  error: '#F87171',
  warning: '#FBBF24',

  // Tab bar
  tabBar: '#FFFFFF',
  tabBarActive: '#7C5CFC',
  tabBarInactive: '#9996B3',

  // Workout type colors
  gym: '#7C5CFC',
  cardio: '#F87171',
  calisthenics: '#10B981',
  stretching: '#FBBF24',
};

export const darkTheme = {
  // Accent
  primary: '#7C5CFC',
  primaryDark: '#5B3ED6',
  primaryLight: '#A98DFD',
  accent: '#7C5CFC',
  accentMuted: '#7C5CFC22',

  // Backgrounds
  background: '#0F0F14',
  surface: '#1A1A22',
  card: '#242430',
  cardBorder: '#2E2E3E',

  // Text
  text: '#F0EEFF',
  textSecondary: '#9996B3',
  textTertiary: '#5C5A72',

  // UI
  border: '#2E2E3E',
  success: '#34D399',
  error: '#F87171',
  warning: '#FBBF24',

  // Tab bar
  tabBar: '#1A1A22',
  tabBarActive: '#7C5CFC',
  tabBarInactive: '#5C5A72',

  // Workout type colors
  gym: '#7C5CFC',
  cardio: '#F87171',
  calisthenics: '#34D399',
  stretching: '#FBBF24',
};

export type Theme = typeof darkTheme;
