// components/ui/Typography.tsx
import React from "react";
import { Text, TextProps, StyleSheet } from "react-native";
import { useTheme } from "@/context/ThemeContext";

interface TypographyProps extends TextProps {
  variant?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "body1"
    | "body2"
    | "caption"
    | "button"
    | "overline";
  color?: string;
  align?: "auto" | "left" | "right" | "center" | "justify";
  weight?:
    | "normal"
    | "bold"
    | "100"
    | "200"
    | "300"
    | "400"
    | "500"
    | "600"
    | "700"
    | "800"
    | "900";
}

const Typography: React.FC<TypographyProps> = ({
  variant = "body1",
  color,
  align = "left",
  weight,
  style,
  children,
  ...restProps
}) => {
  const { colors } = useTheme();

  const textColor = color || colors.text;

  return (
    <Text
      style={[
        styles[variant],
        { color: textColor, textAlign: align },
        weight && { fontWeight: weight },
        style,
      ]}
      {...restProps}
    >
      {children}
    </Text>
  );
};

// Variant components
export const H1: React.FC<TypographyProps> = (props) => (
  <Typography variant="h1" {...props} />
);
export const H2: React.FC<TypographyProps> = (props) => (
  <Typography variant="h2" {...props} />
);
export const H3: React.FC<TypographyProps> = (props) => (
  <Typography variant="h3" {...props} />
);
export const H4: React.FC<TypographyProps> = (props) => (
  <Typography variant="h4" {...props} />
);
export const H5: React.FC<TypographyProps> = (props) => (
  <Typography variant="h5" {...props} />
);
export const H6: React.FC<TypographyProps> = (props) => (
  <Typography variant="h6" {...props} />
);
export const Body1: React.FC<TypographyProps> = (props) => (
  <Typography variant="body1" {...props} />
);
export const Body2: React.FC<TypographyProps> = (props) => (
  <Typography variant="body2" {...props} />
);
export const Caption: React.FC<TypographyProps> = (props) => (
  <Typography variant="caption" {...props} />
);
export const ButtonText: React.FC<TypographyProps> = (props) => (
  <Typography variant="button" {...props} />
);
export const Overline: React.FC<TypographyProps> = (props) => (
  <Typography variant="overline" {...props} />
);

const styles = StyleSheet.create({
  h1: {
    fontSize: 32,
    fontWeight: "bold",
    letterSpacing: 0.25,
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: 0,
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: "600",
    letterSpacing: 0.15,
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 0.15,
    lineHeight: 28,
  },
  h5: {
    fontSize: 18,
    fontWeight: "500",
    letterSpacing: 0.15,
    lineHeight: 24,
  },
  h6: {
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 0.15,
    lineHeight: 22,
  },
  body1: {
    fontSize: 16,
    fontWeight: "normal",
    letterSpacing: 0.5,
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    fontWeight: "normal",
    letterSpacing: 0.25,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: "normal",
    letterSpacing: 0.4,
    lineHeight: 16,
  },
  button: {
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 1.25,
    lineHeight: 20,
    textTransform: "uppercase",
  },
  overline: {
    fontSize: 10,
    fontWeight: "normal",
    letterSpacing: 1.5,
    lineHeight: 14,
    textTransform: "uppercase",
  },
});

export default Typography;
