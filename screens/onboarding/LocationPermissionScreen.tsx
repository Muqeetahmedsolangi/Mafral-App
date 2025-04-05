// screens/onboarding/LocationPermissionScreen.tsx
import React, { useState } from "react";
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
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "@/context/ThemeContext";
import { Feather } from "@expo/vector-icons";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView, { Marker } from "react-native-maps";
import { Button } from "@/components/ui/Button";

export const LocationPermissionScreen = () => {
  const { colors } = useTheme();
  const [locationStatus, setLocationStatus] = useState<
    "idle" | "loading" | "granted" | "denied"
  >("idle");
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const requestLocationPermission = async () => {
    setLocationStatus("loading");

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        setLocationStatus("granted");

        // Save location data
        await AsyncStorage.setItem(
          "@user_location",
          JSON.stringify({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            timestamp: currentLocation.timestamp,
          })
        );
      } else {
        setLocationStatus("denied");
      }
    } catch (error) {
      console.log("Location permission error:", error);
      setLocationStatus("denied");
    }
  };

  const openSettings = () => {
    if (Platform.OS === "ios") {
      Linking.openURL("app-settings:");
    } else {
      Linking.openSettings();
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

      setTimeout(() => {
        setIsLoading(false);
        router.replace("/(tabs)");
      }, 800);
    } catch (error) {
      console.log("Error completing onboarding:", error);
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar style="dark" />

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

        {locationStatus === "granted" && location && (
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                title="Your location"
              />
            </MapView>
            <View
              style={[
                styles.locationInfoCard,
                { backgroundColor: colors.card },
              ]}
            >
              <Text style={[styles.locationInfoTitle, { color: colors.text }]}>
                Location Found
              </Text>
              <Text
                style={[
                  styles.locationInfoText,
                  { color: colors.textSecondary },
                ]}
              >
                Latitude: {location.coords.latitude.toFixed(6)}
              </Text>
              <Text
                style={[
                  styles.locationInfoText,
                  { color: colors.textSecondary },
                ]}
              >
                Longitude: {location.coords.longitude.toFixed(6)}
              </Text>
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
            <TouchableOpacity
              style={[styles.settingsButton, { borderColor: colors.primary }]}
              onPress={openSettings}
            >
              <Text style={{ color: colors.primary }}>Open Settings</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        {locationStatus !== "granted" && locationStatus !== "loading" && (
          <Button
            title="Allow Location Access"
            variant="primary"
            size="large"
            onPress={requestLocationPermission}
            style={{ width: "100%", marginBottom: 16 }}
          />
        )}

        {locationStatus === "granted" ? (
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
    height: 200,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    textAlign: "center",
    marginBottom: 32,
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
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  locationInfoCard: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    padding: 12,
    borderRadius: 8,
  },
  locationInfoTitle: {
    fontWeight: "600",
    marginBottom: 4,
    fontSize: 16,
  },
  locationInfoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  deniedContainer: {
    width: "100%",
    padding: 16,
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
  settingsButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 10,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
});
