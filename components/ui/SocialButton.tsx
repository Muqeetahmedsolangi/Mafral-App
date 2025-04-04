// components/ui/SocialButton.tsx
import React from 'react';
import { 
  TouchableOpacity, 
  StyleSheet, 
  ViewStyle 
} from 'react-native';
// Import from @expo/vector-icons
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';

type SocialType = 'facebook' | 'google' | 'apple';

interface SocialButtonProps {
  type: SocialType;
  onPress: () => void;
  style?: ViewStyle;
}

export const SocialButton = ({ 
  type, 
  onPress, 
  style 
}: SocialButtonProps) => {
  const { colors, isDarkMode } = useTheme();

  // Function to get icon name based on social type
  const getIconName = () => {
    // Return the exact strings that FontAwesome supports
    switch (type) {
      case 'facebook':
        return 'facebook' as const;
      case 'google':
        return 'google' as const;
      case 'apple':
        return 'apple' as const;
      default:
        return 'question-circle' as const;
    }
  };

  // Function to get icon color based on social type
  const getIconColor = (): string => {
    switch (type) {
      case 'facebook':
        return '#1877F2';
      case 'google':
        return '#DB4437';
      case 'apple':
        return isDarkMode ? '#FFFFFF' : '#000000';
      default:
        return colors.text;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: colors.surfaceVariant,
          borderColor: colors.border,
        },
        style
      ]}
      activeOpacity={0.7}
    >
      <FontAwesome
        name={getIconName()}
        size={24}
        color={getIconColor()}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
});