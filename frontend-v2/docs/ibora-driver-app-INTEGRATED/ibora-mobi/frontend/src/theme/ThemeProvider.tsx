import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from './tokens';

export type ThemeMode = 'light' | 'dark' | 'auto';
export type ActiveTheme = 'light' | 'dark';

interface ThemeColors {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  secondary: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  background: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  divider: string;
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    disabled: string;
  };
  overlay: string;
}

interface ThemeContextType {
  theme: ActiveTheme;
  colors: ThemeColors;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@ibora_theme_mode';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('auto');
  
  // Determine active theme based on mode
  const activeTheme: ActiveTheme = 
    themeMode === 'auto' 
      ? (systemColorScheme || 'light')
      : themeMode;
  
  // Get theme colors
  const themeColors: ThemeColors = {
    primary: colors.primary,
    primaryDark: colors.primaryDark,
    primaryLight: colors.primaryLight,
    secondary: colors.secondary,
    success: colors.success,
    warning: colors.warning,
    danger: colors.danger,
    info: colors.info,
    ...(activeTheme === 'dark' ? colors.dark : colors.light),
  };
  
  // Load theme preference from storage
  useEffect(() => {
    loadThemePreference();
  }, []);
  
  const loadThemePreference = async () => {
    try {
      const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (saved) {
        setThemeModeState(saved as ThemeMode);
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };
  
  const setThemeMode = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
      setThemeModeState(mode);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };
  
  const toggleTheme = () => {
    const newMode = activeTheme === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
  };
  
  return (
    <ThemeContext.Provider
      value={{
        theme: activeTheme,
        colors: themeColors,
        themeMode,
        setThemeMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const useThemedStyles = <T extends Record<string, any>>(
  stylesFn: (colors: ThemeColors, theme: ActiveTheme) => T
): T => {
  const { colors, theme } = useTheme();
  return stylesFn(colors, theme);
};
