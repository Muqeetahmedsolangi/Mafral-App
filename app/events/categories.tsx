import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { MOCK_CATEGORIES } from '@/constants/MockData';
import SearchBar from '@/components/events/SearchBar';
import EnhancedSearchBar from '@/components/events/EnhancedSearchBar';

export default function CategoriesScreen() {
  const { colors, isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCategories, setFilteredCategories] = useState(MOCK_CATEGORIES);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredCategories(MOCK_CATEGORIES);
    } else {
      const filtered = MOCK_CATEGORIES.filter(category => 
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [searchQuery]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const renderCategory = ({ item, index }: { item: { id: string; name: string; color: string; icon: string }; index: number }) => {
    return (
      <TouchableOpacity
        style={[
          styles.categoryCard,
          { backgroundColor: item.color + '20' },
          index % 2 === 0 ? { marginRight: 8 } : { marginLeft: 8 }
        ]}
        onPress={() => router.push(`/events/category/${item.id}`)}
      >
        <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
          <Feather name={item.icon as keyof typeof Feather.glyphMap} size={24} color="#FFFFFF" />
        </View>
        <Text style={[styles.categoryName, { color: item.color }]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      
      <Stack.Screen 
        options={{
          headerTitle: "Event Categories",
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTitleStyle: { 
            color: colors.text,
            fontSize: 18,
            fontWeight: '600',
          },
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Feather name="arrow-left" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <View style={styles.searchContainer}>
        <SearchBar 
          value={searchQuery} 
          onChangeText={handleSearch} 
        />
      </View>
      
      <View style={styles.contentContainer}>
        {filteredCategories.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Feather name="search" size={40} color={colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No categories found
            </Text>
            <Text style={[styles.emptyMessage, { color: colors.textSecondary }]}>
              Try a different search term
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredCategories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            initialNumToRender={8}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 20,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  contentContainer: {
    flex: 1,
  },
  list: {
    padding: 16,
    paddingTop: 8,
  },
  categoryCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingVertical: 24,
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    textAlign: 'center',
  },
});