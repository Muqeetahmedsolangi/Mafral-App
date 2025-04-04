// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider, useTheme } from '@/context/ThemeContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Container component that uses the theme
function AppContainer({ children }: { children: ReactNode }) {
  const { isDarkMode, colors } = useTheme();
  
  return (
    <NavigationThemeProvider value={isDarkMode ? DarkTheme : DefaultTheme}>
      <View style={[
        styles.container, 
        { backgroundColor: colors.background }
      ]}>
        {children}
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      </View>
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  // Immediately hide splash screen since we're not loading fonts
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <AppContainer>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen 
              name="+not-found" 
              options={{ 
                title: 'Oops!',
              }} 
            />
          </Stack>
        </AppContainer>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});