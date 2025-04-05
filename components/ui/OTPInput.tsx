// components/ui/OTPInput.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Keyboard,
  ViewStyle,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";

interface OTPInputProps {
  codeLength?: number;
  onCodeFilled?: (code: string) => void;
  style?: ViewStyle;
  secureTextEntry?: boolean;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  codeLength = 4,
  onCodeFilled,
  style,
  secureTextEntry = false,
}) => {
  const { colors } = useTheme();
  const [code, setCode] = useState<string[]>(Array(codeLength).fill(""));
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    // Pre-create refs array
    inputRefs.current = Array(codeLength).fill(null);
  }, [codeLength]);

  const handleChange = (text: string, index: number) => {
    const newCode = [...code];

    // Only accept single digits
    newCode[index] = text.slice(-1);
    setCode(newCode);

    // If input is filled, move to next
    if (text && index < codeLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if the entire code is filled
    const filledCode = newCode.join("");
    if (filledCode.length === codeLength && onCodeFilled) {
      onCodeFilled(filledCode);
      Keyboard.dismiss();
    }
  };

  const handleKeyPress = (
    event: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    const key = event.nativeEvent.key;

    // Handle backspace
    if (key === "Backspace" && !code[index] && index > 0) {
      // Move focus to previous input and clear it
      const newCode = [...code];
      newCode[index - 1] = "";
      setCode(newCode);
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={[styles.container, style]}>
      {Array(codeLength)
        .fill(0)
        .map((_, index) => (
          <TextInput
            key={index}
            style={[
              styles.input,
              {
                borderColor: code[index] ? colors.primary : colors.border,
                color: colors.text,
              },
            ]}
            ref={(ref) => (inputRefs.current[index] = ref)}
            value={code[index]}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(event) => handleKeyPress(event, index)}
            keyboardType="number-pad"
            maxLength={1}
            secureTextEntry={secureTextEntry}
            selectTextOnFocus
            accessibilityLabel={`OTP digit ${index + 1}`}
          />
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  input: {
    height: 60,
    width: 60,
    borderWidth: 2,
    borderRadius: 8,
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
});
