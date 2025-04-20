import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { MOCK_CATEGORIES, getEventsByCategory } from '@/constants/MockData';
import EventCard from '@/components/events/EventCard';
import { Feather } from '@expo/vector-icons';

export default function CategoryEventsScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams();
  const category = MOCK_CATEGORIES.find(cat => cat.id === id);
  const events = getEventsByCategory(id as string);

  if (!category) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Category not found</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: category.name + " Events",
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
        }} 
      />
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <FlatList
          data={events}
          renderItem={({ item }) => (
            <View style={styles.cardContainer}>
              <EventCard event={item} colors={colors} />
            </View>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          numColumns={2}
          ListHeaderComponent={() => (
            <View style={[styles.header, { backgroundColor: category.color + '20' }]}>
              <View style={[styles.iconContainer, { backgroundColor: category.color }]}>
                <Feather name={category.icon as keyof typeof Feather.glyphMap} size={24} color="#FFFFFF" />
              </View>
              <Text style={[styles.headerTitle, { color: colors.text }]}>
                {category.name} Events
              </Text>
              <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                {events.length} events available
              </Text>
            </View>
          )}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  cardContainer: {
    flex: 1,
    padding: 4,
  },
});