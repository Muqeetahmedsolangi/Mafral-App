import React from 'react';
import { Platform, View, Text } from 'react-native';

interface MapComponentProps {
  style?: object;
  initialRegion?: object;
  children?: React.ReactNode;
}

export const MapComponent = ({ style, initialRegion, children }: MapComponentProps) => {
  if (Platform.OS === 'web') {
    return (
      <View style={[style, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' }]}>
        <Text>Map view is not available on web</Text>
      </View>
    );
  }
  
  // Import react-native-maps only on native platforms
  const MapView = require('react-native-maps').default;
  return (
    <MapView
      style={style}
      initialRegion={initialRegion}
      scrollEnabled={false}
      zoomEnabled={false}
    >
      {children}
    </MapView>
  );
};

interface MarkerComponentProps {
  coordinate: { latitude: number; longitude: number };
  title: string;
}

export const MarkerComponent = ({ coordinate, title }: MarkerComponentProps) => {
  if (Platform.OS === 'web') return null;
  
  // Import Marker only on native platforms
  const { Marker } = require('react-native-maps');
  return (
    <Marker
      coordinate={coordinate}
      title={title}
    />
  );
};