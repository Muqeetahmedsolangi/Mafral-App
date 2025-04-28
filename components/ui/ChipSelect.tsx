import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Feather } from '@expo/vector-icons';

type Option = {
  id: string;
  name: string;
};

type Props = {
  options: Option[];
  selectedValues: string[];
  onSelectionChange: (selectedValues: string[]) => void;
  multiple?: boolean;
};

export function ChipSelect({ options, selectedValues, onSelectionChange, multiple = false }: Props) {
  const { colors } = useTheme();
  
  const handleToggle = (id: string) => {
    if (multiple) {
      if (selectedValues.includes(id)) {
        onSelectionChange(selectedValues.filter(val => val !== id));
      } else {
        onSelectionChange([...selectedValues, id]);
      }
    } else {
      onSelectionChange([id]);
    }
  };
  
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {options.map(option => {
        const isSelected = selectedValues.includes(option.id);
        
        return (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.chip,
              {
                backgroundColor: isSelected ? colors.primary : colors.card,
                borderColor: isSelected ? colors.primary : colors.border,
              }
            ]}
            onPress={() => handleToggle(option.id)}
          >
            <Text style={[styles.chipText, { color: isSelected ? colors.background : colors.text }]}>
              {option.name}
            </Text>
            {isSelected && (
              <Feather name="check" size={14} color={colors.background} style={styles.checkIcon} />
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  checkIcon: {
    marginLeft: 4,
  }
});