import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { router } from 'expo-router';
import { Event } from '@/types/events';

interface EventCardProps {
  event: Event;
  colors: any;
}

const EventCard: React.FC<EventCardProps> = ({ event, colors }) => {
  const handlePress = () => {
    router.push(`/events/${event.id}`);
  };

  const startDate = parseISO(event.date.start);
  const formattedDate = format(startDate, 'MMM d');

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors.surfaceVariant }]} 
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {/* Event Image */}
      <Image source={{ uri: event.coverImage }} style={styles.image} />
      
      {/* Category Badge */}
      <View 
        style={[styles.categoryBadge, { backgroundColor: event.category.color + '30' }]}
      >
        <Text style={[styles.categoryText, { color: event.category.color }]}>
          {event.category.name}
        </Text>
      </View>
      
      {/* Event Details */}
      <View style={styles.detailsContainer}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {event.title}
        </Text>
        
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Feather name="calendar" size={12} color={colors.textSecondary} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>
              {formattedDate}
            </Text>
          </View>
          
          <View style={styles.metaItem}>
            <Feather name="map-pin" size={12} color={colors.textSecondary} />
            <Text 
              style={[styles.metaText, { color: colors.textSecondary }]} 
              numberOfLines={1}
            >
              {event.location.city}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 110,
  },
  categoryBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
  },
  detailsContainer: {
    padding: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  metaContainer: {
    flexDirection: 'row',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  metaText: {
    fontSize: 11,
    marginLeft: 4,
  },
});

export default EventCard;