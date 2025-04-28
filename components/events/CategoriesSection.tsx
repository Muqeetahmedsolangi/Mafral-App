import React from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { Category } from '@/types/events';
import CategoryButton from '@/components/events/CategoryButton';
import SectionHeader from '@/components/events/SectionHeader';
import { useTheme } from '@/context/ThemeContext';

interface CategoriesSectionProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onCategoryPress: (id: string) => void;
  onViewAllPress?: () => void;
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  categories,
  selectedCategoryId,
  onCategoryPress,
  onViewAllPress,
}) => {
  const { colors } = useTheme();
  
  return (
    <View style={styles.container}>
      <SectionHeader 
        title="Choose By Category" 
        onViewAllPress={onViewAllPress} 
      />
      
      <FlatList
        data={categories}
        renderItem={({ item }) => (
          <CategoryButton 
            category={item} 
            isSelected={selectedCategoryId === item.id}
            onPress={() => onCategoryPress(item.id)}
            colors={colors}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        keyExtractor={(item) => `category-${item.id}`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  listContainer: {
    paddingLeft: 16,
    paddingRight: 8,
  },
});

export default CategoriesSection;