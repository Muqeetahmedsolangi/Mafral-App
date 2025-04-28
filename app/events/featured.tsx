import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Event } from '@/types/events';
import { getFeaturedEvents } from '@/constants/MockData';

// Import components
import EventCard from '@/components/events/EventCard';
import FilterModal, { FilterOptions } from '@/components/models/FilterModal';
import SearchBar from '@/components/events/SearchBar';

export default function FeaturedEventsScreen() {
  const { colors } = useTheme();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterOptions | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);
  
  useEffect(() => {
    // Apply search filtering
    if (!searchQuery) {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter(event => 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEvents(filtered);
    }
  }, [searchQuery, events]);
  
  const loadEvents = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const featuredEvents = getFeaturedEvents();
      setEvents(featuredEvents);
      setFilteredEvents(featuredEvents);
      setIsLoading(false);
      setIsRefreshing(false);
    }, 1000);
  };
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    loadEvents();
  };
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleFilterPress = () => {
    setFilterModalVisible(true);
  };
  
  const applyFilters = (filters: FilterOptions) => {
    setActiveFilters(filters);
    
    // Filter events based on categories, dates, and prices
    let filtered = [...events];
    
    // Filter by category if any are selected
    if (filters.categories.length > 0) {
      filtered = filtered.filter(event => 
        filters.categories.includes(event.category.id)
      );
    }
    
    // Filter by date range if both dates are selected
    if (filters.dateRange.startDate && filters.dateRange.endDate) {
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date.start);
        return eventDate >= filters.dateRange.startDate! && 
               eventDate <= filters.dateRange.endDate!;
      });
    }
    
    // Filter by price
    filtered = filtered.filter(event => {
      // If the event has tickets with prices
      if (event.tickets && event.tickets.length > 0) {
        const lowestPrice = Math.min(...event.tickets.map(ticket => ticket.price));
        return lowestPrice >= filters.price.min && lowestPrice <= filters.price.max;
      }
      // If no price info, assume it's free
      return filters.price.min <= 0;
    });
    
    // Apply search filter on top if needed
    if (searchQuery) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredEvents(filtered);
  };
  
  const renderEventItem = ({ item }: { item: Event }) => (
    <View style={styles.eventCardWrapper}>
      <EventCard event={item} colors={colors} />
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" />
      
      <Stack.Screen
        options={{
          headerTitle: 'Popular Events',
          headerTitleStyle: { color: colors.text },
          headerLeft: () => (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Feather name="arrow-left" size={22} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <View style={styles.searchContainer}>
        <SearchBar 
          value={searchQuery} 
          onChangeText={handleSearch}
          onFilterPress={handleFilterPress}
        />
        
        {activeFilters && (
          <View style={styles.activeFiltersContainer}>
            <Text style={[styles.activeFiltersText, { color: colors.textSecondary }]}>
              Active filters:
            </Text>
            {activeFilters.categories.length > 0 && (
              <View style={[styles.filterChip, { backgroundColor: colors.primary + '20' }]}>
                <Text style={[styles.filterChipText, { color: colors.primary }]}>
                  {activeFilters.categories.length} categories
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    const newFilters = { ...activeFilters, categories: [] };
                    setActiveFilters(newFilters);
                    applyFilters(newFilters);
                  }}
                >
                  <Feather name="x" size={14} color={colors.primary} />
                </TouchableOpacity>
              </View>
            )}
            
            {activeFilters.dateRange.startDate && (
              <View style={[styles.filterChip, { backgroundColor: colors.primary + '20' }]}>
                <Text style={[styles.filterChipText, { color: colors.primary }]}>
                  Date filter
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    const newFilters = {
                      ...activeFilters,
                      dateRange: { startDate: null, endDate: null },
                    };
                    setActiveFilters(newFilters);
                    applyFilters(newFilters);
                  }}
                >
                  <Feather name="x" size={14} color={colors.primary} />
                </TouchableOpacity>
              </View>
            )}
            
            {(activeFilters.price.min > 0 || activeFilters.price.max < 1000) && (
              <View style={[styles.filterChip, { backgroundColor: colors.primary + '20' }]}>
                <Text style={[styles.filterChipText, { color: colors.primary }]}>
                  Price filter
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    const newFilters = {
                      ...activeFilters,
                      price: { min: 0, max: 1000 },
                    };
                    setActiveFilters(newFilters);
                    applyFilters(newFilters);
                  }}
                >
                  <Feather name="x" size={14} color={colors.primary} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredEvents}
          renderItem={renderEventItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="search" size={40} color={colors.textSecondary} style={styles.emptyIcon} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                No events found
              </Text>
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                Try adjusting your filters or search criteria
              </Text>
            </View>
          }
        />
      )}
      
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApplyFilters={applyFilters}
        initialFilters={activeFilters || undefined}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    marginLeft: 10,
    padding: 8,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  activeFiltersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 8,
    marginBottom: 4,
  },
  activeFiltersText: {
    fontSize: 12,
    marginRight: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '500',
    marginRight: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 8,
  },
  eventCardWrapper: {
    width: '50%',
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyIcon: {
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});