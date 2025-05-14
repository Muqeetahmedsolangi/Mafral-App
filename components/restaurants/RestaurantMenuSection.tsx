import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  FlatList,
  ScrollView 
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { MenuCategory, MenuItem } from '@/types/restaurant';

interface RestaurantMenuSectionProps {
  menu: {
    categories: MenuCategory[];
    items: MenuItem[];
  };
}

const RestaurantMenuSection: React.FC<RestaurantMenuSectionProps> = ({ menu }) => {
  const { colors } = useTheme();
  const [activeCategory, setActiveCategory] = useState<string | null>(
    menu.categories.length > 0 ? menu.categories[0].id : null
  );

  const filteredItems = activeCategory 
    ? menu.items.filter(item => item.categoryId === activeCategory) 
    : menu.items;

  return (
    <View style={styles.container}>
      {/* Category Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {menu.categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryTab,
              activeCategory === category.id && { 
                backgroundColor: colors.primary,
                borderColor: colors.primary 
              },
              activeCategory !== category.id && { 
                backgroundColor: colors.card,
                borderColor: colors.border 
              }
            ]}
            onPress={() => setActiveCategory(category.id)}
          >
            <Text 
              style={[
                styles.categoryName,
                { color: activeCategory === category.id ? 'white' : colors.text }
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Menu Items */}
      <View style={styles.menuItemsContainer}>
        {filteredItems.length === 0 && (
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No items in this category
          </Text>
        )}
        
        {filteredItems.map(item => (
          <View 
            key={item.id} 
            style={[
              styles.menuItem, 
              { backgroundColor: colors.card, borderColor: colors.border }
            ]}
          >
            <View style={styles.menuItemContent}>
              <View style={styles.menuItemInfo}>
                <View style={styles.menuItemHeader}>
                  <Text style={[styles.menuItemName, { color: colors.text }]}>
                    {item.name}
                  </Text>
                  <Text style={[styles.menuItemPrice, { color: colors.primary }]}>
                    ${item.price.toFixed(2)}
                  </Text>
                </View>
                
                <Text 
                  style={[styles.menuItemDescription, { color: colors.textSecondary }]}
                  numberOfLines={2}
                >
                  {item.description}
                </Text>
                
                {/* Item badges */}
                <View style={styles.badgesContainer}>
                  {item.isVegetarian && (
                    <View style={[styles.badge, { backgroundColor: colors.success + '20' }]}>
                      <Text style={[styles.badgeText, { color: colors.success }]}>Vegetarian</Text>
                    </View>
                  )}
                  {item.isVegan && (
                    <View style={[styles.badge, { backgroundColor: colors.success + '20' }]}>
                      <Text style={[styles.badgeText, { color: colors.success }]}>Vegan</Text>
                    </View>
                  )}
                  {item.isGlutenFree && (
                    <View style={[styles.badge, { backgroundColor: colors.info + '20' }]}>
                      <Text style={[styles.badgeText, { color: colors.info }]}>Gluten Free</Text>
                    </View>
                  )}
                  {item.isSpicy && (
                    <View style={[styles.badge, { backgroundColor: colors.error + '20' }]}>
                      <Text style={[styles.badgeText, { color: colors.error }]}>Spicy</Text>
                    </View>
                  )}
                  {item.isFeatured && (
                    <View style={[styles.badge, { backgroundColor: colors.warning + '20' }]}>
                      <Text style={[styles.badgeText, { color: colors.warning }]}>Featured</Text>
                    </View>
                  )}
                </View>
              </View>
              
              {item.image && (
                <Image source={{ uri: item.image }} style={styles.menuItemImage} />
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  categoryTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
  },
  categoryName: {
    fontWeight: '500',
    fontSize: 14,
  },
  menuItemsContainer: {
    paddingHorizontal: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 16,
  },
  menuItem: {
    borderRadius: 8,
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
  },
  menuItemContent: {
    flexDirection: 'row',
  },
  menuItemInfo: {
    flex: 1,
    marginRight: 10,
  },
  menuItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  menuItemDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  menuItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  badge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 6,
    marginBottom: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '500',
  },
});

export default RestaurantMenuSection;