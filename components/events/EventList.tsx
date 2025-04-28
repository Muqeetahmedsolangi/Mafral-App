import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Event } from '@/types/events';
import EventCard from '@/components/events/EventCard';
import { useTheme } from '@/context/ThemeContext';

interface EventsListProps {
  events: Event[];
}

const EventsList: React.FC<EventsListProps> = ({ events }) => {
  const { colors } = useTheme();
  
  return (
    <View style={styles.container}>
      {events.map((event) => (
        <View key={event.id} style={styles.eventCardWrapper}>
          <EventCard event={event} colors={colors} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    marginTop: 8,
    paddingBottom: 80, // Add space for FAB
  },
  eventCardWrapper: {
    width: '50%',
    padding: 4,
  },
});

export default EventsList;