import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Linking,
  Alert,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "@/context/ThemeContext";
import { Feather } from "@expo/vector-icons";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView, { Marker, MapViewProps } from "react-native-maps";
import { Button } from "@/components/ui/Button";
import LocationSelectionModal from "@/components/models/LocationSelectionModal";

const { width, height } = Dimensions.get('window');

// Define proper TypeScript interfaces
interface LocationObject {
  coords: {
    latitude: number;
    longitude: number;
    accuracy: number | null;
    altitude?: number | null;
    altitudeAccuracy?: number | null;
    heading?: number | null;
    speed?: number | null;
  };
  timestamp: number;
}

interface StoredLocationData {
  latitude: number;
  longitude: number;
  timestamp: number;
  address?: string;
}

interface AddressObject {
  street?: string;
  city?: string;
  region?: string;
  country?: string;
  postalCode?: string;
  name?: string;
  district?: string;
}

export const LocationPermissionScreen: React.FC = () => {
  const { colors } = useTheme();
  const [locationStatus, setLocationStatus] = useState<
    "idle" | "loading" | "granted" | "denied" | "manual"
  >("idle");
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [isManualSelectionVisible, setIsManualSelectionVisible] = useState(false);
  const [showFullscreenMap, setShowFullscreenMap] = useState(false);
  const mapRef = useRef<MapView | null>(null);

  // If this is the first time loading the component, try to get location from storage
  useEffect(() => {
    const checkSavedLocation = async () => {
      try {
        const locationData = await AsyncStorage.getItem("@user_location");
        
        if (locationData) {
          const parsedLocation: StoredLocationData = JSON.parse(locationData);
          setLocation({
            coords: {
              latitude: parsedLocation.latitude,
              longitude: parsedLocation.longitude,
              accuracy: null
            },
            timestamp: parsedLocation.timestamp,
          });
          if (parsedLocation.address) {
            setSelectedAddress(parsedLocation.address);
          }
          setLocationStatus("granted");
        }
      } catch (error) {
        console.log("Error retrieving saved location:", error);
      }
    };
    
    checkSavedLocation();
  }, []);

  const requestLocationPermission = async () => {
    setLocationStatus("loading");

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        setLocationStatus("granted");

        try {
          // Try to get address from coordinates
          const addresses = await Location.reverseGeocodeAsync({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
          });
          
          if (addresses.length > 0) {
            const address = addresses[0];
            const addressText = formatAddress(address);
            setSelectedAddress(addressText);
            
            // Save location data with address
            await AsyncStorage.setItem(
              "@user_location",
              JSON.stringify({
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
                timestamp: currentLocation.timestamp,
                address: addressText,
              })
            );
          } else {
            // Save location data without address
            await AsyncStorage.setItem(
              "@user_location",
              JSON.stringify({
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
                timestamp: currentLocation.timestamp,
              })
            );
          }
        } catch (error) {
          console.log("Error getting address:", error);
          
          // Save basic location data
          await AsyncStorage.setItem(
            "@user_location",
            JSON.stringify({
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
              timestamp: currentLocation.timestamp,
            })
          );
        }
      } else {
        setLocationStatus("denied");
      }
    } catch (error) {
      console.log("Location permission error:", error);
      setLocationStatus("denied");
    }
  };

  const formatAddress = (address: AddressObject | Location.LocationGeocodedAddress): string => {
      const parts: string[] = [];
      if (address.street || address.street === null) parts.push(address.street || "");
      if (address.city) parts.push(address.city);
      if (address.region) parts.push(address.region);
      if (address.country) parts.push(address.country);
      
      return parts.join(", ");
    };

  const openSettings = () => {
    if (Platform.OS === "ios") {
      Linking.openURL("app-settings:").catch(err => {
        console.error("Failed to open settings", err);
      });
    } else {
      Linking.openSettings().catch(err => {
        console.error("Failed to open settings", err);
      });
    }
  };

  const handleSkip = () => {
    Alert.alert(
      "Skip Location",
      "Some features may not work properly without location access. Are you sure you want to skip?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Skip",
          onPress: async () => {
            setIsLoading(true);
            try {
              await AsyncStorage.setItem("@location_skipped", "true");
              await completeOnboarding();
            } catch (error) {
              console.log("Error saving skip status:", error);
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleContinue = async () => {
    setIsLoading(true);
    await completeOnboarding();
  };

  const completeOnboarding = async () => {
    try {
      // Mark onboarding as complete
      await AsyncStorage.setItem("@has_completed_onboarding", "true");

      // Use a delay to show loading state briefly
      setTimeout(() => {
        setIsLoading(false);
        router.replace("/(tabs)");
      }, 800);
    } catch (error) {
      console.log("Error completing onboarding:", error);
      setIsLoading(false);
    }
  };

  const openManualLocationSelection = () => {
    setIsManualSelectionVisible(true);
  };
  
  const handleSelectLocation = async (newLocation: LocationObject, address: string) => {
    // Save the selected location
    setLocation(newLocation);
    setSelectedAddress(address);
    setLocationStatus("manual");
    setIsManualSelectionVisible(false);
    
    // Briefly show fullscreen map after selection
    setShowFullscreenMap(true);
    setTimeout(() => {
      setShowFullscreenMap(false);
    }, 2000);
    
    // Save location data
    try {
      await AsyncStorage.setItem(
        "@user_location",
        JSON.stringify({
          latitude: newLocation.coords.latitude,
          longitude: newLocation.coords.longitude,
          timestamp: newLocation.timestamp,
          address: address,
        })
      );
    } catch (error) {
      console.log("Error saving location data:", error);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar style="dark" />

      {/* Full-screen map animation after selection */}
      {showFullscreenMap && location && (
        <View style={styles.fullscreenMapOverlay}>
          <MapView
            style={styles.fullscreenMap}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            zoomEnabled={false}
            rotateEnabled={false}
            scrollEnabled={false}
            pitchEnabled={false}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Your location"
              pinColor={colors.primary}
            />
          </MapView>
          <View style={styles.fullscreenMapGradient} />
          <View style={[styles.fullscreenLocationInfo, { backgroundColor: colors.card }]}>
            <Text style={[styles.locationSuccessTitle, { color: colors.text }]}>
              Location Selected Successfully
            </Text>
            <Text style={[styles.locationSuccessAddress, { color: colors.textSecondary }]}>
              {selectedAddress || "Location ready"}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.header}>
        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressBar,
              { backgroundColor: colors.surfaceVariant },
            ]}
          >
            <View
              style={[
                styles.progress,
                { backgroundColor: colors.primary, width: "100%" },
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>
            2/2
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Image
          source={require("@/assets/images/location-permission.png")}
          style={styles.locationImage}
          resizeMode="contain"
        />

        <Text style={[styles.title, { color: colors.text }]}>
          Enable Location Services
        </Text>

        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Allow Mafral to access your location to find nearby friends and
          content relevant to your area
        </Text>

        {locationStatus === "loading" && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              Getting your location...
            </Text>
          </View>
        )}

        {(locationStatus === "granted" || locationStatus === "manual") && location && (
          <View style={styles.mapContainer}>
            <MapView
              ref={mapRef}
              style={styles.map}
              initialRegion={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.025,
                longitudeDelta: 0.025,
              }}
            >
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                title="Your location"
                pinColor={colors.primary}
              />
            </MapView>
            <TouchableOpacity
              style={[styles.expandMapButton, { backgroundColor: colors.card }]}
              onPress={() => setShowFullscreenMap(true)}
            >
              <Feather name="maximize-2" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
            <View
              style={[
                styles.locationInfoCard,
                { backgroundColor: colors.card },
              ]}
            >
              <Text style={[styles.locationInfoTitle, { color: colors.text }]}>
                Location Found
              </Text>
              {selectedAddress ? (
                <Text style={[styles.locationInfoText, { color: colors.textSecondary }]}>
                  {selectedAddress}
                </Text>
              ) : (
                <>
                  <Text style={[styles.locationInfoText, { color: colors.textSecondary }]}>
                    Latitude: {location.coords.latitude.toFixed(6)}
                  </Text>
                  <Text style={[styles.locationInfoText, { color: colors.textSecondary }]}>
                    Longitude: {location.coords.longitude.toFixed(6)}
                  </Text>
                </>
              )}
              <TouchableOpacity 
                style={[styles.changeLocationButton, { borderColor: colors.primary }]}
                onPress={openManualLocationSelection}
              >
                <Text style={{ color: colors.primary }}>Change Location</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {locationStatus === "denied" && (
          <View
            style={[
              styles.deniedContainer,
              { backgroundColor: colors.surfaceVariant },
            ]}
          >
            <Feather
              name="alert-circle"
              size={24}
              color={colors.textSecondary}
            />
            <Text style={[styles.deniedText, { color: colors.textSecondary }]}>
              Location access denied. Some features may not work without
              location permissions.
            </Text>
            <View style={styles.deniedButtonsRow}>
              <TouchableOpacity
                style={[styles.settingsButton, { borderColor: colors.primary }]}
                onPress={openSettings}
              >
                <Text style={{ color: colors.primary }}>Open Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.settingsButton, { borderColor: colors.primary, marginLeft: 10 }]}
                onPress={openManualLocationSelection}
              >
                <Text style={{ color: colors.primary }}>Set Location Manually</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        {locationStatus !== "granted" && locationStatus !== "manual" && locationStatus !== "loading" && (
          <>
            <Button
              title="Allow Location Access"
              variant="primary"
              size="large"
              onPress={requestLocationPermission}
              style={{ width: "100%", marginBottom: 16 }}
            />
            <Button
              title="Set Location Manually"
              variant="outline"
              size="large"
              onPress={openManualLocationSelection}
              style={{ width: "100%", marginBottom: 16 }}
            />
          </>
        )}

        {(locationStatus === "granted" || locationStatus === "manual") ? (
          <Button
            title="Continue"
            variant="primary"
            size="large"
            loading={isLoading}
            onPress={handleContinue}
            style={{ width: "100%" }}
          />
        ) : (
          <Button
            title="Skip for Now"
            variant="outline"
            size="large"
            loading={isLoading}
            onPress={handleSkip}
            style={{ width: "100%" }}
          />
        )}
      </View>
      
      {/* Location Selection Modal */}
      <LocationSelectionModal
        visible={isManualSelectionVisible}
        onClose={() => setIsManualSelectionVisible(false)}
        colors={colors}
        onSelectLocation={handleSelectLocation}
        initialLocation={location}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginRight: 16,
    flex: 1,
    overflow: "hidden",
  },
  progress: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
  },
  locationImage: {
    width: "80%",
    height: 180,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
    fontSize: 14,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
  },
  mapContainer: {
    width: "100%",
    height: 220,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    position: "relative",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  expandMapButton: {
    position: "absolute",
    top: 12,
    right: 12,
    borderRadius: 8,
    padding: 8,
    zIndex: 10,
  },
  locationInfoCard: {
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
    elevation: 3,
  },
  locationInfoTitle: {
    fontWeight: "700",
    marginBottom: 6,
    fontSize: 16,
  },
  locationInfoText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 2,
  },
  changeLocationButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  deniedContainer: {
    width: "100%",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    marginVertical: 16,
  },
  deniedText: {
    textAlign: "center",
    marginVertical: 10,
    fontSize: 14,
    lineHeight: 20,
  },
  deniedButtonsRow: {
    flexDirection: 'row',
    marginTop: 16,
  },
  settingsButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 8,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  fullscreenMapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  fullscreenMap: {
    width: width,
    height: height,
  },
  fullscreenMapGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.3,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  fullscreenLocationInfo: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  locationSuccessTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  locationSuccessAddress: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});