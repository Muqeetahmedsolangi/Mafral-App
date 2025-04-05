// app/auth/_layout.tsx
import React from "react";
import { Stack } from "expo-router";
import { useTheme } from "@/context/ThemeContext";

export default function AuthLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="signin" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="verification" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}
