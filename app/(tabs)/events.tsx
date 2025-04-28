import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { Event, Category } from '@/types/events';
import { 
  MOCK_EVENTS, 
  MOCK_CATEGORIES, 
  getFeaturedEvents, 
  getEventsByCategory 
} from '@/constants/MockData';

// Import components
import Header from '@/components/events/Header';
import SearchBar from '@/components/events/SearchBar';
import PopularEventsSection from '@/components/events/PopularEventsSection';
import CategoriesSection from '@/components/events/CategoriesSection';
import EventsList from '@/components/events/EventList';
import FloatingActionButton from '@/components/events/FloatingActionButton';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function EventsScreen() {
  const { colors } = useTheme();
  const [events, setEvents] = useState<Event[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('Dhaka, 1202');

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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredEvents = events.filter(event => {
    if (!searchQuery) return true;
    return event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           event.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header with dark background */}
      <Header 
        userName="MD Rafi Islam" 
        currentLocation={currentLocation} 
        onLocationPress={() => router.push('/location-select')} 
        avatarUrl="https://randomuser.me/api/portraits/men/32.jpg"
      />
      
      <SafeAreaView style={[styles.contentContainer, { backgroundColor: colors.background }]}>
        <SearchBar 
          value={searchQuery} 
          onChangeText={handleSearch} 
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
          <PopularEventsSection 
            events={featuredEvents} 
            onViewAllPress={() => router.push('/events/featured')}
          />
          
          <CategoriesSection 
            categories={categories.slice(0, 6)} 
            selectedCategoryId={selectedCategory}
            onCategoryPress={handleCategorySelect}
            onViewAllPress={() => router.push('/events/categories')}
          />
          
          <EventsList events={filteredEvents} />
        </ScrollView>
        
        <FloatingActionButton onPress={() => router.push('/events/create')} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  }
});