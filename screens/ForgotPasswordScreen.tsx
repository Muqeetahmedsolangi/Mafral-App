// screens/ForgotPasswordScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export const ForgotPasswordScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { resetPassword, isLoading, error } = useAuth();

  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);

  const handleSendResetLink = async () => {
    if (!email) return;

    await resetPassword(email);
    setIsSent(true);
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
          Reset Password
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Please enter your email address to request a password reset
        </Text>

        {/* Error message */}
        {error ? (
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error}
          </Text>
        ) : null}

        {/* Success message */}
        {isSent && !error ? (
          <View
            style={[
              styles.successMessage,
              { backgroundColor: colors.success + "20" },
            ]}
          >
            <Feather name="check-circle" size={20} color={colors.success} />
            <Text style={[styles.successText, { color: colors.success }]}>
              Reset instructions sent to your email
            </Text>
          </View>
        ) : null}

        {/* Form */}
        <View style={styles.form}>
          <Input
            icon="mail"
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          {/* Send button */}
          <Button
            title={isSent ? "RESEND" : "SEND"}
            onPress={handleSendResetLink}
            loading={isLoading}
            disabled={!email || isLoading}
            style={styles.sendButton}
          />

          {/* Back to sign in */}
          <TouchableOpacity
            style={styles.signInLink}
            onPress={() => router.push("/auth/signin")}
          >
            <Text style={{ color: colors.primary, textAlign: "center" }}>
              Back to Sign In
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
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  errorText: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
  },
  successMessage: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  successText: {
    marginLeft: 8,
    fontSize: 14,
  },
  form: {
    width: "100%",
  },
  sendButton: {
    marginTop: 16,
  },
  signInLink: {
    marginTop: 24,
    padding: 8,
  },
});
