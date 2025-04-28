import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator, 
  TextInput,
  Modal,
  Dimensions,
  Platform,
  Alert
} from 'react-native';
import { FormSection } from '@/components/ui/FormSection';
import { FormInput } from '@/components/ui/FormInput';
import { RestaurantAddress, ContactInfo } from '@/types/restaurant';
import { useTheme } from '@/context/ThemeContext';
import * as Location from 'expo-location';
import { Feather } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

type Props = {
  address: RestaurantAddress;
  contactInfo: ContactInfo;
  onAddressChange: (address: RestaurantAddress) => void;
  onContactInfoChange: (contactInfo: ContactInfo) => void;
};

export default function RestaurantLocationSection({ 
  address, 
  contactInfo, 
  onAddressChange, 
  onContactInfoChange 
}: Props) {
  const { colors } = useTheme();
  const [mapLoading, setMapLoading] = useState(false);
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mapModalVisible, setMapModalVisible] = useState(false);
  
  const [tempLocation, setTempLocation] = useState({
    latitude: address.latitude || 37.78825,
    longitude: address.longitude || -122.4324,
  });

  const mapViewRef = useRef<MapView>(null);
  
  // Request location permissions on component mount
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');
    })();
  }, []);
  
  // Update function that ensures latitude and longitude are saved as numbers
  const updateAddress = (field: keyof RestaurantAddress, value: any) => {
    // Create a copy to modify
    const updatedAddress = { ...address };
    
    // Special handling for latitude and longitude - ensure they are numbers
    if (field === 'latitude' || field === 'longitude') {
      if (value === null || value === undefined || value === '') {
        updatedAddress[field] = null;
      } else {
        // Force conversion to Number
        const numValue = Number(value);
        if (!isNaN(numValue)) {
          updatedAddress[field] = numValue;
        } else {
          console.warn(`Invalid ${field} value:`, value);
          return; // Don't update if invalid
        }
      }
    } else {
      // For other fields, just update normally
      updatedAddress[field] = value;
    }
    
    // Pass the updated address to the parent
    onAddressChange(updatedAddress);
    
    // Log for debugging
    if (field === 'latitude' || field === 'longitude') {
      console.log(`Updated ${field}:`, updatedAddress[field], typeof updatedAddress[field]);
    }
  };

  const updateContactInfo = (field: keyof ContactInfo, value: any) => {
    onContactInfoChange({
      ...contactInfo,
      [field]: value,
    });
  };

  const updateSocialMedia = (field: keyof ContactInfo['socialMedia'], value: string) => {
    onContactInfoChange({
      ...contactInfo,
      socialMedia: {
        ...contactInfo.socialMedia,
        [field]: value,
      },
    });
  };

  // Get user's current location
  const getCurrentLocation = async () => {
    try {
      setMapLoading(true);
      
      if (!locationPermission) {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
          setMapLoading(false);
          return;
        }
        setLocationPermission(true);
      }
      
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      const { latitude, longitude } = location.coords;
      
      // Update temp location for the map
      setTempLocation({ latitude, longitude });
      
      if (mapModalVisible) {
        // If the modal is open, center the map
        mapViewRef.current?.animateToRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }, 500);
      } else {
        // If not in map modal, update the address directly
        updateAddress('latitude', latitude);
        updateAddress('longitude', longitude);
        
        // Get address details from coordinates
        reverseGeocode(latitude, longitude);
      }
    } catch (error) {
      console.error('Error getting current location:', error);
      Alert.alert('Error', 'Failed to get your current location. Please try again.');
    } finally {
      setMapLoading(false);
    }
  };
  
  // Convert address to coordinates
  const geocodeAddress = async () => {
    try {
      setMapLoading(true);
      
      const searchQuery = [
        address.street,
        address.city,
        address.state,
        address.country,
        address.postalCode
      ].filter(Boolean).join(', ');
      
      if (!searchQuery) {
        Alert.alert('Missing Information', 'Please enter some address information first');
        setMapLoading(false);
        return;
      }
      
      const results = await Location.geocodeAsync(searchQuery);
      
      if (results.length > 0) {
        const { latitude, longitude } = results[0];
        
        // Update temp location for the map
        setTempLocation({ latitude, longitude });
        
        if (mapModalVisible) {
          // If the modal is open, center the map
          mapViewRef.current?.animateToRegion({
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }, 500);
        } else {
          // If not in map modal, update the address directly - important to use Number() here
          updateAddress('latitude', Number(latitude));
          updateAddress('longitude', Number(longitude));
          
          // Verify that the coordinates were actually saved
          console.log("Updated coordinates:", { 
            lat: Number(latitude), 
            lng: Number(longitude),
            savedLat: address.latitude,
            savedLng: address.longitude
          });
          
          // Show confirmation to the user
          Alert.alert('Location Found', 'Your restaurant location has been set successfully.');
        }
      } else {
        Alert.alert('Location Not Found', 'Unable to find coordinates for this address. Try to be more specific.');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      Alert.alert('Error', 'Failed to find the location. Please check the address and try again.');
    } finally {
      setMapLoading(false);
    }
  };
  
  // Search for a location
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setMapLoading(true);
      const results = await Location.geocodeAsync(searchQuery);
      
      if (results.length > 0) {
        const { latitude, longitude } = results[0];
        
        // Update temp location for the map
        setTempLocation({ latitude, longitude });
        
        if (mapModalVisible) {
          // If the modal is open, center the map
          mapViewRef.current?.animateToRegion({
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }, 500);
        } else {
          // If not in map modal, update the address directly - use Number() to ensure type
          updateAddress('latitude', Number(latitude));
          updateAddress('longitude', Number(longitude));
          
          // Get address details from coordinates
          reverseGeocode(latitude, longitude);
          
          // Show confirmation to the user
          Alert.alert('Location Found', 'Your restaurant location has been set successfully.');
        }
        
        setSearchQuery(''); // Clear search after success
      } else {
        Alert.alert('Location Not Found', 'Unable to find this location. Try a different search term.');
      }
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Error', 'Failed to search for location. Please try again.');
    } finally {
      setMapLoading(false);
    }
  };
  
  // Convert coordinates to address
  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      const result = await Location.reverseGeocodeAsync({
        latitude,
        longitude
      });
      
      if (result.length > 0) {
        const location = result[0];
        
        // Always update address fields with location data
        updateAddress('street', location.street || address.street || '');
        updateAddress('city', location.city || address.city || '');
        updateAddress('state', location.region || address.state || '');
        updateAddress('country', location.country || address.country || '');
        updateAddress('postalCode', location.postalCode || address.postalCode || '');
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
    }
  };
  
  // Handle map press in the modal
  const handleMapPress = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setTempLocation({ latitude, longitude });
  };
  
  // Save location from modal
  const saveLocation = () => {
    try {
      // Ensure tempLocation values are numbers
      const latitude = Number(tempLocation.latitude);
      const longitude = Number(tempLocation.longitude);
      
      if (isNaN(latitude) || isNaN(longitude)) {
        throw new Error('Invalid coordinates');
      }
      
      // First update the address with valid number coordinates
      const updatedAddress = { ...address };
      updatedAddress.latitude = latitude;
      updatedAddress.longitude = longitude;
      onAddressChange(updatedAddress);
      
      // Get address details from coordinates
      reverseGeocode(latitude, longitude);
      
      // Close the modal
      setMapModalVisible(false);
      
      // Log successful update
      console.log("Location saved successfully:", { latitude, longitude });
      
      // Show confirmation to the user
      Alert.alert('Location Saved', 'Your restaurant location has been set successfully.');
    } catch (error) {
      console.error('Error saving location:', error);
      Alert.alert('Error', 'Failed to save location. Please try again.');
    }
  };

  // Function for manual coordinate entry
  const handleManualCoordinateEntry = () => {
    Alert.prompt(
      'Enter Coordinates',
      'Please enter latitude and longitude separated by comma (e.g., 37.7749, -122.4194)',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Save',
          onPress: (input) => {
            if (!input) return;
            
            const [latStr, lngStr] = input.split(',');
            const lat = Number(latStr.trim());
            const lng = Number(lngStr.trim());
            
            if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
              Alert.alert('Invalid Coordinates', 'Please enter valid latitude (-90 to 90) and longitude (-180 to 180).');
              return;
            }
            
            // Update the coordinates
            updateAddress('latitude', lat);
            updateAddress('longitude', lng);
            
            // Also update temp location
            setTempLocation({ latitude: lat, longitude: lng });
            
            // Get address details from coordinates
            reverseGeocode(lat, lng);
            
            // Show confirmation to the user
            Alert.alert('Coordinates Saved', 'Your restaurant location has been set successfully.');
          }
        }
      ],
      'plain-text'
    );
  };
  
  // Check if we have valid coordinates
  const hasValidCoordinates = typeof address.latitude === 'number' && 
                             !isNaN(address.latitude) && 
                             typeof address.longitude === 'number' && 
                             !isNaN(address.longitude);

  return (
    <View>
      <FormSection title="Address">
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Search Location
        </Text>
        <View style={styles.searchContainer}>
          <View style={[styles.searchInputContainer, { borderColor: colors.border, backgroundColor: colors.background }]}>
            <Feather name="search" size={18} color={colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search for a location"
              placeholderTextColor={colors.textSecondary}
              style={[styles.searchInputField, { color: colors.text }]}
              onSubmitEditing={handleSearch}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
                <Feather name="x" size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            ) : null}
          </View>
          <TouchableOpacity 
            style={[styles.searchButton, { backgroundColor: colors.primary }]} 
            onPress={handleSearch}
            disabled={!searchQuery.trim() || mapLoading}
          >
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>

        <FormInput
          label="Street Address"
          value={address.street}
          onChangeText={(text) => updateAddress('street', text)}
          placeholder="Enter street address"
          required
        />
        <FormInput
          label="City"
          value={address.city}
          onChangeText={(text) => updateAddress('city', text)}
          placeholder="Enter city"
          required
        />
        <FormInput
          label="State/Province"
          value={address.state}
          onChangeText={(text) => updateAddress('state', text)}
          placeholder="Enter state/province"
        />
        <FormInput
          label="Country"
          value={address.country}
          onChangeText={(text) => updateAddress('country', text)}
          placeholder="Enter country"
          required
        />
        <FormInput
          label="Postal/Zip Code"
          value={address.postalCode}
          onChangeText={(text) => updateAddress('postalCode', text)}
          placeholder="Enter postal/zip code"
          keyboardType="numeric"
        />

        {/* Map preview and button to open map modal */}
        <Text style={[styles.label, { color: colors.textSecondary, marginTop: 16 }]}>
          Location Coordinates *
        </Text>
        
        {hasValidCoordinates ? (
          <View style={[styles.selectedLocation, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.selectedLocationHeader}>
              <Feather name="map-pin" size={18} color={colors.primary} />
              <Text style={[styles.selectedLocationTitle, { color: colors.text }]}>
                Selected Location
              </Text>
            </View>
            
            {/* Simple map preview for visual confirmation */}
            <View style={[styles.mapPreview, { backgroundColor: colors.primary + '10' }]}>
              <View style={[styles.mapPreviewPin, { backgroundColor: colors.background }]}>
                <Feather name="map-pin" size={24} color={colors.primary} />
              </View>
              <Text style={[styles.mapPreviewText, { color: colors.text }]}>
                Location Selected
              </Text>
            </View>
            
            <Text style={[styles.selectedLocationAddress, { color: colors.text }]}>
              {address.street ? address.street + ', ' : ''}
              {address.city ? address.city + ', ' : ''}
              {address.state ? address.state + ', ' : ''}
              {address.country || ''}
              {address.postalCode ? ' ' + address.postalCode : ''}
            </Text>
            
            <Text style={[styles.selectedLocationCoordinates, { color: colors.textSecondary }]}>
              Coordinates: {address.latitude !== null ? address.latitude.toFixed(6) : 'N/A'}, {address.longitude !== null ? address.longitude.toFixed(6) : 'N/A'}
            </Text>
            
            <View style={styles.locationActions}>
              <TouchableOpacity 
                style={[styles.locationActionButton, { backgroundColor: colors.primary }]}
                onPress={() => {
                  setTempLocation({
                    latitude: address.latitude ?? 0,
                    longitude: address.longitude ?? 0,
                  });
                  setMapModalVisible(true);
                }}
              >
                <Feather name="edit-2" size={16} color="#FFF" />
                <Text style={styles.locationActionText}>Edit</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.locationActionButton, { backgroundColor: colors.secondary?.yellow || '#FF0000' }]}
                onPress={() => {
                  Alert.alert(
                    'Remove Location',
                    'Are you sure you want to remove this location?',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { 
                        text: 'Remove', 
                        style: 'destructive',
                        onPress: () => {
                          updateAddress('latitude', null);
                          updateAddress('longitude', null);
                        }
                      }
                    ]
                  );
                }}
              >
                <Feather name="trash-2" size={16} color="#FFF" />
                <Text style={styles.locationActionText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={[styles.noLocationSelected, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Feather name="map-pin" size={24} color={colors.textSecondary} />
            <Text style={[styles.noLocationText, { color: colors.textSecondary }]}>
              No location selected yet
            </Text>
            <Text style={[styles.noLocationSubtext, { color: colors.textSecondary }]}>
              Please set your restaurant's exact location
            </Text>
            <View style={styles.noLocationActions}>
              <TouchableOpacity 
                style={[styles.mapViewButton, { backgroundColor: colors.primary }]}
                onPress={() => setMapModalVisible(true)}
              >
                <Feather name="map" size={16} color="#FFF" />
                <Text style={styles.mapViewButtonText}>Select on Map</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.mapViewButton, { backgroundColor: colors.secondary?.yellow || '#FF0000' }]}
                onPress={handleManualCoordinateEntry}
              >
                <Feather name="edit" size={16} color="#FFF" />
                <Text style={styles.mapViewButtonText}>Enter Manually</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Location Selection Buttons */}
        <View style={styles.mapActions}>
          <TouchableOpacity 
            style={[styles.mapActionButton, { backgroundColor: colors.primary }]}
            onPress={geocodeAddress}
            disabled={mapLoading}
          >
            <Feather name="search" size={16} color="#fff" />
            <Text style={styles.mapActionText}>Get Coordinates from Address</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.mapActionButton, { backgroundColor: colors.primary }]}
            onPress={getCurrentLocation}
            disabled={mapLoading || locationPermission === false}
          >
            <Feather name="map-pin" size={16} color="#fff" />
            <Text style={styles.mapActionText}>Use Current Location</Text>
          </TouchableOpacity>
        </View>
      </FormSection>

      <FormSection title="Contact Information">
        <FormInput
          label="Email Address"
          value={contactInfo.email}
          onChangeText={(text) => updateContactInfo('email', text)}
          placeholder="Enter email address"
          keyboardType="email-address"
          required
        />
        <FormInput
          label="Phone Number"
          value={contactInfo.phone}
          onChangeText={(text) => updateContactInfo('phone', text)}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
          required
        />
        <FormInput
          label="Website"
          value={contactInfo.website}
          onChangeText={(text) => updateContactInfo('website', text)}
          placeholder="Enter website URL"
          keyboardType="url"
        />

        <FormSection subtitle="Social Media">
          <FormInput
            label="Instagram"
            value={contactInfo.socialMedia.instagram}
            onChangeText={(text) => updateSocialMedia('instagram', text)}
            placeholder="Instagram handle"
            leftIcon="instagram"
          />
          <FormInput
            label="Facebook"
            value={contactInfo.socialMedia.facebook}
            onChangeText={(text) => updateSocialMedia('facebook', text)}
            placeholder="Facebook page"
            leftIcon="facebook"
          />
          <FormInput
            label="Twitter"
            value={contactInfo.socialMedia.twitter}
            onChangeText={(text) => updateSocialMedia('twitter', text)}
            placeholder="Twitter handle"
            leftIcon="twitter"
          />
        </FormSection>
      </FormSection>

      {/* Map Modal */}
      <Modal
        visible={mapModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setMapModalVisible(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          {/* Modal Header */}
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <TouchableOpacity 
              onPress={() => setMapModalVisible(false)} 
              style={styles.modalButton}
            >
              <Text style={{ color: colors.text }}>Cancel</Text>
            </TouchableOpacity>
            
            <Text style={[styles.modalTitle, { color: colors.text }]}>Select Location</Text>
            
            <TouchableOpacity 
              onPress={saveLocation} 
              style={styles.modalButton}
            >
              <Text style={{ color: colors.primary, fontWeight: '600' }}>Save</Text>
            </TouchableOpacity>
          </View>

          {/* Modal Search */}
          <View style={styles.modalSearchContainer}>
            <View style={[styles.modalSearchBox, { borderColor: colors.border, backgroundColor: colors.surface }]}>
              <Feather name="search" size={18} color={colors.textSecondary} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search for a location"
                placeholderTextColor={colors.textSecondary}
                style={[styles.modalSearchInput, { color: colors.text }]}
                onSubmitEditing={handleSearch}
              />
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Feather name="x" size={18} color={colors.textSecondary} />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
          
          {/* Map View */}
          <View style={styles.modalMapContainer}>
            {mapLoading && (
              <View style={[styles.loaderContainer, { backgroundColor: colors.background + 'DD' }]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[styles.loaderText, { color: colors.text }]}>Loading map...</Text>
              </View>
            )}
            
            <MapView
              ref={mapViewRef}
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              initialRegion={{
                latitude: tempLocation.latitude,
                longitude: tempLocation.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              onPress={handleMapPress}
              showsUserLocation
            >
              <Marker
                coordinate={{
                  latitude: tempLocation.latitude,
                  longitude: tempLocation.longitude,
                }}
                draggable
                onDragEnd={(e) => {
                  const { latitude, longitude } = e.nativeEvent.coordinate;
                  setTempLocation({ latitude, longitude });
                }}
                pinColor={colors.primary}
              />
            </MapView>
            
            <View style={styles.mapControlsOverlay}>
              <TouchableOpacity 
                style={[styles.mapControlButton, { backgroundColor: colors.card }]}
                onPress={getCurrentLocation}
              >
                <Feather name="navigation" size={22} color={colors.primary} />
              </TouchableOpacity>
            </View>
            
            <View style={[styles.mapInstructions, { backgroundColor: colors.card }]}>
              <Text style={{ color: colors.textSecondary }}>
                Tap on the map or drag the pin to set the exact location
              </Text>
            </View>
            
            {/* Save button at the bottom of map */}
            <View style={styles.mapSaveButtonContainer}>
              <TouchableOpacity
                style={[styles.mapSaveButton, { backgroundColor: colors.primary }]}
                onPress={saveLocation}
              >
                <Text style={styles.mapSaveButtonText}>Save This Location</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const SCREEN_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  helperText: {
    fontSize: 12,
    marginBottom: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInputField: {
    flex: 1,
    height: 40,
    padding: 0,
    margin: 0,
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  searchButton: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  mapActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  mapActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  mapActionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  selectedLocation: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  selectedLocationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectedLocationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  selectedLocationAddress: {
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 20,
  },
  selectedLocationCoordinates: {
    fontSize: 14,
    marginBottom: 12,
  },
  mapPreview: {
    height: 120,
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPreviewPin: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  mapPreviewText: {
    fontSize: 14,
    fontWeight: '500',
  },
  locationActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  locationActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    flex: 0.48,
  },
  locationActionText: {
    color: '#FFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  noLocationSelected: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  noLocationText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
    marginBottom: 4,
  },
  noLocationSubtext: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 16,
  },
  noLocationActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
  },
  mapViewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    flex: 0.48,
  },
  mapViewButtonText: {
    color: '#FFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalButton: {
    padding: 8,
  },
  modalSearchContainer: {
    padding: 16,
  },
  modalSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 46,
  },
  modalSearchInput: {
    flex: 1,
    height: 40,
    marginLeft: 8,
    fontSize: 16,
  },
  modalMapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapControlsOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  mapControlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  mapInstructions: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 70,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  loaderText: {
    marginTop: 8,
    fontSize: 14,
  },
  mapSaveButtonContainer: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    zIndex: 10,
  },
  mapSaveButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  mapSaveButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
});