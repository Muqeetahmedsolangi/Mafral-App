import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { RestaurantAddress } from '@/types/restaurant';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

interface RestaurantMapSectionProps {
  address: RestaurantAddress;
  name: string;
}

const RestaurantMapSection: React.FC<RestaurantMapSectionProps> = ({ address, name }) => {
  const { colors } = useTheme();
  
  const openMaps = () => {
    const { latitude, longitude } = address;
    if (latitude && longitude) {
      const url = Platform.select({
        ios: `maps:0,0?q=${name}@${latitude},${longitude}`,
        android: `geo:0,0?q=${latitude},${longitude}(${name})`,
      });
      if (url) Linking.openURL(url);
    }
  };
  
  // If no coordinates, don't render the map
  if (!address.latitude || !address.longitude) {
    return null;
  }
  
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Location</Text>
      
      <View style={[styles.mapContainer, { borderColor: colors.border }]}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: address.latitude,
            longitude: address.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
          pitchEnabled={false}
          rotateEnabled={false}
        >
          <Marker
            coordinate={{
              latitude: address.latitude,
              longitude: address.longitude,
            }}
            title={name}
            description={`${address.street}, ${address.city}`}
          />
        </MapView>
        
        <TouchableOpacity 
          style={[styles.directionsButton, { backgroundColor: colors.primary }]}
          onPress={openMaps}
        >
          <Feather name="navigation" size={16} color="white" style={styles.directionsIcon} />
          <Text style={styles.directionsText}>Get Directions</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={[styles.address, { color: colors.textSecondary }]}>
        {address.street}, {address.city}, {address.state}, {address.postalCode}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
    borderWidth: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  directionsButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  directionsIcon: {
    marginRight: 8,
  },
  directionsText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  address: {
    fontSize: 14,
    lineHeight: 20,
  }
});

export default RestaurantMapSection;