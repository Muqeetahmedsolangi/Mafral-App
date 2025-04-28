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
  Image,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const { width, height } = Dimensions.get('window');

export const SignUpScreen = () => {
  const { colors, isDarkMode } = useTheme();
  const { signUp, signInWithProvider, user, isLoading, error } = useAuth();
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

  const handleSocialSignUp = async (provider: string) => {
    try {
      await signInWithProvider(provider);
    } catch (error) {
      console.log(`Error signing up with ${provider}:`, error);
    }
  };

  return (
    <>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
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
          {/* Back button and Logo Row */}
          <View style={styles.topRow}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Feather name="chevron-left" size={24} color={colors.text} />
            </TouchableOpacity>
            
            <View style={styles.logoContainer}>
              <Image
                source={require('@/assets/images/logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            
            {/* Empty view for layout balance */}
            <View style={styles.backButtonPlaceholder} />
          </View>

          {/* Header */}
          <Text style={[styles.title, { color: colors.text }]}>
            Create Account
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Please fill in the form to continue
          </Text>

          {/* Error message */}
          {(error || localError) && (
            <View style={[styles.errorContainer, { backgroundColor: colors.error + '15' }]}>
              <Feather name="alert-circle" size={18} color={colors.error} />
              <Text style={[styles.errorText, { color: colors.error }]}>
                {error || localError}
              </Text>
            </View>
          )}

          {/* Social signup buttons */}
          <View style={styles.socialContainer}>
            <Text style={[styles.socialText, { color: colors.textSecondary }]}>
              Sign up with
            </Text>
            
            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity 
                style={[styles.socialButton, { backgroundColor: colors.surfaceVariant }]}
                onPress={() => handleSocialSignUp('google')}
              >
                <Image 
                  source={require('@/assets/icons/google.png')} 
                  style={styles.socialIcon} 
                  resizeMode="contain"
                />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.socialButton, { backgroundColor: colors.surfaceVariant }]}
                onPress={() => handleSocialSignUp('facebook')}
              >
                <Image 
                  source={require('@/assets/icons/facebook.png')} 
                  style={styles.socialIcon} 
                  resizeMode="contain"
                />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.socialButton, { backgroundColor: colors.surfaceVariant }]}
                onPress={() => handleSocialSignUp('github')}
              >
                <Image 
                  source={require('@/assets/icons/github.png')} 
                  style={styles.socialIcon} 
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* OR separator */}
          <View style={styles.orContainer}>
            <View style={[styles.orLine, { backgroundColor: colors.border }]} />
            <Text style={[styles.orText, { color: colors.textSecondary }]}>OR</Text>
            <View style={[styles.orLine, { backgroundColor: colors.border }]} />
          </View>

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

          {/* Terms and conditions */}
          <Text style={[styles.termsText, { color: colors.textSecondary }]}>
            By signing up, you agree to our{' '}
            <Text style={{ color: colors.primary, fontWeight: '500' }}>
              Terms of Service
            </Text>{' '}
            and{' '}
            <Text style={{ color: colors.primary, fontWeight: '500' }}>
              Privacy Policy
            </Text>
          </Text>

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
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
    minHeight: height,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  backButtonPlaceholder: {
    width: 40,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoImage: {
    width: 48,
    height: 48,
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
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    marginLeft: 8,
  },
  socialContainer: {
    marginBottom: 20,
  },
  socialText: {
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 16,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  socialIcon: {
    width: 24,
    height: 24,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  orLine: {
    flex: 1,
    height: 1,
  },
  orText: {
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    marginBottom: 16,
  },
  signUpButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  termsText: {
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 16,
    lineHeight: 18,
  },
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  signInText: {
    fontSize: 14,
    marginRight: 4,
  },
  signInLinkText: {
    fontSize: 14,
    fontWeight: "600",
  },
});