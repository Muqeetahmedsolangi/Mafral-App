// Mock implementation of react-native-maps for web
import React from "react";
import { View, Text } from "react-native";

// Mock components
const MockMapView = (props) => {
  return (
    <View {...props}>
      <Text>Map View (Web Mock)</Text>
      {props.children}
    </View>
  );
};

const MockMarker = (props) => {
  return null; // No rendering on web
};

// Export mock components that match the API of react-native-maps
export default MockMapView;
export const Marker = MockMarker;
export const PROVIDER_GOOGLE = "google";
export const PROVIDER_DEFAULT = "default";

// Add any other exports that might be used in your code
export const Callout = () => null;
export const Circle = () => null;
export const Polygon = () => null;
export const Polyline = () => null;
