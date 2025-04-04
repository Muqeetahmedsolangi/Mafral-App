// app/(tabs)/profile.tsx
import React, { memo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { H3, H4, Body1, Body2, Body3, Caption1 } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { globalStyles } from '@/app/styles/globalStyles';

interface SettingItemProps {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
}

// Memoized setting item component for better performance
const SettingItem = memo(({ icon, label, onPress }: SettingItemProps) => {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity 
      style={styles.settingItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon}
      <Body1 style={[styles.settingText]}>{label}</Body1>
      <View style={{ flex: 1 }} />
      <Feather name="chevron-right" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );
});

// Theme toggle component
const ThemeToggle = () => {
  const { isDarkMode, toggleTheme, colors } = useTheme();
  
  return (
    <View style={styles.settingItem}>
      <MaterialIcons 
        name={isDarkMode ? "dark-mode" : "light-mode"} 
        size={24} 
        color={colors.text} 
      />
      <Body1 style={styles.settingText}>
        {isDarkMode ? "Dark Mode" : "Light Mode"}
      </Body1>
      <View style={{ flex: 1 }} />
      <Switch
        value={isDarkMode}
        onValueChange={toggleTheme}
        thumbColor={isDarkMode ? colors.primary : "#FFFFFF"}
        trackColor={{ false: "#767577", true: "rgba(255, 120, 0, 0.4)" }}
        ios_backgroundColor="#cccccc"
      />
    </View>
  );
};

export default function ProfileScreen() {
  const { colors, isDarkMode, toggleTheme } = useTheme();
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <H3>Profile</H3>
        <TouchableOpacity style={styles.menuButton}>
          <Feather name="menu" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.profileInfo}>
        <View style={styles.profileImageContainer}>
          <View style={[styles.profileImage, { backgroundColor: isDarkMode ? '#333' : '#eee' }]}>
            <MaterialIcons name="person" size={40} color={isDarkMode ? '#666' : '#999'} />
          </View>
        </View>
        
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <H4>0</H4>
            <Caption1>Posts</Caption1>
          </View>
          <View style={styles.statItem}>
            <H4>0</H4>
            <Caption1>Followers</Caption1>
          </View>
          <View style={styles.statItem}>
            <H4>0</H4>
            <Caption1>Following</Caption1>
          </View>
        </View>
      </View>
      
      <View style={styles.bioContainer}>
        <Body2 style={{ fontWeight: '600' }}>Username</Body2>
        <Body3>React Native Developer</Body3>
      </View>
      
      <Button 
        title="Edit Profile"
        variant="outline"
        size="medium"
        onPress={() => {}}
        style={styles.editButton}
      />
      
      <Card
        variant="filled"
        style={styles.settingsCard}
      >
        <H4 style={styles.settingsTitle}>Settings</H4>
        
        <ThemeToggle />
        
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        
        <SettingItem 
          icon={<Ionicons name="notifications-outline" size={24} color={colors.text} />}
          label="Notifications"
          onPress={() => {}}
        />
        
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        
        <SettingItem 
          icon={<Feather name="lock" size={24} color={colors.text} />}
          label="Privacy"
          onPress={() => {}}
        />
        
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        
        <SettingItem 
          icon={<Feather name="help-circle" size={24} color={colors.text} />}
          label="Help"
          onPress={() => {}}
        />
        
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        
        <SettingItem 
          icon={<Ionicons name="information-circle-outline" size={24} color={colors.text} />}
          label="About"
          onPress={() => {}}
        />
      </Card>
      
      <Card
        variant="filled"
        style={styles.helpCard}
      >
        <H4 style={styles.helpTitle}>Need help?</H4>
        <Body2 style={styles.helpText}>
          Contact our support team for any assistance with your account.
        </Body2>
        <Button
          title="Contact Support"
          variant="primary"
          size="small"
          onPress={() => {}}
          style={styles.helpButton}
        />
      </Card>
      
      <View style={styles.footer}>
        <Caption1 style={{ color: colors.textMuted }}>
          Version 1.0.0
        </Caption1>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  menuButton: {
    padding: 4,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  profileImageContainer: {
    marginRight: 24,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stats: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  bioContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  editButton: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  settingsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  settingsTitle: {
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  settingText: {
    marginLeft: 12,
  },
  divider: {
    height: 1,
    width: '100%',
  },
  helpCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
  },
  helpTitle: {
    marginBottom: 8,
  },
  helpText: {
    marginBottom: 16,
  },
  helpButton: {
    alignSelf: 'flex-start',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 40,
  },
});