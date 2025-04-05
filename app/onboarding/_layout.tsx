// app/onboarding/_layout.tsx
import React from "react";
import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "white" },
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="country-select" />
      <Stack.Screen name="interests" />
      <Stack.Screen name="location-permission" />
    </Stack>
  );
}
