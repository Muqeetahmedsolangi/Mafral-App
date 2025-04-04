// components/ui/Avatar.tsx
import React from 'react';
import { View, Image, StyleSheet, ViewStyle, ImageSourcePropType } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { InstagramGradient } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

type AvatarProps = {
  source: ImageSourcePropType;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  hasStory?: boolean;
  storyViewed?: boolean;
  style?: ViewStyle;
};

export function Avatar({ 
  source, 
  size = 'medium', 
  hasStory = false,
  storyViewed = false, 
  style 
}: AvatarProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Instagram-accurate size mapping
  const sizeMap = {
    small: 32,
    medium: 44,
    large: 64,
    xlarge: 88,
  };
  
  const avatarSize = sizeMap[size];
  const borderSize = avatarSize + 6; // Border width for story ring
  
  return (
    <View style={[styles.container, style]}>
      {hasStory ? (
        <LinearGradient
          colors={storyViewed ? 
            [isDark ? '#333333' : '#DBDBDB', isDark ? '#333333' : '#DBDBDB'] as [string, string] : 
            InstagramGradient as [string, string]}
          start={{ x: 0.0, y: 1.0 }}
          end={{ x: 1.0, y: 1.0 }}
          style={[
            styles.storyRing,
            { width: borderSize, height: borderSize, borderRadius: borderSize / 2 }
          ]}
        >
          <View 
            style={[
              styles.avatarBorder,
              { 
                width: avatarSize + 3, 
                height: avatarSize + 3, 
                borderRadius: (avatarSize + 3) / 2, 
                backgroundColor: isDark ? '#000' : '#fff' 
              }
            ]}
          >
            <Image 
              source={source} 
              style={[
                styles.avatar, 
                { 
                  width: avatarSize, 
                  height: avatarSize, 
                  borderRadius: avatarSize / 2 
                }
              ]} 
              resizeMode="cover"
            />
          </View>
        </LinearGradient>
      ) : (
        <Image 
          source={source} 
          style={[
            styles.avatar, 
            { 
              width: avatarSize, 
              height: avatarSize, 
              borderRadius: avatarSize / 2 
            }
          ]} 
          resizeMode="cover"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    backgroundColor: '#EFEFEF', // Default background for image loading
  },
  storyRing: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2, // Ensures the gradient has some thickness
  },
  avatarBorder: {
    alignItems: 'center',
    justifyContent: 'center',
  }
});