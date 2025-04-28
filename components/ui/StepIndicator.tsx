import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

type Props = {
  steps: string[];
  currentStep: number;
  onStepPress?: (index: number) => void;
};

export function StepIndicator({ steps, currentStep, onStepPress }: Props) {
  const { colors } = useTheme();
  
  return (
    <View style={styles.container}>
      <View style={[styles.line, { backgroundColor: colors.border }]} />
      
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        const isDisabled = index > currentStep;
        
        return (
          <TouchableOpacity 
            key={index}
            style={styles.stepContainer}
            onPress={() => onStepPress?.(index)}
            disabled={!onStepPress}
          >
            <View
              style={[
                styles.dot,
                { 
                  backgroundColor: isCompleted ? colors.primary : isActive ? colors.background : colors.border,
                  borderColor: isActive || isCompleted ? colors.primary : colors.border,
                }
              ]}
            >
              <Text 
                style={[
                  styles.stepNumber,
                  { color: isActive ? colors.primary : isCompleted ? colors.background : colors.textSecondary }
                ]}
              >
                {index + 1}
              </Text>
            </View>
            {index < steps.length - 1 && (
              <Text
                style={[
                  styles.stepLabel,
                  { 
                    color: isActive ? colors.text : isCompleted ? colors.primary : colors.textSecondary,
                    opacity: isDisabled ? 0.5 : 1
                  }
                ]}
                numberOfLines={1}
              >
                {step}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    position: 'relative',
  },
  line: {
    position: 'absolute',
    top: '50%',
    left: 30,
    right: 30,
    height: 2,
    zIndex: 1,
  },
  stepContainer: {
    alignItems: 'center',
    zIndex: 2,
    flex: 1,
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: '700',
  },
  stepLabel: {
    fontSize: 10,
    textAlign: 'center',
    width: '100%',
  },
});