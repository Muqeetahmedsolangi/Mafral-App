// components/ui/Card.tsx
import React from "react";
import { View, StyleSheet, ViewStyle, ViewProps } from "react-native";
import { useTheme } from "@/context/ThemeContext";

interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: "default" | "outlined" | "filled" | "elevated";
  style?: ViewStyle;
}

export function Card({
  children,
  variant = "default",
  style,
  ...rest
}: CardProps) {
  const { colors } = useTheme();

  // Card styles based on variant
  const getCardStyle = () => {
    switch (variant) {
      case "default":
        return {
          backgroundColor: colors.card,
          borderWidth: 0,
          shadowOpacity: 0,
        };
      case "outlined":
        return {
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          shadowOpacity: 0,
        };
      case "filled":
        return {
          backgroundColor: colors.surfaceVariant,
          borderWidth: 0,
          shadowOpacity: 0,
        };
      case "elevated":
        return {
          backgroundColor: colors.card,
          borderWidth: 0,
          shadowColor: colors.text,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        };
      default:
        return {
          backgroundColor: colors.card,
          borderWidth: 0,
        };
    }
  };

  const cardStyles = [styles.card, getCardStyle(), style];

  return (
    <View style={cardStyles} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    overflow: "hidden",
  },
});
