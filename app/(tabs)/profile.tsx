// app/(tabs)/profile.tsx
import React, { memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";

interface SettingItemProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress: () => void;
}

// Memoized setting item component for better performance
const SettingItem = memo(({ icon, label, onPress }: SettingItemProps) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.settingItem, { borderBottomColor: colors.border }]}
      onPress={onPress}
    >
      <View style={styles.settingItemContent}>
        <Feather
          name={icon}
          size={22}
          color={colors.icon}
          style={styles.settingIcon}
        />
        <Text style={[styles.settingLabel, { color: colors.text }]}>
          {label}
        </Text>
      </View>
      <Feather name="chevron-right" size={18} color={colors.iconInactive} />
    </TouchableOpacity>
  );
});

export default function ProfileScreen() {
  const { colors, toggleTheme, isDarkMode } = useTheme();
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        onPress: () => {
          console.log("Signing out...");
          signOut()
            .then(() => console.log("Sign out successful"))
            .catch((error) => console.error("Sign out error:", error));
        },
        style: "destructive",
      },
    ]);
  };

  // Stats data
  const stats = [
    { label: "Posts", value: "24" },
    { label: "Followers", value: "834" },
    { label: "Following", value: "162" },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/men/36.jpg" }}
            style={styles.profileImage}
          />
          <TouchableOpacity
            style={[
              styles.editImageButton,
              { backgroundColor: colors.primary },
            ]}
          >
            <Feather name="camera" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileInfo}>
          <Text style={[styles.profileName, { color: colors.text }]}>
            {user?.fullName || "User Name"}
          </Text>
          <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
            {user?.email || "user@example.com"}
          </Text>
        </View>
      </View>

      {/* Stats section */}
      <View style={[styles.statsContainer, { backgroundColor: colors.card }]}>
        {stats.map((item, index) => (
          <View key={index} style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {item.value}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              {item.label}
            </Text>
          </View>
        ))}
      </View>

      {/* Edit Profile Button */}
      <TouchableOpacity
        style={[
          styles.editProfileButton,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.editProfileText, { color: colors.text }]}>
          Edit Profile
        </Text>
      </TouchableOpacity>

      {/* Settings Section */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          Account
        </Text>
        <SettingItem
          icon="user"
          label="Personal Information"
          onPress={() => {}}
        />
        <SettingItem icon="lock" label="Security" onPress={() => {}} />
        <SettingItem icon="bell" label="Notifications" onPress={() => {}} />
      </View>

      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          Preferences
        </Text>
        <SettingItem
          icon={isDarkMode ? "sun" : "moon"}
          label={`${isDarkMode ? "Light" : "Dark"} Mode`}
          onPress={() => {
            console.log("Toggling theme");
            toggleTheme();
          }}
        />
        <SettingItem icon="globe" label="Language" onPress={() => {}} />
      </View>

      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          Support
        </Text>
        <SettingItem
          icon="help-circle"
          label="Help Center"
          onPress={() => {}}
        />
        <SettingItem
          icon="file-text"
          label="Terms of Service"
          onPress={() => {}}
        />
        <SettingItem icon="shield" label="Privacy Policy" onPress={() => {}} />
      </View>

      {/* Sign Out Button */}
      <TouchableOpacity
        style={[styles.signOutButton, { backgroundColor: colors.error }]}
        onPress={handleSignOut}
      >
        <Feather
          name="log-out"
          size={18}
          color="#FFFFFF"
          style={styles.signOutIcon}
        />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 30,
  },
  profileHeader: {
    alignItems: "center",
    padding: 20,
    paddingTop: 20,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editImageButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  profileInfo: {
    alignItems: "center",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  editProfileButton: {
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
  },
  editProfileText: {
    fontSize: 16,
    fontWeight: "500",
  },
  section: {
    marginTop: 24,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "500",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  settingItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingIcon: {
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
  },
  signOutIcon: {
    marginRight: 8,
  },
  signOutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
