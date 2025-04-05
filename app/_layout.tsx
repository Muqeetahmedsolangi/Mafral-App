// app/_layout.tsx
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { SplashScreen } from "expo-router";
import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";

// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync();

// Root layout component
export default function RootLayout() {
  useEffect(() => {
    // Hide splash screen after a short delay
    const hideSplash = setTimeout(() => {
      SplashScreen.hideAsync().catch(() => {
        // Ignore if splash screen is already hidden
      });
    }, 800);

    return () => clearTimeout(hideSplash);
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <Slot />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
