import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';

interface HeaderProps {
  userName: string;
  currentLocation: string;
  onLocationPress: () => void;
  avatarUrl?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  userName, 
  currentLocation, 
  onLocationPress,
  avatarUrl
}) => {
  const { colors, isDarkMode  } = useTheme();
  
  // Use consistent background color based on theme
  const headerBgColor = isDarkMode ? colors.card : '#F76B10';
    
  return (
    <View style={[
      styles.header, 
      { backgroundColor: headerBgColor }
    ]}>
      <View style={styles.leftSection}>
        <Image 
          source={{ 
            uri: avatarUrl || 'https://randomuser.me/api/portraits/men/32.jpg' 
          }} 
          style={styles.avatar} 
        />
        <View style={styles.userInfoContainer}>
          <Text style={styles.welcomeText}>
            Hi! Welcome <Text style={{color: '#FFD700'}}>👋</Text>
          </Text>
          <Text style={styles.userName}>
            {userName} <Text style={{color: '#FFD700'}}>🔥</Text>
          </Text>
        </View>
      </View>
      
      <View style={styles.locationContainer}>
        <Text style={styles.locationLabel}>
          Current location
        </Text>
        <TouchableOpacity 
          style={styles.locationButton}
          onPress={onLocationPress}
        >
          <Text style={styles.locationText}>
            {currentLocation} <Text style={styles.locationEmoji}>📍</Text>
          </Text>
          <Feather name="chevron-down" size={14} color="#FFFFFF" style={{marginLeft: 2}} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    // Background color now set dynamically in the component
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userInfoContainer: {
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 2,
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  locationContainer: {
    alignItems: 'flex-end',
  },
  locationLabel: {
    fontSize: 10,
    color: '#FFFFFF',
    opacity: 0.7,
    marginBottom: 2,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  locationEmoji: {
    color: '#FF6B00',
  }
});

export default Header;