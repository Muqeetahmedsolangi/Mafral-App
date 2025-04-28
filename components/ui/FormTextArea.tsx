import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  minHeight?: number;
};

export function FormTextArea({
  label,
  value,
  onChangeText,
  placeholder,
  required,
  error,
  minHeight = 100
}: Props) {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: error ? colors.error : colors.textSecondary }]}>
        {label} {required && <Text style={{ color: colors.error }}>*</Text>}
      </Text>
      
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.background, // Make sure this exists in your theme
            borderColor: error ? colors.error : isFocused ? colors.primary : colors.border,
            minHeight: minHeight, // Use the prop here
          }
        ]}
      >
        <TextInput
          style={[
            styles.input,
            { color: colors.text }
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textPlaceholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          multiline
          textAlignVertical="top"
        />
      </View>
      
      {error && <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputContainer: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  }
});