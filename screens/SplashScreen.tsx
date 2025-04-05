// screens/SplashScreen.tsx
import React from "react";
import { View, StyleSheet, Image, ActivityIndicator } from "react-native";
import { useTheme } from "@/context/ThemeContext";

export const SplashScreen = () => {
  const { colors } = useTheme();

  // The routing logic is now handled in AuthContext
  // This component just displays the splash screen

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.logoContainer}>
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <ActivityIndicator
        color={colors.primary}
        size="small"
        style={styles.loader}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 120,
    height: 120,
  },
  loader: {
    marginTop: 40,
  },
});
