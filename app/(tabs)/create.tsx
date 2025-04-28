// app/(tabs)/create.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { H3, Body1, Body2 } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { router } from 'expo-router';

interface CreateOptionProps {
  icon: React.ReactNode;
  title: string;
  onPress: () => void;
}

const CreateOption = ({ icon, title, onPress }: CreateOptionProps) => {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity
      style={styles.optionItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon}
      <Body1 style={styles.optionText}>{title}</Body1>
      <View style={{ flex: 1 }} />
      <Feather name="chevron-right" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );
};

export default function CreateScreen() {
  const { colors } = useTheme();
  
  const navigateToCreatePost = () => {
    // Navigate to create post flow
    router.push('/create/post');
  };
  
  const navigateToCreateReel = () => {
    // Navigate to create reel flow
    router.push('/create/reel');
  };
  
  const navigateToCreateStory = () => {
    // Navigate to create story flow
    router.push('/create/story');
  };
  
  const navigateToCreateMessage = () => {
    // Navigate to create message flow
    router.push('/create/message');
  };
  
  const navigateToCreateEvent = () => {
    // Navigate to create event flow
    router.push('/events/create');
  };
  
  const navigateToCreateRestaurant = () => {
    // Navigate to create restaurant flow
    router.push('/restaurants/create');
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <H3>Create</H3>
      </View>
      
      <Card variant="filled" style={styles.optionsCard}>
        <CreateOption
          icon={<Feather name="image" size={24} color={colors.text} />}
          title="Post"
          onPress={navigateToCreatePost}
        />
        
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        
        <CreateOption
          icon={<MaterialCommunityIcons name="movie-outline" size={24} color={colors.text} />}
          title="Reel"
          onPress={navigateToCreateReel}
        />
        
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        
        <CreateOption
          icon={<Feather name="camera" size={24} color={colors.text} />}
          title="Story"
          onPress={navigateToCreateStory}
        />
        
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        
        <CreateOption
          icon={<Feather name="message-circle" size={24} color={colors.text} />}
          title="Message"
          onPress={navigateToCreateMessage}
        />
      </Card>
      
      <H3 style={styles.businessHeader}>Business</H3>
      
      <Card variant="filled" style={styles.optionsCard}>
        <CreateOption
          icon={<Feather name="calendar" size={24} color={colors.text} />}
          title="Event"
          onPress={navigateToCreateEvent}
        />
        
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        
        <CreateOption
          icon={<FontAwesome5 name="utensils" size={22} color={colors.text} />}
          title="Restaurant"
          onPress={navigateToCreateRestaurant}
        />
      </Card>
      
      <Button
        title="Create New Post"
        variant="primary"
        size="medium"
        icon={<Feather name="plus" size={18} color="#FFF" style={{ marginRight: 8 }} />}
        iconPosition="left"
        onPress={navigateToCreatePost}
        style={styles.createButton}
      />
      
      <Card style={styles.tipsCard}>
        <View style={styles.tipsHeader}>
          <Feather name="info" size={20} color={colors.info} />
          <Body1 style={[styles.tipsTitle, { color: colors.info }]}>Business Tips</Body1>
        </View>
        <Body2 style={styles.tipText}>Create a complete profile with all your business details.</Body2>
        <Body2 style={styles.tipText}>Showcase your best products with professional images.</Body2>
        <Body2 style={styles.tipText}>Regularly update your listings to keep customers informed.</Body2>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginTop: 50,
    marginBottom: 24,
  },
  businessHeader: {
    marginTop: 24,
    marginBottom: 16,
  },
  optionsCard: {
    marginBottom: 24,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  optionText: {
    marginLeft: 16,
  },
  divider: {
    height: 1,
    width: '100%',
  },
  createButton: {
    marginBottom: 24,
  },
  tipsCard: {
    marginBottom: 16,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipsTitle: {
    marginLeft: 8,
    fontWeight: '600',
  },
  tipText: {
    marginBottom: 8,
  },
});