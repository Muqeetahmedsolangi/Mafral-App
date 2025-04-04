// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';

import { useTheme } from '@/context/ThemeContext';

export default function TabLayout() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  
  // Instagram-style shadow
  const shadowStyle = Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -3 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
    },
    android: {
      elevation: 8,
    },
  });

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
          borderTopWidth: 0.5,
          height: 50 + (insets.bottom || 0),
          paddingBottom: insets.bottom || 0,
          ...shadowStyle,
        },
        tabBarShowLabel: false, // Hide labels for Instagram-like appearance
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabIconContainer}>
              {focused && <View style={[styles.indicator, { backgroundColor: colors.tabBarActiveIndicator }]} />}
              <MaterialIcons 
                name="home" 
                size={28} 
                color={color} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabIconContainer}>
              {focused && <View style={[styles.indicator, { backgroundColor: colors.tabBarActiveIndicator }]} />}
              <Feather 
                name="search" 
                size={28} 
                color={color} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabIconContainer}>
              {focused && <View style={[styles.indicator, { backgroundColor: colors.tabBarActiveIndicator }]} />}
              <Feather 
                name="plus-square" 
                size={26} 
                color={color} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="reels"
        options={{
          title: 'Reels',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabIconContainer}>
              {focused && <View style={[styles.indicator, { backgroundColor: colors.tabBarActiveIndicator }]} />}
              <MaterialCommunityIcons 
                name="play-box-outline" 
                size={28} 
                color={color} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabIconContainer}>
              {focused && <View style={[styles.indicator, { backgroundColor: colors.tabBarActiveIndicator }]} />}
              <MaterialIcons 
                name="person" 
                size={28} 
                color={color} 
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    top: 0,
    height: 2,
    width: 20,
    borderRadius: 1,
  },
});