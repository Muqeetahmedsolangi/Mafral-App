// components/ui/OTPInput.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  ViewStyle
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface OTPInputProps {
  codeLength?: number;
  onCodeFilled?: (code: string) => void;
  style?: ViewStyle;
}

export const OTPInput = ({ 
  codeLength = 4, 
  onCodeFilled,
  style
}: OTPInputProps) => {
  const { colors } = useTheme();
  const [code, setCode] = useState<string[]>(Array(codeLength).fill(''));
  const inputRefs = useRef<Array<TextInput | null>>([]);

  // Initialize input refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, codeLength);
  }, [codeLength]);

  // Handle text change in each input
  const handleChangeText = (text: string, index: number) => {
    // Make sure only a single digit is entered
    if (text.length > 1) {
      text = text[text.length - 1];
    }

    // Update the code array
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // If text is entered and not the last input, focus next input
    if (text && index < codeLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // If all inputs are filled, call onCodeFilled
    if (newCode.every(digit => digit) && newCode.length === codeLength) {
      Keyboard.dismiss();
      onCodeFilled?.(newCode.join(''));
    }
  };

  // Handle backspace key press
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      // If current input is empty and backspace is pressed, focus previous input
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <TouchableWithoutFeedback>
      <View style={[styles.container, style]}>
        {Array(codeLength)
          .fill(0)
          .map((_, index) => (
            <TextInput
              key={`otp-input-${index}`}
              ref={ref => (inputRefs.current[index] = ref)}
              style={[
                styles.input,
                {
                  borderColor: code[index] ? colors.primary : colors.border,
                  backgroundColor: colors.surfaceVariant,
                  color: colors.text,
                }
              ]}
              value={code[index]}
              onChangeText={text => handleChangeText(text, index)}
              onKeyPress={e => handleKeyPress(e, index)}
              keyboardType="numeric"
              maxLength={1}
              textAlign="center"
              selectionColor={colors.primary}
              returnKeyType="next"
              selectTextOnFocus
            />
          ))}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginVertical: 20,
  },
  input: {
    width: 50,
    height: 60,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 24,
    fontWeight: 'bold',
  },
});