// screens/SignInScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";

import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export const SignInScreen = () => {
  const { colors } = useTheme();
  const { signIn, user, isLoading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Watch for authentication state changes
  useEffect(() => {
    if (user) {
      if (!user.isVerified) {
        console.log("User needs verification, redirecting...");
        router.replace("/auth/verification");
      } else {
        console.log("User authenticated, redirecting to main app...");
        router.replace("/(tabs)");
      }
    }
  }, [user]);

  const handleSignIn = async () => {
    if (!email || !password) {
      // Simple validation
      return;
    }
    await signIn(email, password);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <Text style={[styles.title, { color: colors.text }]}>Sign In</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Welcome back! Please enter your details.
        </Text>

        {/* Error message if any */}
        {error && (
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error}
          </Text>
        )}

        {/* Email input */}
        <Input
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          leftIcon="mail"
          style={styles.input}
        />

        {/* Password input */}
        <Input
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          leftIcon="lock"
          rightIcon={showPassword ? "eye-off" : "eye"}
          onRightIconPress={() => setShowPassword(!showPassword)}
          style={styles.input}
        />

        {/* Forgot password */}
        <TouchableOpacity
          style={styles.forgotPasswordContainer}
          onPress={() => router.push("/auth/forgot-password")}
        >
          <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
            Forgot password?
          </Text>
        </TouchableOpacity>

        {/* Sign in button */}
        <Button
          title="SIGN IN"
          onPress={handleSignIn}
          loading={isLoading}
          disabled={isLoading || !email || !password}
          style={styles.signInButton}
        />

        {/* Sign up link */}
        <View style={styles.signUpContainer}>
          <Text style={[styles.signUpText, { color: colors.textSecondary }]}>
            Don't have an account?
          </Text>
          <TouchableOpacity onPress={() => router.push("/auth/signup")}>
            <Text style={[styles.signUpLinkText, { color: colors.primary }]}>
              Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
  },
  input: {
    marginBottom: 16,
  },
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: "500",
  },
  signInButton: {
    marginVertical: 16,
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  signUpText: {
    fontSize: 14,
    marginRight: 4,
  },
  signUpLinkText: {
    fontSize: 14,
    fontWeight: "600",
  },
  errorText: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
  },
});
