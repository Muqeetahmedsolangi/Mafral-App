// components/ui/Card.tsx
import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface CardProps {
  children: ReactNode;
  variant?: 'elevated' | 'outlined' | 'filled';
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  testID?: string;
}

export const Card = ({
  children,
  variant = 'elevated',
  style,
  contentStyle,
  testID,
}: CardProps) => {
  const { colors, borderRadius, shadows } = useTheme();

  // Determine card styles based on variant
  const getCardStyles = () => {
    switch (variant) {
      case 'elevated':
        return {
          ...shadows.md,
          backgroundColor: colors.card,
        };
      case 'outlined':
        return {
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
        };
      case 'filled':
        return {
          backgroundColor: colors.surfaceVariant,
        };
      default:
        return {
          ...shadows.md,
          backgroundColor: colors.card,
        };
    }
  };

  return (
    <View
      testID={testID}
      style={[
        styles.card,
        {
          borderRadius: borderRadius.md,
          ...getCardStyles(),
        },
        style,
      ]}
    >
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  },
});

// Card subcomponents for more structured usage
interface CardSubComponentProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

// Define the subComponent styles here
const subComponentStyles = StyleSheet.create({
  header: {
    paddingBottom: 8,
  },
  cardContent: {
    paddingVertical: 8,
  },
  footer: {
    paddingTop: 8,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
    marginVertical: 8,
  },
});

export const CardHeader = ({ children, style }: CardSubComponentProps) => (
  <View style={[subComponentStyles.header, style]}>{children}</View>
);

export const CardContent = ({ children, style }: CardSubComponentProps) => (
  <View style={[subComponentStyles.cardContent, style]}>{children}</View>
);

export const CardFooter = ({ children, style }: CardSubComponentProps) => (
  <View style={[subComponentStyles.footer, style]}>{children}</View>
);

export const CardDivider = () => {
  const { colors } = useTheme();
  return <View style={[subComponentStyles.divider, { backgroundColor: colors.border }]} />;
};