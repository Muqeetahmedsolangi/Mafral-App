// context/ThemeContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";

// Theme type definition
type ThemeType = "light" | "dark" | "system";

// Theme color definitions
interface ThemeColors {
  background: string;
  card: string;
  surface: string;
  surfaceVariant: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  secondary: {
    yellow: string;
    blue: string;
    green: string;
    darkOrange: string;
  };
  info: string;
  success: string;
  warning: string;
  error: string;
  border: string;
  divider: string;
  icon: string;
  iconInactive: string;
  tabBar: string;
  tabBarBorder: string;
  tabBarActive: string;
  tabBarInactive: string;
  tabBarActiveIndicator: string;
}

// Create light and dark color themes
const lightColors: ThemeColors = {
  background: "#FFFFFF",
  card: "#FFFFFF",
  surface: "#F8F8F8",
  surfaceVariant: "#F0F0F0",
  text: "#000000",
  textSecondary: "#333333",
  textMuted: "#757575",
  primary: "#FF5722", // Orange primary color
  secondary: {
    yellow: "#FFC107",
    blue: "#2196F3",
    green: "#4CAF50",
    darkOrange: "#E64A19",
  },
  info: "#2196F3",
  success: "#4CAF50",
  warning: "#FFC107",
  error: "#F44336",
  border: "#CCCCCC",
  divider: "#EEEEEE",
  icon: "#000000",
  iconInactive: "#8E8E8E",
  tabBar: "#FFFFFF",
  tabBarBorder: "rgba(0, 0, 0, 0.1)",
  tabBarActive: "#000000",
  tabBarInactive: "#8E8E8E",
  tabBarActiveIndicator: "#FF5722",
};

const darkColors: ThemeColors = {
  background: "#121212",
  card: "#1E1E1E",
  surface: "#282828",
  surfaceVariant: "#323232",
  text: "#FFFFFF",
  textSecondary: "#E0E0E0",
  textMuted: "#AAAAAA",
  primary: "#FF7043", // Slightly lighter orange for dark mode
  secondary: {
    yellow: "#FFD54F",
    blue: "#64B5F6",
    green: "#81C784",
    darkOrange: "#FF8A65",
  },
  info: "#64B5F6",
  success: "#81C784",
  warning: "#FFD54F",
  error: "#E57373",
  border: "#444444",
  divider: "#333333",
  icon: "#FFFFFF",
  iconInactive: "#8E8E8E",
  tabBar: "#1E1E1E",
  tabBarBorder: "rgba(255, 255, 255, 0.1)",
  tabBarActive: "#FFFFFF",
  tabBarInactive: "#8E8E8E",
  tabBarActiveIndicator: "#FF7043",
};

// Theme context type
interface ThemeContextType {
  theme: ThemeType;
  isDarkMode: boolean;
  colors: ThemeColors;
  setTheme: (theme: ThemeType) => void;
  toggleTheme: () => void;
  isOverridingSystem: boolean;
  resetToSystemTheme: () => void;
}

// Theme storage key - this will persist across app restarts and sign-outs
const THEME_STORAGE_KEY = "app_theme";

// Create context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeType>("system");
  const [isLoading, setIsLoading] = useState(true);

  // Load saved theme from storage on component mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme) {
          setThemeState(savedTheme as ThemeType);
        }
      } catch (error) {
        console.error("Failed to load theme:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, []);

  // Determine if dark mode should be active
  const isDarkMode =
    theme === "system" ? systemColorScheme === "dark" : theme === "dark";

  // Save theme to storage whenever it changes
  const setTheme = async (newTheme: ThemeType) => {
    setThemeState(newTheme);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
      console.log(`Theme changed to ${newTheme} and saved to storage`);
    } catch (error) {
      console.error("Failed to save theme:", error);
    }
  };

  // Toggle between light and dark
  const toggleTheme = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setTheme(newTheme);
  };

  // Check if user is overriding system preference
  const isOverridingSystem = theme !== "system";

  // Reset to system theme
  const resetToSystemTheme = () => {
    setTheme("system");
  };

  // Get current theme colors
  const colors = isDarkMode ? darkColors : lightColors;

  // Context value
  const contextValue: ThemeContextType = {
    theme,
    isDarkMode,
    colors,
    setTheme,
    toggleTheme,
    isOverridingSystem,
    resetToSystemTheme,
  };

  // Display loading indicator while theme is loading
  if (isLoading) {
    // You can return a loading indicator here if needed
    return null;
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for using theme
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
