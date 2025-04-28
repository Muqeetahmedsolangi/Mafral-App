import React from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { Event } from '@/types/events';
import FeaturedEventCard from '@/components/events/FeaturedEventCard';
import SectionHeader from '@/components/events/SectionHeader';

interface PopularEventsSectionProps {
  events: Event[];
  onViewAllPress?: () => void;
}

const PopularEventsSection: React.FC<PopularEventsSectionProps> = ({ 
  events, 
  onViewAllPress
}) => {
  return (
    <View style={styles.container}>
      <SectionHeader 
        title="Popular Events" 
        iconName="star" 
        iconColor="#FF6B35"
        onViewAllPress={onViewAllPress} 
      />
      
      <FlatList
        data={events}
        renderItem={({ item }) => <FeaturedEventCard event={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        keyExtractor={(item) => `featured-${item.id}`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  listContainer: {
    paddingLeft: 16,
    paddingRight: 8,
  },
});

export default PopularEventsSection;