export interface UserData {
  id: string;
  email: string;
  fullName?: string;
  token: string;
  isVerified: boolean;
}

export interface AuthState {
  user: UserData | null;
  isLoading: boolean;
  error: string | null;
}

export interface ThemeColors {
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

export type ThemeType = "light" | "dark";
