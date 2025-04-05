import React from "react";
import { View, ActivityIndicator } from "react-native";
import { useTheme } from "@/context/ThemeContext";

export default function Index() {
  const { colors } = useTheme();

  // This is just a loading screen while auth state is being determined
  // Navigation will be handled by AuthContext
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
