import React, { ReactNode } from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
  iconPosition = 'left',
}: ButtonProps) => {
  const { colors } = useTheme();

  // Function to get button background color based on variant and state
  const getBackgroundColor = () => {
    if (disabled) {
      return variant === 'primary' 
        ? 'rgba(255, 120, 0, 0.5)' 
        : variant === 'secondary' 
          ? colors.surfaceVariant 
          : 'transparent';
    }
    
    switch (variant) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.surfaceVariant;
      case 'outline':
        return 'transparent';
      default:
        return colors.primary;
    }
  };

  // Function to get button border color
  const getBorderColor = () => {
    return variant === 'outline' ? colors.border : 'transparent';
  };

  // Function to get text color based on variant and state
  const getTextColor = () => {
    if (disabled) {
      return variant === 'primary' ? '#FFFFFF' : colors.textSecondary;
    }
    
    switch (variant) {
      case 'primary':
        return '#FFFFFF';
      case 'secondary':
      case 'outline':
        return colors.text;
      default:
        return '#FFFFFF';
    }
  };

  // Function to get size-based styles
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 8,
          paddingHorizontal: 12,
          buttonTextStyle: { fontSize: 14 }
        };
      case 'large':
        return {
          paddingVertical: 20,
          paddingHorizontal: 32,
          buttonTextStyle: { fontSize: 18 }
        };
      case 'medium':
      default:
        return {
          paddingVertical: 16,
          paddingHorizontal: 24,
          buttonTextStyle: { fontSize: 16 }
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'outline' ? 1 : 0,
          paddingVertical: sizeStyles.paddingVertical,
          paddingHorizontal: sizeStyles.paddingHorizontal,
        },
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <View style={styles.contentContainer}>
          {icon && iconPosition === 'left' && (
            <View style={styles.iconContainer}>{icon}</View>
          )}
          <Text
            style={[
              styles.buttonText,
              {
                color: getTextColor(),
                fontSize: sizeStyles.buttonTextStyle.fontSize,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <View style={styles.iconContainer}>{icon}</View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    flexDirection: 'row',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.7,
  },
  iconContainer: {
    marginHorizontal: 8,
  },
});