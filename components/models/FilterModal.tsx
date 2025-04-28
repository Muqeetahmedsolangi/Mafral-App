import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';

export interface FilterOptions {
  categories: string[];
  dateRange: {
    startDate: Date | null;
    endDate: Date | null;
  };
  price: {
    min: number;
    max: number;
  };
  location: string | null;
  distance: number | null;
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
  initialFilters?: FilterOptions;
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApplyFilters,
  initialFilters,
}) => {
  const { colors } = useTheme();
  
  // Default filter state
  const defaultFilters: FilterOptions = {
    categories: [],
    dateRange: {
      startDate: null,
      endDate: null,
    },
    price: {
      min: 0,
      max: 1000,
    },
    location: null,
    distance: 10, // Default distance in miles/km
  };
  
  // Filter state
  const [filters, setFilters] = useState<FilterOptions>(initialFilters || defaultFilters);
  
  // Category selection
  const categories = [
    { id: 'music', name: 'Music', icon: 'music' },
    { id: 'sports', name: 'Sports', icon: 'activity' },
    { id: 'food', name: 'Food & Drinks', icon: 'coffee' },
    { id: 'art', name: 'Arts & Culture', icon: 'feather' },
    { id: 'workshops', name: 'Workshops', icon: 'book' },
    { id: 'business', name: 'Business', icon: 'briefcase' },
    { id: 'outdoor', name: 'Outdoors', icon: 'compass' },
    { id: 'nightlife', name: 'Nightlife', icon: 'moon' },
  ];
  
  // Date options
  const dateOptions = [
    { id: 'today', name: 'Today' },
    { id: 'tomorrow', name: 'Tomorrow' },
    { id: 'this-week', name: 'This week' },
    { id: 'this-weekend', name: 'This weekend' },
    { id: 'next-week', name: 'Next week' },
    { id: 'next-month', name: 'Next month' },
  ];
  
  // Price options
  const priceOptions = [
    { id: 'free', name: 'Free', range: { min: 0, max: 0 } },
    { id: 'low', name: 'Under $25', range: { min: 0, max: 25 } },
    { id: 'medium', name: '$25 - $50', range: { min: 25, max: 50 } },
    { id: 'high', name: '$50 - $100', range: { min: 50, max: 100 } },
    { id: 'premium', name: '$100+', range: { min: 100, max: 1000 } },
  ];
  
  // Reset filters
  const resetFilters = () => {
    setFilters(defaultFilters);
  };
  
  // Apply filters
  const applyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  // Toggle category selection
  const toggleCategory = (categoryId: string) => {
    setFilters(prev => {
      const index = prev.categories.indexOf(categoryId);
      const newCategories = [...prev.categories];
      
      if (index === -1) {
        newCategories.push(categoryId);
      } else {
        newCategories.splice(index, 1);
      }
      
      return {
        ...prev,
        categories: newCategories,
      };
    });
  };
  
  // Set date range
  const setDateRange = (optionId: string) => {
    const now = new Date();
    let startDate: Date | null = new Date();
    let endDate: Date | null = null;
    
    switch (optionId) {
      case 'today':
        endDate = new Date(now.setHours(23, 59, 59, 999));
        break;
      case 'tomorrow':
        startDate = new Date(now);
        startDate.setDate(now.getDate() + 1);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'this-week':
        // Start: today, End: next Sunday
        const daysToSunday = 7 - now.getDay();
        endDate = new Date(now);
        endDate.setDate(now.getDate() + daysToSunday);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'this-weekend':
        // Start: next Saturday, End: next Sunday
        const daysToSaturday = (6 - now.getDay() + 7) % 7;
        startDate = new Date(now);
        startDate.setDate(now.getDate() + daysToSaturday);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 1);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'next-week':
        // Start: next Monday, End: next Sunday
        const daysToMonday = (1 - now.getDay() + 7) % 7 || 7;
        startDate = new Date(now);
        startDate.setDate(now.getDate() + daysToMonday);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'next-month':
        // Start: 1st of next month, End: last day of next month
        startDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 2, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      default:
        startDate = null;
        endDate = null;
    }
    
    setFilters(prev => ({
      ...prev,
      dateRange: { startDate, endDate },
    }));
  };
  
  // Set price range
  const setPrice = (range: { min: number, max: number }) => {
    setFilters(prev => ({
      ...prev,
      price: range,
    }));
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      
      <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={resetFilters}>
            <Text style={[styles.resetText, { color: colors.primary }]}>Reset</Text>
          </TouchableOpacity>
          
          <Text style={[styles.title, { color: colors.text }]}>Filter Events</Text>
          
          <TouchableOpacity onPress={onClose}>
            <Feather name="x" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Categories Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Categories</Text>
            <View style={styles.categoriesContainer}>
              {categories.map(category => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryItem,
                    filters.categories.includes(category.id) && [
                      styles.selectedCategory,
                      { backgroundColor: colors.primary + '20' },
                    ],
                  ]}
                  onPress={() => toggleCategory(category.id)}
                >
                  <Feather
                    name={category.icon as any}
                    size={18}
                    color={filters.categories.includes(category.id) ? colors.primary : colors.textSecondary}
                    style={styles.categoryIcon}
                  />
                  <Text
                    style={[
                      styles.categoryText,
                      {
                        color: filters.categories.includes(category.id)
                          ? colors.primary
                          : colors.text,
                      },
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {/* Date Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Date</Text>
            <View style={styles.optionsContainer}>
              {dateOptions.map(option => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.optionItem,
                    filters.dateRange.startDate &&
                    ((option.id === 'today' && isToday(filters.dateRange.startDate)) ||
                     (option.id === 'tomorrow' && isTomorrow(filters.dateRange.startDate)) ||
                     (option.id === 'this-week' && filters.dateRange.endDate && 
                      isThisWeek(filters.dateRange.startDate, filters.dateRange.endDate))) &&
                    [styles.selectedOption, { backgroundColor: colors.primary + '20' }],
                  ]}
                  onPress={() => setDateRange(option.id)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color:
                          filters.dateRange.startDate &&
                          ((option.id === 'today' && isToday(filters.dateRange.startDate)) ||
                           (option.id === 'tomorrow' && isTomorrow(filters.dateRange.startDate)))
                            ? colors.primary
                            : colors.text,
                      },
                    ]}
                  >
                    {option.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {/* Price Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Price</Text>
            <View style={styles.optionsContainer}>
              {priceOptions.map(option => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.optionItem,
                    filters.price.min === option.range.min && filters.price.max === option.range.max && [
                      styles.selectedOption,
                      { backgroundColor: colors.primary + '20' },
                    ],
                  ]}
                  onPress={() => setPrice(option.range)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color:
                          filters.price.min === option.range.min && filters.price.max === option.range.max
                            ? colors.primary
                            : colors.text,
                      },
                    ]}
                  >
                    {option.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.bottomSpacer} />
        </ScrollView>
        
        <View style={[styles.footer, { backgroundColor: colors.background }]}>
          <TouchableOpacity
            style={[styles.applyButton, { backgroundColor: colors.primary }]}
            onPress={applyFilters}
          >
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Helper functions for date checking
const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};

const isTomorrow = (date: Date): boolean => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear();
};

const isThisWeek = (startDate: Date, endDate: Date): boolean => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilEndOfWeek = 6 - dayOfWeek;
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + daysUntilEndOfWeek);
  endOfWeek.setHours(23, 59, 59, 999);
  
  return endDate <= endOfWeek;
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  resetText: {
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  selectedCategory: {
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryIcon: {
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  optionItem: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  selectedOption: {
    borderWidth: 1,
    borderColor: 'transparent',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 80,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  applyButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FilterModal;