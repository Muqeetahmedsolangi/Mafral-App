// src/styles/designTokens.ts
/**
 * Design System Tokens
 * Based on provided design guidelines
 */

export const typography = {
  // Font families
  fontFamily: {
    inter: "Inter",
    // Add more font families if needed
  },

  // Heading styles
  heading: {
    h1: {
      fontSize: 32,
      lineHeight: 48,
      letterSpacing: 0,
      fontWeight: "600", // Semi Bold
    },
    h2: {
      fontSize: 28,
      lineHeight: 30,
      letterSpacing: 0,
      fontWeight: "600", // Semi Bold
    },
    h3: {
      fontSize: 20,
      lineHeight: 28,
      letterSpacing: 0,
      fontWeight: "600", // Semi Bold
    },
    h4: {
      fontSize: 18,
      lineHeight: 24, // Auto
      letterSpacing: 0,
      fontWeight: "600", // Semi Bold
    },
    h5: {
      fontSize: 16,
      lineHeight: 24, // Auto
      letterSpacing: 0,
      fontWeight: "600", // Semi Bold
    },
    h6: {
      fontSize: 14,
      lineHeight: 20, // Auto
      letterSpacing: 0,
      fontWeight: "600", // Semi Bold
    },
  },

  // Body text styles
  body: {
    body1: {
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 0,
      fontWeight: "400", // Regular
    },
    body2: {
      fontSize: 14,
      lineHeight: 22,
      letterSpacing: 0,
      fontWeight: "400", // Regular
    },
    body3: {
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: 0,
      fontWeight: "500", // Medium
    },
    body4: {
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: 0,
      fontWeight: "400", // Regular
    },
    body5: {
      fontSize: 10,
      lineHeight: 16, // Auto
      letterSpacing: 0,
      fontWeight: "400", // Regular
    },
    body6: {
      fontSize: 8,
      lineHeight: 10,
      letterSpacing: 0,
      fontWeight: "500", // Medium
    },
  },

  // Button text styles
  button: {
    button1: {
      fontSize: 14,
      lineHeight: 18,
      letterSpacing: 0,
      fontWeight: "600", // Semi Bold
    },
    button2: {
      fontSize: 12,
      lineHeight: 20,
      letterSpacing: 0,
      fontWeight: "600", // Semi Bold
    },
    button3: {
      fontSize: 10,
      lineHeight: 14, // Auto
      letterSpacing: 0,
      fontWeight: "600", // Semi Bold
    },
  },

  // Caption text styles
  caption: {
    caption1: {
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 0,
      fontWeight: "400", // Regular
    },
    caption2: {
      fontSize: 14,
      lineHeight: 20, // Auto
      letterSpacing: 0,
      fontWeight: "400", // Regular
    },
    caption3: {
      fontSize: 14,
      lineHeight: 24,
      letterSpacing: 0,
      fontWeight: "600", // Semi Bold
    },
    caption4: {
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: 0,
      fontWeight: "500", // Medium
    },
    caption5: {
      fontSize: 12,
      lineHeight: 12,
      letterSpacing: 0,
      fontWeight: "400", // Regular
    },
    caption6: {
      fontSize: 10,
      lineHeight: 14, // Auto
      letterSpacing: 0,
      fontWeight: "600", // Semi Bold
    },
    caption7: {
      fontSize: 6,
      lineHeight: 8, // Auto
      letterSpacing: 0,
      fontWeight: "600", // Semi Bold
    },
  },
};

// Color palette based on provided design
export const colors = {
  // Primary colors
  primary: {
    orange: "#FF7800",
  },

  // Secondary colors
  secondary: {
    yellow: "#F0AD00",
    blue: "#298DF8",
    green: "#0FD186",
    darkOrange: "#884200",
    white: "#FFFFFF",
    grey: "#F0F0F0",
    grey2: "#D7D7D7",
    softDarkish: "#4D4D4D",
  },

  // Gradient colors
  gradient: {
    orangeLinear: ["#FF7800", "#FF7800"],
    blackLinear: ["#171717", "#171717"],
    buttonLinear: ["#1D1D1D", "#1D1D1D"],
    overlayLinear: ["#FFFFFF", "#F0F0F0"],
  },

  // Text colors
  text: {
    light: "#FFFFFF",
    dark: "#000000",
  },

  // State colors
  state: {
    info: "#298DF8",
    success: "#0FD186",
    warning: "#F0AD00",
    error: "#F04D4D",
  },

  // Background colors
  background: {
    light: "#FFFFFF",
    dark: "#000000",
    info: "#F0F8FF",
  },
};

// Spacing system
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border radius
export const borderRadius = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  round: 999,
};

// Shadows
export const shadows = {
  light: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 3,
    },
    lg: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 6,
    },
  },
  dark: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 1.5,
      elevation: 2,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.36,
      shadowRadius: 3.22,
      elevation: 4,
    },
    lg: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 5.65,
      elevation: 8,
    },
  },
};
