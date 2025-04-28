import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';

interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (id: string) => void;
  showAllOption?: boolean;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  showAllOption = true,
}) => {
  const { colors } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {showAllOption && (
        <TouchableOpacity
          style={[
            styles.categoryPill,
            {
              backgroundColor: selectedCategoryId === null 
                ? colors.primary 
                : colors.surfaceVariant,
            },
          ]}
          onPress={() => onSelectCategory('')}
        >
          <Text
            style={[
              styles.categoryText,
              {
                color: selectedCategoryId === null 
                  ? '#FFFFFF' 
                  : colors.textSecondary,
              },
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
      )}

      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.categoryPill,
            {
              backgroundColor: selectedCategoryId === category.id 
                ? category.color 
                : colors.surfaceVariant,
              marginLeft: 8,
            },
          ]}
          onPress={() => onSelectCategory(category.id)}
        >
          <Feather 
            name={category.icon as keyof typeof Feather.glyphMap} 
            size={14} 
            color={selectedCategoryId === category.id ? '#FFFFFF' : category.color} 
            style={styles.categoryIcon}
          />
          <Text
            style={[
              styles.categoryText,
              {
                color: selectedCategoryId === category.id 
                  ? '#FFFFFF' 
                  : colors.text,
              },
            ]}
          >
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryIcon: {
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default CategoryFilter;