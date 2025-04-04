import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';

type DividerProps = {
  style?: ViewStyle;
  color?: string;
};

export function Divider({ style, color }: DividerProps) {
  const colorScheme = useColorScheme();
  const defaultColor = colorScheme === 'dark' ? '#262626' : '#DBDBDB';
  
  return (
    <View 
      style={[
        styles.divider, 
        { backgroundColor: color || defaultColor },
        style
      ]} 
    />
  );
}

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
  },
});