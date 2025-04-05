// screens/SplashScreen.tsx
import React, { useEffect } from 'react';
import { View, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export const  SplashScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();

  useEffect(() => {
    // Simulate loading delay and navigate to auth screen
    const timer = setTimeout(() => {
      router.replace('/auth/signin');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.logoContainer}>
        {/* App Logo */}
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Loading indicator */}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
  },
  loader: {
    marginTop: 40,
  },
});