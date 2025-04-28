import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';

interface LocationPickerProps {
  location: {
    latitude: number;
    longitude: number;
  } | null;
  address: string;
  onLocationChange: (location: { latitude: number; longitude: number }, address: string) => void;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  location,
  address,
  onLocationChange,
}) => {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [draggedLocation, setDraggedLocation] = useState(location);
  const [currentRegion, setCurrentRegion] = useState<Region>({
    latitude: location?.latitude || 23.7783,
    longitude: location?.longitude || 90.3756,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  
  const mapRef = useRef<MapView>(null);
  
  // Get user's current location on initial load
  useEffect(() => {
    if (!location) {
      getCurrentLocation();
    }
  }, []);

  const getCurrentLocation = async () => {
    setIsLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }
      
      const currentPosition = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const { latitude, longitude } = currentPosition.coords;
      
      setDraggedLocation({
        latitude,
        longitude,
      });
      
      setCurrentRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      
      // Reverse geocode to get address
      const addressResponse = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      
      if (addressResponse && addressResponse.length > 0) {
        const location = addressResponse[0];
        const formattedAddress = formatAddress(location);
        setSearchText(formattedAddress);
      }
    } catch (error) {
      console.error('Error getting location:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatAddress = (location: Location.LocationGeocodedAddress): string => {
    const addressParts = [];
    
    if (location.name) addressParts.push(location.name);
    if (location.street) addressParts.push(location.street);
    if (location.city) addressParts.push(location.city);
    if (location.region) addressParts.push(location.region);
    if (location.postalCode) addressParts.push(location.postalCode);
    if (location.country) addressParts.push(location.country);
    
    return addressParts.join(', ');
  };

  const handleSearch = async () => {
    if (!searchText.trim()) return;
    
    setIsLoading(true);
    try {
      const results = await Location.geocodeAsync(searchText);
      
      if (results && results.length > 0) {
        const { latitude, longitude } = results[0];
        
        setDraggedLocation({
          latitude,
          longitude,
        });
        
        setCurrentRegion({
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        
        mapRef.current?.animateToRegion({
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    } catch (error) {
      console.error('Error searching location:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegionChangeComplete = async (region: Region) => {
    // Wait for drag to complete before updating
    setCurrentRegion(region);
  };

  const handleMarkerDragEnd = async (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    
    setDraggedLocation({
      latitude,
      longitude,
    });
    
    // Reverse geocode to get address
    try {
      const addressResponse = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      
      if (addressResponse && addressResponse.length > 0) {
        const location = addressResponse[0];
        const formattedAddress = formatAddress(location);
        setSearchText(formattedAddress);
      }
    } catch (error) {
      console.error('Error getting address:', error);
    }
  };

  const handleSelectLocation = () => {
    if (draggedLocation) {
      onLocationChange(draggedLocation, searchText);
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.locationButton, { backgroundColor: colors.surfaceVariant }]}
        onPress={() => setModalVisible(true)}
      >
        <Feather name="map-pin" size={20} color={colors.textSecondary} />
        
        {address ? (
          <Text 
            style={[styles.locationText, { color: colors.text }]} 
            numberOfLines={2}
          >
            {address}
          </Text>
        ) : (
          <Text style={[styles.locationPlaceholder, { color: colors.textSecondary }]}>
            Select event location
          </Text>
        )}
      </TouchableOpacity>
      
      {location && (
        <View style={styles.locationPreviewContainer}>
          <MapView
            style={styles.locationMapPreview}
            provider={PROVIDER_GOOGLE}
            region={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
          >
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              pinColor={colors.primary}
            />
          </MapView>
        </View>
      )}
      
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={false}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.backButton}
            >
              <Feather name="x" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Select Location
            </Text>
            <TouchableOpacity
              onPress={handleSelectLocation}
              style={[styles.confirmButton, { backgroundColor: colors.primary }]}
              disabled={!draggedLocation}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
          
          <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
            <View style={[styles.searchBox, { backgroundColor: colors.surfaceVariant }]}>
              <Feather name="search" size={20} color={colors.textSecondary} />
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                placeholder="Search for a location"
                placeholderTextColor={colors.textSecondary}
                value={searchText}
                onChangeText={setSearchText}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
              />
              {isLoading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : searchText ? (
                <TouchableOpacity onPress={() => setSearchText('')}>
                  <Feather name="x-circle" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              ) : null}
            </View>
            
            <TouchableOpacity
              style={[styles.currentLocationButton, { backgroundColor: colors.primary + '20' }]}
              onPress={getCurrentLocation}
            >
              <Feather name="navigation" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.mapContainer}>
            <MapView
              ref={mapRef}
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              initialRegion={currentRegion}
              onRegionChangeComplete={handleRegionChangeComplete}
            >
              {draggedLocation && (
                <Marker
                  coordinate={{
                    latitude: draggedLocation.latitude,
                    longitude: draggedLocation.longitude,
                  }}
                  draggable
                  onDragEnd={handleMarkerDragEnd}
                  pinColor={colors.primary}
                />
              )}
            </MapView>
            
            {/* Pin in center for dragging the map */}
            <View style={styles.centerMarker}>
              <Feather name="map-pin" size={36} color={colors.primary} />
              <View style={[styles.centerMarkerPin, { backgroundColor: colors.primary }]} />
            </View>
          </View>
          
          <View style={[styles.modalFooter, { backgroundColor: colors.card }]}>
            <Text style={[styles.dragText, { color: colors.textSecondary }]}>
              Drag the map to adjust the location or drag the marker
            </Text>
            <TouchableOpacity
              style={[styles.selectButton, { backgroundColor: colors.primary }]}
              onPress={handleSelectLocation}
            >
              <Text style={styles.selectButtonText}>Select This Location</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  locationText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  locationPlaceholder: {
    marginLeft: 12,
    fontSize: 16,
  },
  locationPreviewContainer: {
    marginTop: 12,
    height: 150,
    borderRadius: 12,
    overflow: 'hidden',
  },
  locationMapPreview: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  confirmButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  currentLocationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
    width: width,
    height: height * 0.6,
  },
  centerMarker: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -18,
    marginTop: -42, // Adjust based on icon height to align pin point
    alignItems: 'center',
    pointerEvents: 'none',
  },
  centerMarkerPin: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: 'absolute',
    bottom: 6,
  },
  modalFooter: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  dragText: {
    textAlign: 'center',
    marginBottom: 12,
    fontSize: 14,
  },
  selectButton: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 12,
  },
  selectButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default LocationPicker;