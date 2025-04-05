// components/ui/SocialButton.tsx
import React from "react";
import { TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";

interface SocialButtonProps {
  type: "facebook" | "google" | "apple" | "twitter";
  onPress: () => void;
  style?: ViewStyle;
  size?: number;
}

export const SocialButton: React.FC<SocialButtonProps> = ({
  type,
  onPress,
  style,
  size = 24,
}) => {
  const { colors, isDarkMode } = useTheme();

  const getIcon = () => {
    switch (type) {
      case "facebook":
        return <FontAwesome name="facebook" size={size} color="#1877F2" />;
      case "google":
        return <FontAwesome name="google" size={size} color="#DB4437" />;
      case "apple":
        return (
          <FontAwesome
            name="apple"
            size={size}
            color={isDarkMode ? "#FFFFFF" : "#000000"}
          />
        );
      case "twitter":
        return <FontAwesome name="twitter" size={size} color="#1DA1F2" />;
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: colors.surfaceVariant,
          borderColor: colors.border,
        },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {getIcon()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
});
