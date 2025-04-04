// components/ThemeToggle.tsx
import React from 'react';
import { View, StyleSheet, Text, Switch, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  style?: object;
}

export default function ThemeToggle({ style }: ThemeToggleProps) {
  const { isDarkMode, toggleTheme, isOverridingSystem, resetToSystemTheme } = useTheme();
  
  return (
    <View style={[
      styles.container, 
      { borderBottomColor: isDarkMode ? '#262626' : '#DBDBDB' },
      style
    ]}>
      <MaterialIcons 
        name={isDarkMode ? "dark-mode" : "light-mode"} 
        size={24} 
        color={isDarkMode ? "#fff" : "#000"} 
      />
      <Text style={[styles.text, { color: isDarkMode ? "#fff" : "#000" }]}>
        {isDarkMode ? "Dark Mode" : "Light Mode"}
      </Text>
      
      <View style={styles.spacer} />
      
      <Switch
        value={isDarkMode}
        onValueChange={toggleTheme}
        thumbColor={isDarkMode ? "#fff" : "#000"}
        trackColor={{ false: "#767577", true: "#333" }}
        ios_backgroundColor="#3e3e3e"
      />
      
      {isOverridingSystem && (
        <TouchableOpacity style={styles.resetButton} onPress={resetToSystemTheme}>
          <Text style={[styles.resetText, { color: "#0095F6" }]}>
            Reset
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  text: {
    marginLeft: 12,
    fontSize: 16,
  },
  spacer: {
    flex: 1,
  },
  resetButton: {
    marginLeft: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  resetText: {
    fontSize: 12,
    fontWeight: '500',
  }
});