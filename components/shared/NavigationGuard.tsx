import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

export function NavigationGuard() {
  const { user, isLoading } = useAuth();
  const { colors } = useTheme();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    // Only navigate when auth state is determined (not loading)
    if (!isLoading && !isNavigating) {
      setIsNavigating(true);

      console.log("Auth state:", {
        user: user?.email,
        isAuthenticated: !!user,
        isVerified: user?.isVerified,
      });

      // Clear any existing navigation before redirecting
      setTimeout(() => {
        if (!user) {
          console.log("Redirecting to signin...");
          router.replace("/auth/signin");
        } else if (user && !user.isVerified) {
          console.log("Redirecting to verification...");
          router.replace("/auth/verification");
        } else if (user && user.isVerified) {
          console.log("Redirecting to main app...");
          router.replace("/(tabs)");
        }
      }, 100);
    }
  }, [user, isLoading]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background,
      }}
    >
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}
