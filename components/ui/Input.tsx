import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
  ViewStyle,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";

// Type for Feather icon names to ensure type safety
type FeatherIconName = React.ComponentProps<typeof Feather>["name"];

interface InputProps extends TextInputProps {
  label?: string;
  leftIcon?: FeatherIconName;
  rightIcon?: FeatherIconName;
  error?: string;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  style?: ViewStyle;
}

export const Input = ({
  label,
  leftIcon,
  rightIcon,
  error,
  onRightIconPress,
  containerStyle,
  style,
  ...rest
}: InputProps) => {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const getBorderColor = () => {
    if (error) return colors.error;
    return isFocused ? colors.primary : colors.border;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            borderColor: getBorderColor(),
            backgroundColor: colors.surface,
          },
          style,
        ]}
      >
        {leftIcon && (
          <Feather
            name={leftIcon}
            size={18}
            color={isFocused ? colors.primary : colors.icon}
            style={styles.leftIcon}
          />
        )}

        <TextInput
          style={[
            styles.input,
            { color: colors.text },
            leftIcon && styles.inputWithLeftIcon,
            rightIcon && styles.inputWithRightIcon,
          ]}
          placeholderTextColor={colors.textMuted}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...rest}
        />

        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.rightIcon}
            disabled={!onRightIconPress}
          >
            <Feather name={rightIcon} size={18} color={colors.icon} />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    height: 48,
  },
  input: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 16,
    fontSize: 16,
  },
  inputWithLeftIcon: {
    paddingLeft: 8,
  },
  inputWithRightIcon: {
    paddingRight: 40,
  },
  leftIcon: {
    marginLeft: 16,
  },
  rightIcon: {
    position: "absolute",
    right: 16,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default Input;
