// context/ThemeContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Appearance } from 'react-native';
import { colors, typography, shadows, spacing, borderRadius } from '@/app/styles/designTokens';

type ThemeType = 'light' | 'dark';

interface ThemeColors {
  // Background colors
  background: string;
  card: string;
  surface: string;
  surfaceVariant: string;
  
  // Text colors
  text: string;
  textSecondary: string;
  textMuted: string;
  
  // Brand colors
  primary: string;
  secondary: {
    yellow: string;
    blue: string;
    green: string;
    darkOrange: string;
  };
  
  // State colors
  info: string;
  success: string;
  warning: string;
  error: string;
  
  // UI element colors
  border: string;
  divider: string;
  icon: string;
  iconInactive: string;
  
  // Tab bar specific
  tabBar: string;
  tabBarBorder: string;
  tabBarActive: string;
  tabBarInactive: string;
  tabBarActiveIndicator: string;
}

interface ThemeContextType {
  theme: ThemeType;
  isDarkMode: boolean;
  toggleTheme: () => void;
  resetToSystemTheme: () => void;
  isOverridingSystem: boolean;
  colors: ThemeColors;
  typography: typeof typography;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  shadows: typeof shadows.light | typeof shadows.dark;
}

interface ThemeProviderProps {
  children: ReactNode;
}

// Create light and dark color themes
const lightColors: ThemeColors = {
  // Background colors
  background: colors.background.light,
  card: '#FFFFFF',
  surface: '#F8F8F8',
  surfaceVariant: '#F0F0F0',
  
  // Text colors
  text: colors.text.dark,
  textSecondary: '#333333',
  textMuted: '#757575',
  
  // Brand colors
  primary: colors.primary.orange,
  secondary: {
    yellow: colors.secondary.yellow,
    blue: colors.secondary.blue,
    green: colors.secondary.green,
    darkOrange: colors.secondary.darkOrange,
  },
  
  // State colors
  info: colors.state.info,
  success: colors.state.success,
  warning: colors.state.warning,
  error: colors.state.error,
  
  // UI element colors
  border: colors.secondary.grey2,
  divider: colors.secondary.grey,
  icon: '#000000',
  iconInactive: '#8E8E8E',
  
  // Tab bar specific
  tabBar: '#FFFFFF',
  tabBarBorder: 'rgba(0, 0, 0, 0.1)',
  tabBarActive: '#000000',
  tabBarInactive: '#8E8E8E',
  tabBarActiveIndicator: colors.primary.orange,
};

const darkColors: ThemeColors = {
  // Background colors
  background: colors.background.dark,
  card: '#1A1A1A',
  surface: '#262626',
  surfaceVariant: '#2C2C2C',
  
  // Text colors
  text: colors.text.light,
  textSecondary: '#E0E0E0',
  textMuted: '#A0A0A0',
  
  // Brand colors
  primary: colors.primary.orange,
  secondary: {
    yellow: colors.secondary.yellow,
    blue: colors.secondary.blue,
    green: colors.secondary.green,
    darkOrange: colors.secondary.darkOrange,
  },
  
  // State colors
  info: colors.state.info,
  success: colors.state.success,
  warning: colors.state.warning,
  error: colors.state.error,
  
  // UI element colors
  border: '#3A3A3A',
  divider: '#3A3A3A',
  icon: '#FFFFFF',
  iconInactive: '#8E8E8E',
  
  // Tab bar specific
  tabBar: '#000000',
  tabBarBorder: '#262626',
  tabBarActive: '#FFFFFF',
  tabBarInactive: '#8E8E8E',
  tabBarActiveIndicator: colors.primary.orange,
};

// Default context
const defaultContextValue: ThemeContextType = {
  theme: 'light',
  isDarkMode: false,
  toggleTheme: () => {},
  resetToSystemTheme: () => {},
  isOverridingSystem: false,
  colors: lightColors,
  typography,
  spacing,
  borderRadius,
  shadows: shadows.light,
};

// Create context
const ThemeContext = createContext<ThemeContextType>(defaultContextValue);

// Custom hook for easily accessing theme data
export const useTheme = () => useContext(ThemeContext);

// Provider component
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  // Set initial theme based on device settings
  const [theme, setTheme] = useState<ThemeType>(Appearance.getColorScheme() as ThemeType || 'light');
  
  // Track if we're manually overriding the system theme
  const [isOverridingSystem, setIsOverridingSystem] = useState(false);
  
  // Listen for system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      // Only update if we're not overriding the system theme
      if (!isOverridingSystem) {
        setTheme(colorScheme as ThemeType || 'light');
      }
    });
    
    return () => subscription.remove();
  }, [isOverridingSystem]);
  
  // Function to toggle theme
  const toggleTheme = () => {
    setIsOverridingSystem(true);
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  // Function to reset to system theme
  const resetToSystemTheme = () => {
    setIsOverridingSystem(false);
    setTheme(Appearance.getColorScheme() as ThemeType || 'light');
  };
  
  // Determine if we're in dark mode
  const isDarkMode = theme === 'dark';
  
  // Get the appropriate colors and shadows based on the theme
  const themeColors = isDarkMode ? darkColors : lightColors;
  const themeShadows = isDarkMode ? shadows.dark : shadows.light;
  
  return (
    <ThemeContext.Provider 
      value={{
        theme,
        isDarkMode,
        toggleTheme,
        resetToSystemTheme,
        isOverridingSystem,
        colors: themeColors,
        typography,
        spacing,
        borderRadius,
        shadows: themeShadows,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};