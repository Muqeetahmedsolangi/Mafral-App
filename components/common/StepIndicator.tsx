import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface Step {
  title: string;
  sections?: string[];
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  const { colors } = useTheme();
  
  return (
    <View style={styles.container}>
      <View style={[styles.line, { backgroundColor: colors.border }]} />
      
      {steps.map((step, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor: currentStep > index 
                ? colors.primary 
                : currentStep === index + 1 
                  ? colors.primary 
                  : colors.border,
              borderColor: currentStep === index + 1 ? colors.primary : 'transparent',
            },
          ]}
        >
          <Text 
            style={[
              styles.number,
              { 
                color: currentStep > index || currentStep === index + 1 
                  ? '#FFFFFF' 
                  : colors.textSecondary 
              }
            ]}
          >
            {index + 1}
          </Text>
        </View>
      ))}
      
      {/* Optional: Render step titles below dots */}
      {/* <View style={styles.titlesContainer}>
        {steps.map((step, index) => (
          <Text 
            key={index} 
            style={[
              styles.stepTitle, 
              { 
                color: currentStep === index + 1 ? colors.primary : colors.textSecondary,
                opacity: currentStep === index + 1 ? 1 : 0.7,
              }
            ]}
            numberOfLines={1}
          >
            {step.title}
          </Text>
        ))}
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingVertical: 16,
    position: 'relative',
  },
  line: {
    position: 'absolute',
    top: '50%',
    left: 50,
    right: 50,
    height: 2,
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    borderWidth: 3,
  },
  number: {
    fontSize: 12,
    fontWeight: '700',
  },
  titlesContainer: {
    position: 'absolute',
    bottom: -10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  stepTitle: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
    width: 60,
  },
});

export default StepIndicator;