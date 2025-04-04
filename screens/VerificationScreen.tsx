// screens/VerificationScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';

import { OTPInput } from '@/components/ui/OTPInput';
import { Button } from '@/components/ui/Button';

export const VerificationScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(59);
  const [isResendActive, setIsResendActive] = useState(false);

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

  const handleVerification = (code: string) => {
    setLoading(true);
    // Simulate API call for verification
    setTimeout(() => {
      setLoading(false);
      // Navigate to home on successful verification
      router.replace('/(tabs)');
    }, 1500);
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
    return `${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
        <Text style={[styles.phoneNumber, { color: colors.text }]}>
          +1 6358 9248 5789
        </Text>

        {/* OTP Input */}
        <OTPInput
          codeLength={4}
          onCodeFilled={handleVerification}
          style={styles.otpContainer}
        />

        {/* Resend code timer */}
        <View style={styles.resendContainer}>
          <Text style={[styles.resendText, { color: colors.textSecondary }]}>
            Re-send code in{' '}
          </Text>
          <Text 
            style={[
              styles.timerText, 
              { color: isResendActive ? colors.primary : colors.error }
            ]}
          >
            {isResendActive ? 'now' : formatTime(timer)}
          </Text>
        </View>

        {/* Continue button */}
        <Button
          title="CONTINUE"
          onPress={() => {}}
          loading={loading}
          style={styles.continueButton}
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
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  phoneNumber: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 32,
  },
  otpContainer: {
    marginTop: 16,
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 40,
  },
  resendText: {
    fontSize: 14,
  },
  timerText: {
    fontSize: 14,
    fontWeight: '600',
  },
  continueButton: {
    marginTop: 16,
  },
});