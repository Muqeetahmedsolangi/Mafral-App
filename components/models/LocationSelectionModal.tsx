import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Animated,
  PanResponder,
  Modal,
  ActivityIndicator,
  Dimensions,
  Keyboard,
  StatusBar,
  Platform,
  Alert,
} from "react-native";
import MapView, { Marker, MarkerDragStartEndEvent } from "react-native-maps";
import * as Location from "expo-location";
import { Feather } from "@expo/vector-icons";
import { Button } from "@/components/ui/Button";

const { width, height } = Dimensions.get("window");
const MODAL_HEIGHT = height * 0.85;
const DRAG_THRESHOLD = 50;

interface LocationSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  colors: any; 
  onSelectLocation: (location: any, address: string) => void;
  initialLocation: any | null;
}

const LocationSelectionModal: React.FC<LocationSelectionModalProps> = ({
  visible,
  onClose,
  colors,
  onSelectLocation,
  initialLocation,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState(initialLocation);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Location.LocationGeocodedLocation[]>([]);
  const [showResults, setShowResults] = useState(false);
  const mapRef = useRef<MapView | null>(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  
  // Animation values
  const slideAnim = useRef(new Animated.Value(height)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const minimizedHeight = height * 0.3;
  const [modalHeight, setModalHeight] = useState(MODAL_HEIGHT);
  const [isDragging, setIsDragging] = useState(false);
  
  useEffect(() => {
    // Request location permissions when modal becomes visible
    if (visible) {
      requestLocationPermissions();
    }
  }, [visible]);

  // Function to request location permissions
  const requestLocationPermissions = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setHasLocationPermission(true);
      } else {
        setHasLocationPermission(false);
        Alert.alert(
          "Permission Required",
          "Location permission is required to search for locations. Please grant permission in your device settings.",
          [
            { text: "OK", style: "default" }
          ]
        );
      }
    } catch (error) {
      console.log("Error requesting location permission:", error);
    }
  };
  
  useEffect(() => {
    // Handle keyboard events
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
        setModalHeight(height * 0.7); // Adjust for keyboard
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
        setModalHeight(MODAL_HEIGHT);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
  
  useEffect(() => {
    if (visible) {
      // Open the modal with animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
      
      // Set default location if needed
      if (!location) {
        (async () => {
          try {
            // Default to a known location (Bangalore)
            setLocation({
              coords: {
                latitude: 12.9716,
                longitude: 77.5946,
              },
              timestamp: Date.now(),
            });
          } catch (error) {
            console.log("Error setting default location:", error);
          }
        })();
      }
    } else {
      // Close the modal with animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, location]);
  
  // Pan responder for dragging
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        slideAnim.extractOffset();
        setIsDragging(true);
      },
      onPanResponderMove: (_, gestureState) => {
        // Only allow dragging down
        if (gestureState.dy > 0) {
          slideAnim.setValue(-gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        slideAnim.flattenOffset();
        setIsDragging(false);
        
        // If dragged down far enough, close the modal
        if (gestureState.dy > DRAG_THRESHOLD) {
          handleCloseModal();
        } else {
          // Spring back to open position
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 5,
          }).start();
        }
      },
    })
  ).current;
  
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setShowResults(false);
    
    try {
      // Check if we have location permission before searching
      if (!hasLocationPermission) {
        await requestLocationPermissions();
        if (!hasLocationPermission) {
          throw new Error("Location permission not granted");
        }
      }
      
      const results = await Location.geocodeAsync(searchQuery);
      if (results.length > 0) {
        setSearchResults(results.slice(0, 5));
        setShowResults(true);
      } else {
        setSearchResults([]);
        // Show no results found message
        Alert.alert(
          "No Results",
          "No locations found matching your search. Please try another search term.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.log("Error searching locations:", error);
      Alert.alert(
        "Search Error",
        "Unable to search for locations. Please check your internet connection and location permissions.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const selectSearchResult = async (result: { latitude: any; longitude: any; altitude?: number | undefined; accuracy?: number | undefined; }) => {
    Keyboard.dismiss();
    setIsLoading(true);
    try {
      const newLocation = {
        coords: {
          latitude: result.latitude,
          longitude: result.longitude,
        },
        timestamp: Date.now(),
      };
      setLocation(newLocation);
      setShowResults(false);
      
      // Get address from coordinates for display
      const addresses = await Location.reverseGeocodeAsync({
        latitude: result.latitude,
        longitude: result.longitude,
      });
      
      if (addresses.length > 0) {
        const address = addresses[0];
        const addressText = formatAddress(address);
        setSelectedAddress(addressText);
      }
      
      // Animate map to new location
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: result.latitude,
          longitude: result.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }, 500);
      }
    } catch (error) {
      console.log("Error selecting location:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMapPress = async (e: MarkerDragStartEndEvent) => {
    Keyboard.dismiss();
    setIsLoading(true);
    try {
      const { latitude, longitude } = e.nativeEvent.coordinate;
      setLocation({
        coords: {
          latitude,
          longitude,
        },
        timestamp: Date.now(),
      });
      
      // Get address for the selected coordinates
      const addresses = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      
      if (addresses.length > 0) {
        const address = addresses[0];
        const addressText = formatAddress(address);
        setSelectedAddress(addressText);
      }
    } catch (error) {
      console.log("Error setting location from map press:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatAddress = (address: { city: any; district?: string | null; streetNumber?: string | null; street: any; region: any; subregion?: string | null; country: any; postalCode?: string | null; name: any; isoCountryCode?: string | null; timezone?: string | null; formattedAddress?: string | null; }) => {
    const parts = [];
    if (address.name) parts.push(address.name);
    if (address.street) parts.push(address.street);
    if (address.city) parts.push(address.city);
    if (address.region) parts.push(address.region);
    if (address.country) parts.push(address.country);
    
    return parts.join(", ");
  };

  const confirmLocation = () => {
    if (location) {
      handleCloseModal();
      setTimeout(() => {
        onSelectLocation(location, selectedAddress);
      }, 300);
    }
  };
  
  const handleCloseModal = () => {
    // Animate closing before calling the onClose
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
      // Reset state
      setShowResults(false);
      setSearchQuery("");
    });
  };

  if (!visible) return null;

  const isWeb = Platform.OS === 'web';

  return (
    <Modal
      transparent={true}
      visible={visible}
      statusBarTranslucent
      onRequestClose={handleCloseModal}
    >
      {/* Backdrop */}
      <Animated.View 
        style={[
          styles.backdrop, 
          { opacity: backdropOpacity, backgroundColor: 'rgba(0,0,0,0.7)' }
        ]}
        onTouchStart={handleCloseModal}
      />
      
      <Animated.View
        style={[
          styles.modalContainer,
          {
            backgroundColor: colors.background,
            height: modalHeight,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Handle for dragging */}
        <View
          style={styles.dragHandleContainer}
          {...panResponder.panHandlers}
        >
          <View style={[styles.dragHandle, { backgroundColor: colors.border }]} />
        </View>
        
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Select your location
          </Text>
          <TouchableOpacity 
            onPress={handleCloseModal} 
            style={[styles.closeButton, { backgroundColor: colors.surfaceVariant }]}
          >
            <Feather name="x" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
        
        {!hasLocationPermission && (
          <View style={[styles.permissionWarning, { backgroundColor: colors.surfaceVariant }]}>
            <Feather name="alert-triangle" size={18} color={colors.warning} style={styles.warningIcon} />
            <Text style={[styles.warningText, { color: colors.text }]}>
              Location permission not granted. Some features may be limited.
            </Text>
            <TouchableOpacity 
              onPress={requestLocationPermissions}
              style={[styles.permissionButton, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.permissionButtonText}>Grant</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <View style={[styles.searchWrapper]}>
          <View style={[styles.searchContainer, { backgroundColor: colors.surfaceVariant }]}>
            <Feather
              name="map-pin"
              size={20}
              color={colors.textSecondary}
              style={styles.searchIcon}
            />
            <TextInput
              placeholder="Search location, city or address"
              placeholderTextColor={colors.textSecondary}
              style={[styles.searchInput, { color: colors.text }]}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.primary} style={styles.searchSpinner} />
            ) : (
              searchQuery.length > 0 && (
                <TouchableOpacity 
                  onPress={() => setSearchQuery("")} 
                  style={styles.clearButton}
                >
                  <Feather name="x-circle" size={18} color={colors.textSecondary} />
                </TouchableOpacity>
              )
            )}
            <TouchableOpacity 
              onPress={handleSearch}
              style={[
                styles.searchButton, 
                { 
                  backgroundColor: !searchQuery.trim() || isLoading ? colors.surfaceVariant : colors.primary,
                  opacity: !searchQuery.trim() || isLoading ? 0.5 : 1 
                }
              ]}
              disabled={!searchQuery.trim() || isLoading}
            >
              <Feather name="search" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
          
          {/* Search Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <View style={[styles.resultsContainer, { backgroundColor: colors.card }]}>
              {searchResults.map((result, index) => (
                <TouchableOpacity
                  key={`result-${index}`}
                  style={[
                    styles.resultItem,
                    index < searchResults.length - 1 && { 
                      borderBottomColor: colors.border, 
                      borderBottomWidth: 0.5 
                    }
                  ]}
                  onPress={() => selectSearchResult(result)}
                >
                  <Feather name="map-pin" size={16} color={colors.textSecondary} style={styles.resultIcon} />
                  <Text style={[styles.resultText, { color: colors.text }]} numberOfLines={1}>
                    {`${searchQuery} (${result.latitude.toFixed(4)}, ${result.longitude.toFixed(4)})`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
          
        {location && !isWeb && (
          <View style={styles.mapContainer}>
            <MapView
              ref={mapRef}
              style={styles.map}
              initialRegion={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              }}
              onPress={handleMapPress}
              showsUserLocation={hasLocationPermission}
              showsCompass={true}
              showsScale={true}
            >
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                title="Selected location"
                pinColor={colors.primary}
                draggable
                onDragEnd={(e) => handleMapPress(e)}
              />
            </MapView>
            
            {/* Location indicator at center */}
            {isLoading && (
              <View style={[styles.mapLoadingIndicator, { backgroundColor: colors.card }]}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            )}
            
            {/* Location info panel */}
            {selectedAddress && (
              <View style={[styles.addressPanel, { backgroundColor: colors.card }]}>
                <Feather name="map-pin" size={18} color={colors.primary} style={{ marginRight: 8 }} />
                <Text style={[styles.addressText, { color: colors.text }]} numberOfLines={2}>
                  {selectedAddress}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Add a web-specific fallback */}
        {location && isWeb && (
          <View style={[styles.mapContainer, {justifyContent: 'center', alignItems: 'center'}]}>
            <View style={[styles.webMapContainer, {backgroundColor: colors.surfaceVariant}]}>
              <Text style={[styles.webMapText, {color: colors.text}]}>
                Selected Location: {location.coords.latitude.toFixed(5)}, {location.coords.longitude.toFixed(5)}
              </Text>
              
              {selectedAddress && (
                <View style={{marginTop: 12, alignItems: 'center'}}>
                  <Feather name="map-pin" size={24} color={colors.primary} style={{marginBottom: 8}} />
                  <Text style={[{color: colors.text, textAlign: 'center'}]}>{selectedAddress}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <Button
            title="Confirm location"
            variant="primary"
            size="large"
            onPress={confirmLocation}
            loading={isLoading}
            style={{ width: "100%" }}
            disabled={!location}
          />
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  dragHandleContainer: {
    width: '100%',
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dragHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 8,
  },
  warningIcon: {
    marginRight: 8,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
  },
  permissionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  searchWrapper: {
    padding: 16,
    zIndex: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 12,
  },
  searchIcon: {
    marginLeft: 8,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 8,
    height: 42,
  },
  searchSpinner: {
    marginRight: 8,
  },
  clearButton: {
    padding: 8,
  },
  searchButton: {
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
    marginRight: 4,
    height: 36,
    width: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsContainer: {
    marginTop: 8,
    borderRadius: 12,
    maxHeight: 200,
    zIndex: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    overflow: 'hidden',
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  resultIcon: {
    marginRight: 12,
  },
  resultText: {
    fontSize: 14,
    flex: 1,
  },
  mapContainer: {
    flex: 1,
    position: "relative",
    marginTop: 8,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  mapLoadingIndicator: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -20,
    marginTop: -20,
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressPanel: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  webMapContainer: {
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  webMapText: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default LocationSelectionModal;