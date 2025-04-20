import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { MOCK_CATEGORIES } from '@/constants/MockData';

export default function CategoriesScreen() {
  const { colors } = useTheme();

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
    <>
      <Stack.Screen options={{ title: "Event Categories" }} />
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <FlatList
          data={MOCK_CATEGORIES}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.list}
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
  categoryCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingVertical: 24,
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
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
  },
});