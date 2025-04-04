import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  TextInputProps, 
  TouchableOpacity,
  ViewStyle,
  TextStyle
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';

// Type for Feather icon names to ensure type safety
type FeatherIconName = React.ComponentProps<typeof Feather>['name'];

interface InputProps extends TextInputProps {
  // Constrain icon to only valid Feather icon names
  icon?: FeatherIconName;
  secureTextEntry?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  iconColor?: string;
}

export const Input = ({ 
  icon, 
  secureTextEntry = false, 
  containerStyle, 
  inputStyle,
  iconColor,
  ...props 
}: InputProps) => {
  const { colors } = useTheme();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor: colors.surfaceVariant,
          borderColor: colors.border,
        },
        containerStyle
      ]}
    >
      {icon && (
        <Feather 
          name={icon} 
          size={20} 
          color={iconColor || colors.textSecondary} 
          style={styles.icon} 
        />
      )}
      
      <TextInput
        secureTextEntry={secureTextEntry && !isPasswordVisible}
        style={[
          styles.input, 
          { 
            color: colors.text,
            flex: 1,
          },
          inputStyle
        ]}
        placeholderTextColor={colors.textMuted}
        {...props}
      />
      
      {secureTextEntry && (
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.visibilityToggle}>
          <Feather
            name={isPasswordVisible ? 'eye-off' : 'eye'}
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    fontSize: 16,
    padding: 0, // Remove default padding on Android
  },
  visibilityToggle: {
    padding: 4,
  },
});

export default Input;