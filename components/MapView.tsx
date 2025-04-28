import React from 'react';
import { Platform, View, Text, StyleSheet } from 'react-native';

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface MapComponentProps {
  style?: any;
  initialRegion: Region;
  children?: React.ReactNode;
  scrollEnabled?: boolean;
  zoomEnabled?: boolean;
  pitchEnabled?: boolean;
  onPress?: (event: any) => void;
  onMarkerDragEnd?: (event: any) => void;
  showsUserLocation?: boolean;
  followsUserLocation?: boolean;
}

interface MarkerComponentProps {
  coordinate: { latitude: number; longitude: number };
  title?: string;
  description?: string;
  pinColor?: string;
  draggable?: boolean;
  onDragEnd?: (e: any) => void;
  onPress?: () => void;
}

// Only import MapView when not on web
let MapViewNative: any = null;
let MarkerNative: any = null;

if (Platform.OS !== 'web') {
  try {
    // We put this in a try-catch to handle cases where the package might not be installed
    const ReactNativeMaps = require('react-native-maps');
    MapViewNative = ReactNativeMaps.default;
    MarkerNative = ReactNativeMaps.Marker;
  } catch (error) {
    console.warn('react-native-maps could not be loaded:', error);
  }
}

// Map component that works on both web and native
export const MapComponent = ({ 
  style, 
  initialRegion, 
  children,
  scrollEnabled = false,
  zoomEnabled = false,
  pitchEnabled = false,
  onPress,
  showsUserLocation = false,
  followsUserLocation = false,
  ...rest
}: MapComponentProps) => {
  if (Platform.OS === 'web') {
    // Web implementation - static map display
    return (
      <View style={[styles.webMapContainer, style]}>
        <Text style={styles.webMapText}>Map location: {initialRegion.latitude.toFixed(4)}, {initialRegion.longitude.toFixed(4)}</Text>
        {/* Optionally display a static image map here using Google Maps Static API or similar */}
      </View>
    );
  }
  
  // Native implementation
  if (!MapViewNative) {
    return (
      <View style={[styles.errorContainer, style]}>
        <Text style={styles.errorText}>Map could not be loaded</Text>
      </View>
    );
  }
  
  return (
    <MapViewNative
      style={style}
      initialRegion={initialRegion}
      scrollEnabled={scrollEnabled}
      zoomEnabled={zoomEnabled}
      pitchEnabled={pitchEnabled}
      onPress={onPress}
      showsUserLocation={showsUserLocation}
      followsUserLocation={followsUserLocation}
      {...rest}
    >
      {children}
    </MapViewNative>
  );
};

export const MarkerComponent = ({ 
  coordinate, 
  title,
  description,
  pinColor,
  draggable,
  onDragEnd,
  onPress,
  ...rest
}: MarkerComponentProps) => {
  if (Platform.OS === 'web') {
    // No marker on web
    return null;
  }
  
  if (!MarkerNative) {
    return null;
  }
  
  return (
    <MarkerNative
      coordinate={coordinate}
      title={title}
      description={description}
      pinColor={pinColor}
      draggable={draggable}
      onDragEnd={onDragEnd}
      onPress={onPress}
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  webMapContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    padding: 16,
  },
  webMapText: {
    color: '#555',
    fontSize: 14,
    textAlign: 'center',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffdddd',
    padding: 16,
  },
  errorText: {
    color: '#ff0000',
  }
});