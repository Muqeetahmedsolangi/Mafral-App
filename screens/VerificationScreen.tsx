// screens/VerificationScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";

import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { OTPInput } from "@/components/ui/OTPInput";
import { Button } from "@/components/ui/Button";

export const VerificationScreen = () => {
  const { colors } = useTheme();
  const { verifyOTP, user, isLoading, error } = useAuth();
  const [timer, setTimer] = useState(59);
  const [isResendActive, setIsResendActive] = useState(false);
  const [code, setCode] = useState("");

  // Watch for authentication state changes
  useEffect(() => {
    if (user && user.isVerified) {
      console.log("User verified, redirecting to main app...");
      router.replace("/(tabs)");
    }
  }, [user]);

  // Start the countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setIsResendActive(true);
    }

    return () => clearInterval(interval);
  }, [timer]);

  const handleVerification = async (code: string) => {
    setCode(code);
    await verifyOTP(code);
  };

  const handleResendCode = () => {
    if (isResendActive) {
      // Reset timer and resend code
      setTimer(59);
      setIsResendActive(false);
      // Add your code resend logic here
    }
  };

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    return `${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Back button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Feather name="chevron-left" size={24} color={colors.text} />
        </TouchableOpacity>

        {/* Header */}
        <Text style={[styles.title, { color: colors.text }]}>Verification</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          We've sent you the verification code on
        </Text>
        <Text style={[styles.email, { color: colors.text }]}>
          {user?.email || "your email"}
        </Text>

        {/* Error message if any */}
        {error && (
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error}
          </Text>
        )}

        {/* OTP Input */}
        <OTPInput
          codeLength={4}
          onCodeFilled={handleVerification}
          style={styles.otpContainer}
        />

        {/* Resend code timer */}
        <View style={styles.resendContainer}>
          <Text style={[styles.resendText, { color: colors.textSecondary }]}>
            Re-send code in{" "}
          </Text>
          {isResendActive ? (
            <TouchableOpacity onPress={handleResendCode}>
              <Text style={[styles.timerText, { color: colors.primary }]}>
                Resend
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={[styles.timerText, { color: colors.text }]}>
              00:{formatTime(timer)}
            </Text>
          )}
        </View>

        <Button
          title="VERIFY"
          onPress={() => {
            if (code.length === 4) {
              verifyOTP(code);
            }
          }}
          loading={isLoading}
          style={styles.verifyButton}
          disabled={isLoading}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
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
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 32,
  },
  otpContainer: {
    marginVertical: 24,
  },
  resendContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    marginBottom: 32,
  },
  resendText: {
    fontSize: 14,
  },
  timerText: {
    fontSize: 14,
    fontWeight: "600",
  },
  verifyButton: {
    marginTop: 8,
  },
  errorText: {
    fontSize: 14,
    marginVertical: 16,
    textAlign: "center",
  },
});
