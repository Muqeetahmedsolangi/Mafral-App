// screens/onboarding/WelcomeScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "@/components/ui/Button";

export const WelcomeScreen = () => {
  const { colors } = useTheme();

  const handleGetStarted = () => {
    router.push("/onboarding/country-select");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <LinearGradient
        colors={["rgba(0,0,0,0.7)", "transparent"]}
        style={styles.topGradient}
      />

      <Image
        source={require("@/assets/images/welcome-bg.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.9)"]}
        style={styles.bottomGradient}
      />

      <View style={styles.logoContainer}>
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>Mafral</Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Welcome to Mafral</Text>
        <Text style={styles.subtitle}>
          Connect with friends, share moments, and discover content that matters
          to you
        </Text>

        <Button
          title="Get Started"
          variant="primary"
          size="large"
          onPress={handleGetStarted}
          style={styles.button}
        />

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => router.push("/auth/signin")}
        >
          <Text style={[styles.loginLinkText, { color: colors.primary }]}>
            Already have an account? Log in
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  topGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 150,
    zIndex: 1,
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 400,
    zIndex: 1,
  },
  logoContainer: {
    position: "absolute",
    top: "10%",
    left: 0,
    right: 0,
    zIndex: 2,
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
  },
  appName: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 10,
  },
  contentContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 30,
    paddingBottom: 50,
    zIndex: 2,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 16,
  },
  subtitle: {
    color: "#FFFFFF",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 40,
    opacity: 0.8,
  },
  button: {
    width: "100%",
    marginBottom: 20,
  },
  loginLink: {
    alignSelf: "center",
    marginTop: 16,
  },
  loginLinkText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
  },
});
