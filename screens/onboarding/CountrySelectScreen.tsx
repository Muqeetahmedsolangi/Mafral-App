// screens/onboarding/CountrySelectScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "@/components/ui/Button";

// Sample country data
const COUNTRIES = [
  { code: "US", name: "United States", flag: "🇺🇸", phoneCode: "+1" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", phoneCode: "+44" },
  { code: "CA", name: "Canada", flag: "🇨🇦", phoneCode: "+1" },
  { code: "AU", name: "Australia", flag: "🇦🇺", phoneCode: "+61" },
  { code: "IN", name: "India", flag: "🇮🇳", phoneCode: "+91" },
  { code: "DE", name: "Germany", flag: "🇩🇪", phoneCode: "+49" },
  { code: "FR", name: "France", flag: "🇫🇷", phoneCode: "+33" },
  { code: "JP", name: "Japan", flag: "🇯🇵", phoneCode: "+81" },
  { code: "BR", name: "Brazil", flag: "🇧🇷", phoneCode: "+55" },
  { code: "RU", name: "Russia", flag: "🇷🇺", phoneCode: "+7" },
  { code: "CN", name: "China", flag: "🇨🇳", phoneCode: "+86" },
  { code: "IT", name: "Italy", flag: "🇮🇹", phoneCode: "+39" },
  { code: "ES", name: "Spain", flag: "🇪🇸", phoneCode: "+34" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱", phoneCode: "+31" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦", phoneCode: "+966" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦", phoneCode: "+27" },
  { code: "MX", name: "Mexico", flag: "🇲🇽", phoneCode: "+52" },
  { code: "SG", name: "Singapore", flag: "🇸🇬", phoneCode: "+65" },
  { code: "SE", name: "Sweden", flag: "🇸🇪", phoneCode: "+46" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭", phoneCode: "+41" },
];

export const CountrySelectScreen = () => {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [countries, setCountries] = useState(COUNTRIES);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Filter countries based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setCountries(COUNTRIES);
      return;
    }

    const filtered = COUNTRIES.filter(
      (country) =>
        country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        country.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setCountries(filtered);
  }, [searchQuery]);

  const handleSelectCountry = (country) => {
    setSelectedCountry(country);
  };

  const handleContinue = async () => {
    if (!selectedCountry) return;

    setIsLoading(true);

    try {
      // Save selected country to AsyncStorage
      await AsyncStorage.setItem(
        "@user_country",
        JSON.stringify(selectedCountry)
      );

      // Mark app as launched
      await AsyncStorage.setItem("@app_has_launched", "true");

      // Navigate to auth screen
      setTimeout(() => {
        setIsLoading(false);
        router.push("/auth/signin");
      }, 800);
    } catch (error) {
      console.log("Error saving country:", error);
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Select Your Country
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Please select your country to help us provide the right content and
          services for your region
        </Text>

        <View
          style={[
            styles.searchContainer,
            { borderColor: colors.border, backgroundColor: colors.surface },
          ]}
        >
          <Feather name="search" size={20} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search countries..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Feather name="x" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>

        <FlatList
          data={countries}
          keyExtractor={(item) => item.code}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.countryItem,
                selectedCountry?.code === item.code && {
                  backgroundColor: colors.surfaceVariant,
                },
              ]}
              onPress={() => handleSelectCountry(item)}
            >
              <Text style={styles.flag}>{item.flag}</Text>
              <Text style={[styles.countryName, { color: colors.text }]}>
                {item.name}
              </Text>
              <Text style={[styles.countryCode, { color: colors.textMuted }]}>
                {item.phoneCode}
              </Text>
              {selectedCountry?.code === item.code && (
                <Feather name="check" size={20} color={colors.primary} />
              )}
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.countriesList}
        />
      </View>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Button
          title="Continue"
          variant="primary"
          size="large"
          disabled={!selectedCountry || isLoading}
          loading={isLoading}
          onPress={handleContinue}
          style={{ width: "100%" }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  description: {
    marginBottom: 24,
    textAlign: "center",
    paddingHorizontal: 20,
    fontSize: 14,
    lineHeight: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 8,
    height: 50,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  countriesList: {
    paddingBottom: 16,
  },
  countryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  flag: {
    fontSize: 24,
    marginRight: 16,
  },
  countryName: {
    flex: 1,
    fontSize: 16,
  },
  countryCode: {
    fontSize: 14,
    marginRight: 8,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 8,
    borderTopWidth: 1,
  },
});
