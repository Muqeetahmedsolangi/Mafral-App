import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { format, parseISO } from 'date-fns';
import { router } from 'expo-router';
import { Event } from '@/types/events';

interface EventCardProps {
  event: Event;
  onPress?: () => void;
  colors: any;
  style?: any;
}

const EventCard: React.FC<EventCardProps> = ({ event, onPress, colors, style }) => {
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
      style={[
        styles.container, 
        { backgroundColor: colors.card },
        style
      ]}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <Image source={{ uri: event.coverImage }} style={styles.image} />
      <LinearGradient
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
        style={styles.gradient}
      />
      
      <View style={styles.dateTag}>
        <Text style={styles.dateText}>{formattedDate}</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {event.title}
        </Text>
        
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Feather name="map-pin" size={12} color={colors.textSecondary} />
            <Text style={[styles.detailText, { color: colors.textSecondary }]} numberOfLines={1}>
              {event.location.name}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Feather name="users" size={12} color={colors.textSecondary} />
            <Text style={[styles.detailText, { color: colors.textSecondary }]}>
              {event.attendees} attending
            </Text>
          </View>
        </View>
        
        <View style={styles.priceContainer}>
          {event.isFree || event.tickets[0]?.price === 0 ? (
            <Text style={[styles.price, { color: colors.success }]}>Free</Text>
          ) : (
            <Text style={[styles.price, { color: colors.primary }]}>
              {event.tickets[0]?.currency} {event.tickets[0]?.price}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    width: '100%',
  },
  image: {
    width: '100%',
    height: 130,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
  },
  content: {
    padding: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  details: {
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  detailText: {
    fontSize: 12,
    marginLeft: 4,
  },
  priceContainer: {
    marginTop: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
  },
  dateTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  dateText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '600',
  },
});

export default EventCard;