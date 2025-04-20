import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { format, parseISO } from 'date-fns';
import { router } from 'expo-router';
import { Event } from '@/types/events';

const { width } = Dimensions.get('window');

interface FeaturedEventCardProps {
  event: Event;
  onPress?: () => void;
}

const FeaturedEventCard: React.FC<FeaturedEventCardProps> = ({ event, onPress }) => {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/events/${event.id}`);
    }
  };

  const startDate = parseISO(event.date.start);
  const formattedDate = format(startDate, 'MMM d');

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <Image source={{ uri: event.coverImage }} style={styles.image} />
      <LinearGradient
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
        style={styles.gradient}
      />
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{event.title}</Text>
        
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Feather name="calendar" size={14} color="#FFFFFF" />
            <Text style={styles.metaText}>{formattedDate}</Text>
          </View>
          
          <View style={styles.metaItem}>
            <Feather name="map-pin" size={14} color="#FFFFFF" />
            <Text style={styles.metaText} numberOfLines={1}>
              {event.location.city}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.joinButton}
          onPress={handlePress}
        >
          <Text style={styles.joinButtonText}>JOIN NOW</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 280,
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 12,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '70%',
  },
  content: {
    position: 'absolute',
    bottom: 10,
    left: 12,
    right: 12,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginLeft: 4,
  },
  joinButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  joinButtonText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default FeaturedEventCard;