import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Restaurant } from '@/types/restaurant';
import RestaurantCard from '@/components/restaurants/UI/RestaurantCard';

interface RestaurantListProps {
  restaurants: Restaurant[];
  listType?: 'grid' | 'list';
}

const RestaurantList: React.FC<RestaurantListProps> = ({ 
  restaurants,
  listType = 'grid'
}) => {
  if (listType === 'list') {
    return (
      <View style={styles.listContainer}>
        {restaurants.map(restaurant => (
          <View key={restaurant.id} style={styles.listItem}>
            <RestaurantCard restaurants={[restaurant]} />
          </View>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.gridContainer}>
      {restaurants.map((restaurant) => (
        <View key={restaurant.id} style={styles.gridItem}>
          <RestaurantCard restaurants={[restaurant]} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  gridItem: {
    width: '48%',
    marginBottom: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  listItem: {
    marginBottom: 16,
  }
});

export default RestaurantList;