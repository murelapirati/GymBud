// ─── Per-section accent palettes ────────────────────────────────────────────
export const sectionAccents = {
  Calories: {
    primary: '#3B82F6',
    primaryDark: '#2563EB',
    primaryLight: '#93C5FD',
    accentMuted: '#3B82F622',
  },
  Library: {
    primary: '#F59E0B',
    primaryDark: '#D97706',
    primaryLight: '#FCD34D',
    accentMuted: '#F59E0B22',
  },
  Workouts: {
    primary: '#EF4444',
    primaryDark: '#DC2626',
    primaryLight: '#FCA5A5',
    accentMuted: '#EF444422',
  },
} as const;

export type SectionKey = keyof typeof sectionAccents;

// ─── Base themes (no accent tokens — injected at runtime by ThemeContext) ────
export const lightThemeBase = {
  // Backgrounds
  background: '#F8F8F8',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  cardBorder: '#EBEBEB',

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
  tabBarInactive: '#BBBAC5',

  // Workout type colors
  gym: '#EF4444',
  cardio: '#F87171',
  calisthenics: '#10B981',
  stretching: '#FBBF24',
};

export const darkThemeBase = {
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
  tabBarInactive: '#5C5A72',

  // Workout type colors
  gym: '#EF4444',
  cardio: '#F87171',
  calisthenics: '#34D399',
  stretching: '#FBBF24',
};

// Theme type is the base merged with accent tokens
export type Theme = typeof darkThemeBase & {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  accent: string;
  accentMuted: string;
  tabBarActive: string;
};

export const rankColors = {
  dirt: '#8B4513',     // SaddleBrown
  wood: '#DEB887',     // BurlyWood
  stone: '#A9A9A9',    // DarkGray
  iron: '#D3D3D3',     // LightGray (Shinier than stone)
  bronze: '#CD7F32',   // Bronze
  gold: '#FFD700',     // Gold
  diamond: '#106efaff',  // DeepSkyBlue (More vibrant)
  emerald: '#40e00fff', // Emerald
  master: '#e90606ff',   // Red
  olympian: '#aff3f8ff', // Holy Blue
} as const;
