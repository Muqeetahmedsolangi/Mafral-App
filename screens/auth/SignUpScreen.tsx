// screens/SignUpScreen.tsx
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

export const SignUpScreen = () => {
  const { colors } = useTheme();
  const { signUp, user, isLoading, error } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

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

  const handleSignUp = async () => {
    // Reset error
    setLocalError(null);

    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      setLocalError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    await signUp(email, password, name);
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
        {/* Back button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Feather name="chevron-left" size={24} color={colors.text} />
        </TouchableOpacity>

        {/* Header */}
        <Text style={[styles.title, { color: colors.text }]}>
          Create Account
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Please fill in the form to continue
        </Text>

        {/* Error message */}
        {(error || localError) && (
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error || localError}
          </Text>
        )}

        {/* Name input */}
        <Input
          label="Full Name"
          placeholder="Enter your full name"
          value={name}
          onChangeText={setName}
          leftIcon="user"
          style={styles.input}
        />

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

        {/* Confirm password */}
        <Input
          label="Confirm Password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
          leftIcon="lock"
          rightIcon={showConfirmPassword ? "eye-off" : "eye"}
          onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
          style={styles.input}
        />

        {/* Sign up button */}
        <Button
          title="SIGN UP"
          onPress={handleSignUp}
          loading={isLoading}
          disabled={isLoading}
          style={styles.signUpButton}
        />

        {/* Sign in link */}
        <View style={styles.signInContainer}>
          <Text style={[styles.signInText, { color: colors.textSecondary }]}>
            Already have an account?
          </Text>
          <TouchableOpacity onPress={() => router.push("/auth/signin")}>
            <Text style={[styles.signInLinkText, { color: colors.primary }]}>
              Sign in
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
    paddingTop: 50,
    paddingBottom: 40,
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  signUpButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  signInText: {
    fontSize: 14,
    marginRight: 4,
  },
  signInLinkText: {
    fontSize: 14,
    fontWeight: "600",
  },
  errorText: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
  },
});
