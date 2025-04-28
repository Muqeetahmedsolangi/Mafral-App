import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { Restaurant, RestaurantCategory } from '@/types/restaurant';
import { 
  MOCK_RESTAURANTS, 
  RESTAURANT_CATEGORIES,
  getRestaurantsByCategory,
} from '@/constants/restaurantMockData';

// Import Components
import SearchBar from '@/components/restaurants/UI/SearchBar';
import RestaurantCard from '@/components/restaurants/UI/RestaurantCard';
import RestaurantList from '@/components/restaurants/UI/RestaurantList';
import FeaturedRestaurantCarousel from '@/components/restaurants/UI/FeaturedRestaurantCarousel';
import CategorySelector from '@/components/restaurants/UI/CategorySelector';
import FloatingActionButton from '@/components/common/FloatingActionButton';

export default function RestaurantsScreen() {
  const { colors } = useTheme();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [featuredRestaurants, setFeaturedRestaurants] = useState<Restaurant[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<RestaurantCategory>('All');
  const [currentLocation, setCurrentLocation] = useState('Dhaka, 1202');

  useEffect(() => {
    // In a real app, we'd fetch from an API
    loadRestaurants();
  }, []);

  useEffect(() => {
    setRestaurants(getRestaurantsByCategory(selectedCategory));
  }, [selectedCategory]);

  const loadRestaurants = () => {
    // Simulate API call
    setTimeout(() => {
      setRestaurants(MOCK_RESTAURANTS);
      setFeaturedRestaurants(MOCK_RESTAURANTS.filter(r => r.isPromoted));
      setIsRefreshing(false);
    }, 1000);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadRestaurants();
  };

  const handleCategorySelect = (category: RestaurantCategory) => {
    setSelectedCategory(category);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredRestaurants = restaurants.filter(restaurant => {
    if (!searchQuery) return true;
    return restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           restaurant.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
           restaurant.cuisineTypes.some(cuisine => 
             cuisine.toLowerCase().includes(searchQuery.toLowerCase())
           );
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.locationButton}
            onPress={() => router.push('/location-select')}
          >
            <Feather name="map-pin" size={16} color={colors.primary} />
            <Text style={[styles.locationText, { color: colors.text }]}>
              {currentLocation}
            </Text>
            <Feather name="chevron-down" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.avatarButton, { backgroundColor: colors.secondary.blue }]}
            onPress={() => router.push('/profile')}
          >
            <Image 
              source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>
        
        <Text style={[styles.welcomeText, { color: colors.textSecondary }]}>
          Find and discover
        </Text>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Restaurants Near You
        </Text>
      </View>
      
      <SafeAreaView style={[styles.contentContainer, { backgroundColor: colors.background }]}>
        <SearchBar 
          value={searchQuery} 
          onChangeText={handleSearch}
          placeholder="Search restaurants, cuisines..."
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
            />
          }
        >
          {/* Featured Restaurants Carousel */}
          <FeaturedRestaurantCarousel restaurants={featuredRestaurants} />
          
          {/* Category Selector */}
          <CategorySelector 
            categories={RESTAURANT_CATEGORIES}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
          
          {/* Restaurant List */}
          <View style={styles.listHeaderContainer}>
            <Text style={[styles.listHeaderTitle, { color: colors.text }]}>
              {selectedCategory} Restaurants
            </Text>
            <TouchableOpacity onPress={() => router.push('/restaurants')}>
              <Text style={[styles.viewAllText, { color: colors.primary }]}>
                View All
              </Text>
            </TouchableOpacity>
          </View>
          
          <RestaurantList restaurants={filteredRestaurants} />
          
          <View style={styles.spacer} />
        </ScrollView>
        
        <FloatingActionButton 
          icon="plus"
          onPress={() => router.push('/restaurants/create')}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 5,
  },
  avatarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  welcomeText: {
    fontSize: 16,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  contentContainer: {
    flex: 1,
  },
  listHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  listHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  spacer: {
    height: 80,
  },
});