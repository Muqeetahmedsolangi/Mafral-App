import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, Switch, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

type Props = {
  label: string;
  value: boolean;
  onValueChange: () => void;
  icon?: ReactNode;
  disabled?: boolean;
};

export function SwitchItem({ label, value, onValueChange, icon, disabled }: Props) {
  const { colors } = useTheme();
  
  return (
    <TouchableWithoutFeedback onPress={disabled ? undefined : onValueChange}>
      <View style={[styles.container, disabled && { opacity: 0.5 }]}>
        <View style={styles.leftContent}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
        </View>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: colors.switchTrackOff, true: colors.primary }}
          thumbColor={colors.switchThumb}
          ios_backgroundColor={colors.switchTrackOff}
          disabled={disabled}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 12,
  },
  label: {
    fontSize: 16,
  },
});