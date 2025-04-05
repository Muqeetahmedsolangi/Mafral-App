// screens/onboarding/InterestsScreen.tsx
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  Text,
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "@/context/ThemeContext";
import { Feather } from "@expo/vector-icons";
import { Button } from "@/components/ui/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";

const INTERESTS = [
  {
    id: 1,
    name: "Travel",
    image: require("@/assets/images/interests/food.jpg"),
  },
  { id: 2, name: "Food", image: require("@/assets/images/interests/food.jpg") },
  {
    id: 3,
    name: "Photography",
    image: require("@/assets/images/interests/food.jpg"),
  },
  {
    id: 4,
    name: "Music",
    image: require("@/assets/images/interests/food.jpg"),
  },
  {
    id: 5,
    name: "Sports",
    image: require("@/assets/images/interests/food.jpg"),
  },
  { id: 6, name: "Art", image: require("@/assets/images/interests/food.jpg") },
  {
    id: 7,
    name: "Fitness",
    image: require("@/assets/images/interests/food.jpg"),
  },
  {
    id: 8,
    name: "Technology",
    image: require("@/assets/images/interests/food.jpg"),
  },
  {
    id: 9,
    name: "Fashion",
    image: require("@/assets/images/interests/food.jpg"),
  },
  {
    id: 10,
    name: "Books",
    image: require("@/assets/images/interests/food.jpg"),
  },
  {
    id: 11,
    name: "Gaming",
    image: require("@/assets/images/interests/food.jpg"),
  },
  {
    id: 12,
    name: "Nature",
    image: require("@/assets/images/interests/food.jpg"),
  },
];

export const InterestsScreen = () => {
  const { colors } = useTheme();
  const [selectedInterests, setSelectedInterests] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleInterest = (id: number) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(selectedInterests.filter((item) => item !== id));
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  const handleContinue = async () => {
    if (selectedInterests.length < 3) {
      alert("Please select at least 3 interests to continue");
      return;
    }

    setIsLoading(true);

    try {
      // Save selected interests
      await AsyncStorage.setItem(
        "@user_interests",
        JSON.stringify(selectedInterests)
      );

      setTimeout(() => {
        setIsLoading(false);
        router.push("/onboarding/location-permission");
      }, 800);
    } catch (error) {
      console.log("Error saving interests:", error);
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
                { backgroundColor: colors.primary, width: "50%" },
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>
            1/2
          </Text>
        </View>
      </View>

      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: colors.text }]}>
          What are you interested in?
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Select at least 3 topics to personalize your experience
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.interestsContainer}
      >
        {INTERESTS.map((interest) => (
          <TouchableOpacity
            key={interest.id}
            style={[
              styles.interestItem,
              selectedInterests.includes(interest.id) &&
                styles.interestSelected,
            ]}
            onPress={() => toggleInterest(interest.id)}
            activeOpacity={0.8}
          >
            <ImageBackground
              source={interest.image}
              style={styles.interestBackground}
              imageStyle={styles.interestImage}
            >
              <View
                style={[
                  styles.interestOverlay,
                  selectedInterests.includes(interest.id) && {
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                  },
                ]}
              />

              <Text style={styles.interestName}>{interest.name}</Text>

              {selectedInterests.includes(interest.id) && (
                <View
                  style={[
                    styles.checkmarkContainer,
                    { backgroundColor: colors.primary },
                  ]}
                >
                  <Feather name="check" size={16} color="#FFFFFF" />
                </View>
              )}
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Button
          title={`Continue (${selectedInterests.length}/3)`}
          variant="primary"
          size="large"
          onPress={handleContinue}
          disabled={selectedInterests.length < 3 || isLoading}
          loading={isLoading}
          style={{ width: "100%" }}
        />
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
  titleContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  scrollView: {
    flex: 1,
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  interestItem: {
    width: "45%",
    aspectRatio: 1,
    margin: "2.5%",
    borderRadius: 16,
    overflow: "hidden",
  },
  interestSelected: {
    borderWidth: 2,
    borderColor: "#FF5722",
  },
  interestBackground: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  interestImage: {
    borderRadius: 16,
  },
  interestOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 16,
  },
  interestName: {
    color: "#FFFFFF",
    fontWeight: "bold",
    marginLeft: 16,
    marginBottom: 16,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  checkmarkContainer: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
});
