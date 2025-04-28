import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

type Props = {
  label: string;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
};

export function RadioButton({ label, selected, onSelect, disabled = false }: Props) {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onSelect}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View 
        style={[
          styles.radioOuter, 
          { 
            borderColor: selected ? colors.primary : colors.border,
            opacity: disabled ? 0.5 : 1,
          }
        ]}
      >
        {selected && (
          <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />
        )}
      </View>
      <Text style={[
        styles.label, 
        { 
          color: colors.text,
          opacity: disabled ? 0.5 : 1,
        }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  radioOuter: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
  },
  label: {
    marginLeft: 8,
    fontSize: 16,
  },
});