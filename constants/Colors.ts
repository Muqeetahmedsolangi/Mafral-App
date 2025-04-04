// constants/Colors.js
export const Colors = {
  light: {
    text: "#000000",
    background: "#FFFFFF",
    tint: "#000000", // Instagram's primary color is black in light mode
    tabIconDefault: "#8E8E8E", // Instagram's inactive icon color
    tabIconSelected: "#000000",
    border: "#DBDBDB", // Instagram's border color
    secondary: "#FAFAFA", // Instagram's secondary background color
    placeholder: "#A9A9A9",
    link: "#0095F6", // Instagram's blue
    notification: "#FE0000", // Instagram's red notification
    success: "#58C322", // Green for success states
  },
  dark: {
    text: "#FFFFFF",
    background: "#000000",
    tint: "#FFFFFF", // Instagram's primary color is white in dark mode
    tabIconDefault: "#8E8E8E", // Instagram's inactive icon color in dark mode
    tabIconSelected: "#FFFFFF",
    border: "#262626", // Instagram's border color in dark mode
    secondary: "#121212", // Instagram's secondary background in dark mode
    placeholder: "#8E8E8E",
    link: "#0095F6", // Instagram's blue stays the same
    notification: "#FE0000", // Instagram's red notification stays the same
    success: "#58C322", // Green for success states stays the same
  },
  // Colors that are not theme dependent
  inactive: "#8E8E8E",
};

// Instagram gradient for stories and branding
export const InstagramGradient = ["#FCAF45", "#E1306C", "#C13584", "#5851DB"];
