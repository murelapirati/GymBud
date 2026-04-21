import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { lightThemeBase, darkThemeBase, sectionAccents, SectionKey, Theme } from '../utils/theme';
import { storage, STORAGE_KEYS } from '../utils/storage';

type ThemeContextType = {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  activeSection: SectionKey;
  setActiveSection: (section: SectionKey) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<SectionKey>('Calories');

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await storage.getItem<string>(STORAGE_KEYS.THEME);
      if (savedTheme !== null) {
        setIsDark(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = async () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    try {
      await storage.setItem(STORAGE_KEYS.THEME, newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  // Merge base theme with the active section's accent tokens
  const theme = useMemo<Theme>(() => {
    const base = isDark ? darkThemeBase : lightThemeBase;
    const accent = sectionAccents[activeSection];
    return {
      ...base,
      primary:     accent.primary,
      primaryDark: accent.primaryDark,
      primaryLight: accent.primaryLight,
      accent:      accent.primary,
      accentMuted: accent.accentMuted,
      tabBarActive: accent.primary,
    };
  }, [isDark, activeSection]);

  if (isLoading) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, activeSection, setActiveSection }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
