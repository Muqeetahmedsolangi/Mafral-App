import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "small" | "medium" | "large";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  variant = "primary",
  size = "medium",
  icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  style,
  textStyle,
  onPress,
  ...rest
}: ButtonProps) {
  const { colors } = useTheme();

  // Button styles based on variant
  const getButtonStyle = () => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: disabled ? colors.textMuted : colors.primary,
          borderWidth: 0,
        };
      case "secondary":
        return {
          backgroundColor: disabled ? colors.textMuted : colors.surfaceVariant,
          borderWidth: 0,
        };
      case "outline":
        return {
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: disabled ? colors.textMuted : colors.primary,
        };
      case "ghost":
        return {
          backgroundColor: "transparent",
          borderWidth: 0,
        };
      default:
        return {
          backgroundColor: disabled ? colors.textMuted : colors.primary,
          borderWidth: 0,
        };
    }
  };

  // Text color based on variant
  const getTextColor = () => {
    switch (variant) {
      case "primary":
        return "#FFFFFF";
      case "secondary":
        return colors.text;
      case "outline":
        return disabled ? colors.textMuted : colors.primary;
      case "ghost":
        return disabled ? colors.textMuted : colors.primary;
      default:
        return "#FFFFFF";
    }
  };

  // Button height based on size
  const getButtonHeight = () => {
    switch (size) {
      case "small":
        return 36;
      case "medium":
        return 48;
      case "large":
        return 56;
      default:
        return 48;
    }
  };

  // Text size based on button size
  const getTextSize = () => {
    switch (size) {
      case "small":
        return 14;
      case "medium":
        return 16;
      case "large":
        return 18;
      default:
        return 16;
    }
  };

  const buttonStyles = [
    styles.button,
    getButtonStyle(),
    { height: getButtonHeight() },
    style,
  ];

  const textStyles = [
    styles.text,
    {
      color: getTextColor(),
      fontSize: getTextSize(),
    },
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={!disabled && !loading ? onPress : undefined}
      activeOpacity={0.7}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? "#FFFFFF" : colors.primary}
          size={size === "small" ? "small" : "small"}
        />
      ) : (
        <>
          {icon && iconPosition === "left" && icon}
          <Text style={textStyles}>{title}</Text>
          {icon && iconPosition === "right" && icon}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  text: {
    fontWeight: "600",
  },
});
