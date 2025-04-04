// components/ui/Typography.tsx
import React, { ReactNode } from 'react';
import { Text, TextStyle, StyleProp, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface TypographyProps {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
  onPress?: () => void;
}

// Type-safe function to extract typography styles
const extractTypographyStyle = (typographyObj: any): TextStyle => {
  return {
    fontSize: typographyObj.fontSize,
    lineHeight: typographyObj.lineHeight,
    letterSpacing: typographyObj.letterSpacing,
    fontWeight: typographyObj.fontWeight as TextStyle['fontWeight'],
  };
};

// Heading Components
export const H1 = ({ children, style, ...props }: TypographyProps) => {
  const { typography, colors } = useTheme();
  
  return (
    <Text 
      style={[
        // Remove font family dependency
        extractTypographyStyle(typography.heading.h1),
        { color: colors.text },
        style
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

export const H2 = ({ children, style, ...props }: TypographyProps) => {
  const { typography, colors } = useTheme();
  
  return (
    <Text 
      style={[
        extractTypographyStyle(typography.heading.h2),
        { color: colors.text },
        style
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

export const H3 = ({ children, style, ...props }: TypographyProps) => {
  const { typography, colors } = useTheme();
  
  return (
    <Text 
      style={[
        extractTypographyStyle(typography.heading.h3),
        { color: colors.text },
        style
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

export const H4 = ({ children, style, ...props }: TypographyProps) => {
  const { typography, colors } = useTheme();
  
  return (
    <Text 
      style={[
        extractTypographyStyle(typography.heading.h4),
        { color: colors.text },
        style
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

export const H5 = ({ children, style, ...props }: TypographyProps) => {
  const { typography, colors } = useTheme();
  
  return (
    <Text 
      style={[
        extractTypographyStyle(typography.heading.h5),
        { color: colors.text },
        style
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

export const H6 = ({ children, style, ...props }: TypographyProps) => {
  const { typography, colors } = useTheme();
  
  return (
    <Text 
      style={[
        extractTypographyStyle(typography.heading.h6),
        { color: colors.text },
        style
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

// Body text components
export const Body1 = ({ children, style, ...props }: TypographyProps) => {
  const { typography, colors } = useTheme();
  
  return (
    <Text 
      style={[
        extractTypographyStyle(typography.body.body1),
        { color: colors.text },
        style
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

export const Body2 = ({ children, style, ...props }: TypographyProps) => {
  const { typography, colors } = useTheme();
  
  return (
    <Text 
      style={[
        extractTypographyStyle(typography.body.body2),
        { color: colors.text },
        style
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

export const Body3 = ({ children, style, ...props }: TypographyProps) => {
  const { typography, colors } = useTheme();
  
  return (
    <Text 
      style={[
        extractTypographyStyle(typography.body.body3),
        { color: colors.text },
        style
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

export const Body4 = ({ children, style, ...props }: TypographyProps) => {
  const { typography, colors } = useTheme();
  
  return (
    <Text 
      style={[
        extractTypographyStyle(typography.body.body4),
        { color: colors.text },
        style
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

export const Body5 = ({ children, style, ...props }: TypographyProps) => {
  const { typography, colors } = useTheme();
  
  return (
    <Text 
      style={[
        extractTypographyStyle(typography.body.body5),
        { color: colors.text },
        style
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

export const Body6 = ({ children, style, ...props }: TypographyProps) => {
  const { typography, colors } = useTheme();
  
  return (
    <Text 
      style={[
        extractTypographyStyle(typography.body.body6),
        { color: colors.text },
        style
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

// Button text components
export const ButtonText1 = ({ children, style, ...props }: TypographyProps) => {
  const { typography, colors } = useTheme();
  
  return (
    <Text 
      style={[
        extractTypographyStyle(typography.button.button1),
        { color: colors.text },
        style
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

export const ButtonText2 = ({ children, style, ...props }: TypographyProps) => {
  const { typography, colors } = useTheme();
  
  return (
    <Text 
      style={[
        extractTypographyStyle(typography.button.button2),
        { color: colors.text },
        style
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

export const ButtonText3 = ({ children, style, ...props }: TypographyProps) => {
  const { typography, colors } = useTheme();
  
  return (
    <Text 
      style={[
        extractTypographyStyle(typography.button.button3),
        { color: colors.text },
        style
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

// Caption components
export const Caption1 = ({ children, style, ...props }: TypographyProps) => {
  const { typography, colors } = useTheme();
  
  return (
    <Text 
      style={[
        extractTypographyStyle(typography.caption.caption1),
        { color: colors.text },
        style
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

export const Caption2 = ({ children, style, ...props }: TypographyProps) => {
  const { typography, colors } = useTheme();
  
  return (
    <Text 
      style={[
        extractTypographyStyle(typography.caption.caption2),
        { color: colors.text },
        style
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

export const Caption3 = ({ children, style, ...props }: TypographyProps) => {
  const { typography, colors } = useTheme();
  
  return (
    <Text 
      style={[
        extractTypographyStyle(typography.caption.caption3),
        { color: colors.text },
        style
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

export const Caption4 = ({ children, style, ...props }: TypographyProps) => {
  const { typography, colors } = useTheme();
  
  return (
    <Text 
      style={[
        extractTypographyStyle(typography.caption.caption4),
        { color: colors.text },
        style
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

export const Caption5 = ({ children, style, ...props }: TypographyProps) => {
  const { typography, colors } = useTheme();
  
  return (
    <Text 
      style={[
        extractTypographyStyle(typography.caption.caption5),
        { color: colors.text },
        style
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

export const Caption6 = ({ children, style, ...props }: TypographyProps) => {
  const { typography, colors } = useTheme();
  
  return (
    <Text 
      style={[
        extractTypographyStyle(typography.caption.caption6),
        { color: colors.text },
        style
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

export const Caption7 = ({ children, style, ...props }: TypographyProps) => {
  const { typography, colors } = useTheme();
  
  return (
    <Text 
      style={[
        extractTypographyStyle(typography.caption.caption7),
        { color: colors.text },
        style
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};