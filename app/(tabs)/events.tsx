import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { Event, Category } from '@/types/events';
import { MOCK_EVENTS, MOCK_CATEGORIES, getFeaturedEvents, getEventsByCategory } from '@/constants/MockData';
import CategoryButton from '@/components/events/CategoryButton';
import EventCard from '@/components/events/EventCard';
import FeaturedEventCard from '@/components/events/FeaturedEventCard';

export default function EventsScreen() {
  const { colors } = useTheme();
  const [events, setEvents] = useState<Event[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('Dhaka, 1212');

  useEffect(() => {
    // In a real app, we'd fetch from an API
    loadEvents();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      setEvents(getEventsByCategory(selectedCategory));
    } else {
      setEvents(MOCK_EVENTS);
    }
  }, [selectedCategory]);

  const loadEvents = () => {
    // Simulate API call
    setTimeout(() => {
      setEvents(MOCK_EVENTS);
      setFeaturedEvents(getFeaturedEvents());
      setCategories(MOCK_CATEGORIES);
      setIsRefreshing(false);
    }, 1000);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadEvents();
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
  };

  const filteredEvents = events.filter(event => {
    if (!searchQuery) return true;
    return event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           event.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <View>
          <Text style={[styles.welcomeText, { color: colors.textSecondary }]}>Hi! Welcome 👋</Text>
          <Text style={[styles.userName, { color: colors.text }]}>MD Rafi Islam</Text>
        </View>
        
        <View style={styles.locationContainer}>
          <Text style={[styles.locationLabel, { color: colors.textSecondary }]}>Current location</Text>
          <TouchableOpacity 
            style={styles.locationButton}
            onPress={() => router.push('/location-select')}
          >
            <Text style={[styles.locationText, { color: colors.text }]}>{currentLocation}</Text>
            <Feather name="chevron-down" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: colors.surfaceVariant }]}>
          <Feather name="search" size={20} color={colors.textSecondary} />
          <TextInput
            placeholder="Find amazing events"
            placeholderTextColor={colors.textSecondary}
            style={[styles.searchInput, { color: colors.text }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={[styles.filterButton, { backgroundColor: colors.surfaceVariant }]}>
          <Feather name="sliders" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

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
        {/* Featured Events Section */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Popular Events</Text>
            <Feather name="star" size={16} color="#FF6B35" />
          </View>
          <TouchableOpacity onPress={() => router.push('/events/featured')}>
            <Text style={[styles.viewAllText, { color: colors.primary }]}>VIEW ALL</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={featuredEvents}
          renderItem={({ item }) => <FeaturedEventCard event={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredListContainer}
          keyExtractor={(item) => `featured-${item.id}`}
        />
        
        {/* Categories Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Choose By Category</Text>
          <TouchableOpacity onPress={() => router.push('/events/categories')}>
            <Text style={[styles.viewAllText, { color: colors.primary }]}>VIEW ALL</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={categories.slice(0, 6)}
          renderItem={({ item }) => (
            <CategoryButton 
              category={item} 
              isSelected={selectedCategory === item.id}
              onPress={() => handleCategorySelect(item.id)}
              colors={colors}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesListContainer}
          keyExtractor={(item) => `category-${item.id}`}
        />
        
        {/* All Events / Filtered Events */}
        <View style={styles.eventsListContainer}>
          {filteredEvents.map((event) => (
            <View key={event.id} style={styles.eventCardWrapper}>
              <EventCard event={event} colors={colors} />
            </View>
          ))}
        </View>
      </ScrollView>
      
      {/* Floating Action Button */}
      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => router.push('/events/create')}
      >
        <Feather name="plus" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  welcomeText: {
    fontSize: 12,
    marginBottom: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
  },
  locationContainer: {
    alignItems: 'flex-end',
  },
  locationLabel: {
    fontSize: 10,
    marginBottom: 2,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    fontWeight: '500',
    marginRight: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    marginLeft: 10,
    paddingVertical: 8,
  },
  filterButton: {
    marginLeft: 10,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 6,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '500',
  },
  featuredListContainer: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  categoriesListContainer: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  eventsListContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    marginTop: 8,
  },
  eventCardWrapper: {
    width: '50%',
    padding: 4,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});