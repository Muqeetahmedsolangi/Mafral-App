import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { FormSection } from '@/components/ui/FormSection';
import { FormInput } from '@/components/ui/FormInput';
import { FormTextArea } from '@/components/ui/FormTextArea';
import { SwitchItem } from '@/components/ui/SwitchItem';
import { ImageUploader } from '@/components/ui/ImageUploader';
import { useTheme } from '@/context/ThemeContext';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { MenuCategory, MenuItem } from '@/types/restaurant';

type Props = {
  categories: MenuCategory[];
  onCategoriesChange: (categories: MenuCategory[]) => void;
};

export default function RestaurantMenuSection({ categories, onCategoriesChange }: Props) {
  const { colors } = useTheme();
  const [activeCategory, setActiveCategory] = useState<string | null>(
    categories.length > 0 ? categories[0].id : null
  );
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);

  const addNewCategory = () => {
    const newCategory: MenuCategory = {
      id: `category_${Date.now()}`,
      name: 'New Category',
      description: '',
      items: []
    };
    const updatedCategories = [...categories, newCategory];
    onCategoriesChange(updatedCategories);
    setActiveCategory(newCategory.id);
  };

  const addNewItem = (categoryId: string) => {
    const newItem: MenuItem = {
      id: `item_${Date.now()}`,
      name: 'New Item',
      description: '',
      price: 0,
      image: null,
      category: categoryId,
      popular: false,
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      spicyLevel: 0,
      allergens: []
    };

    const updatedCategories = categories.map(cat => {
      if (cat.id === categoryId) {
        return { ...cat, items: [...cat.items, newItem] };
      }
      return cat;
    });

    onCategoriesChange(updatedCategories);
    setEditingItem(newItem.id);
  };

  const updateCategoryField = (categoryId: string, field: keyof MenuCategory, value: string) => {
    const updatedCategories = categories.map(cat => {
      if (cat.id === categoryId) {
        return { ...cat, [field]: value };
      }
      return cat;
    });
    onCategoriesChange(updatedCategories);
  };

  const updateItemField = (categoryId: string, itemId: string, field: keyof MenuItem, value: any) => {
    const updatedCategories = categories.map(cat => {
      if (cat.id === categoryId) {
        const updatedItems = cat.items.map((item: { id: string; }) => {
          if (item.id === itemId) {
            return { ...item, [field]: value };
          }
          return item;
        });
        return { ...cat, items: updatedItems };
      }
      return cat;
    });
    onCategoriesChange(updatedCategories);
  };

  const deleteCategory = (categoryId: string) => {
    const updatedCategories = categories.filter(cat => cat.id !== categoryId);
    onCategoriesChange(updatedCategories);
    
    if (updatedCategories.length > 0) {
      setActiveCategory(updatedCategories[0].id);
    } else {
      setActiveCategory(null);
    }
  };

  const deleteItem = (categoryId: string, itemId: string) => {
    const updatedCategories = categories.map(cat => {
      if (cat.id === categoryId) {
        return { ...cat, items: cat.items.filter((item: { id: string; }) => item.id !== itemId) };
      }
      return cat;
    });
    onCategoriesChange(updatedCategories);
    setEditingItem(null);
  };

  const renderCategoryEditor = (category: MenuCategory) => {
    return (
      <View style={styles.categoryEditorContainer}>
        <FormInput
          label="Category Name"
          value={category.name}
          onChangeText={(text) => updateCategoryField(category.id, 'name', text)}
          placeholder="Enter category name"
        />

        <FormTextArea
          label="Category Description"
          value={category.description}
          onChangeText={(text) => updateCategoryField(category.id, 'description', text)}
          placeholder="Enter category description"
          minHeight={80}
        />

        <TouchableOpacity 
          style={[styles.button, styles.deleteButton, { backgroundColor: colors.error }]}
          onPress={() => deleteCategory(category.id)}
        >
          <Text style={styles.buttonText}>Delete Category</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => setEditingCategory(null)}
        >
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderItemEditor = (categoryId: string, item: MenuItem) => {
    return (
      <View style={styles.itemEditorContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setEditingItem(null)}
        >
          <Feather name="arrow-left" size={20} color={colors.primary} />
          <Text style={[styles.backButtonText, { color: colors.primary }]}>Back to Menu</Text>
        </TouchableOpacity>

        <FormInput
          label="Item Name"
          value={item.name}
          onChangeText={(text) => updateItemField(categoryId, item.id, 'name', text)}
          placeholder="Enter item name"
        />

        <FormTextArea
          label="Item Description"
          value={item.description}
          onChangeText={(text) => updateItemField(categoryId, item.id, 'description', text)}
          placeholder="Enter item description"
          minHeight={80}
        />

        <FormInput
          label="Price"
          value={item.price.toString()}
          onChangeText={(text) => {
            const price = parseFloat(text) || 0;
            updateItemField(categoryId, item.id, 'price', price);
          }}
          placeholder="0.00"
          keyboardType="numeric"
        />

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Image</Text>
        <ImageUploader
          image={item.image}
          onImageSelected={(url) => updateItemField(categoryId, item.id, 'image', url)}
          aspectRatio={16/9}
          style={styles.imageUploader}
        />

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Dietary Options</Text>
        <SwitchItem
          label="Popular"
          value={item.popular}
          onValueChange={() => updateItemField(categoryId, item.id, 'popular', !item.popular)}
          icon={<MaterialIcons name="star" size={18} color={colors.text} />}
        />
        <SwitchItem
          label="Vegetarian"
          value={item.vegetarian}
          onValueChange={() => updateItemField(categoryId, item.id, 'vegetarian', !item.vegetarian)}
          icon={<MaterialIcons name="eco" size={18} color={colors.text} />}
        />
        <SwitchItem
          label="Vegan"
          value={item.vegan}
          onValueChange={() => updateItemField(categoryId, item.id, 'vegan', !item.vegan)}
          icon={<MaterialIcons name="spa" size={18} color={colors.text} />}
        />
        <SwitchItem
          label="Gluten Free"
          value={item.glutenFree}
          onValueChange={() => updateItemField(categoryId, item.id, 'glutenFree', !item.glutenFree)}
          icon={<MaterialIcons name="grain" size={18} color={colors.text} />}
        />

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Spicy Level</Text>
        <View style={styles.spicyLevelContainer}>
          {[0, 1, 2, 3].map(level => (
            <TouchableOpacity 
              key={level}
              style={[
                styles.spicyLevelButton,
                item.spicyLevel === level && { backgroundColor: colors.primary }
              ]}
              onPress={() => updateItemField(categoryId, item.id, 'spicyLevel', level)}
            >
              <Text 
                style={[
                  styles.spicyLevelText, 
                  { color: item.spicyLevel === level ? colors.background : colors.text }
                ]}
              >
                {level === 0 ? 'None' : '🌶️'.repeat(level)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          style={[styles.button, styles.deleteButton, { backgroundColor: colors.error }]}
          onPress={() => deleteItem(categoryId, item.id)}
        >
          <Text style={styles.buttonText}>Delete Item</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderMenuItems = (category: MenuCategory) => {
    return (
      <View style={styles.menuItemsContainer}>
        <View style={styles.categoryHeaderContainer}>
          <Text style={[styles.categoryName, { color: colors.text }]}>
            {category.name}
          </Text>
          <View style={styles.categoryActions}>
            <TouchableOpacity 
              style={styles.categoryAction}
              onPress={() => setEditingCategory(category.id)}
            >
              <Feather name="edit-2" size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {category.items.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No items in this category yet
          </Text>
        ) : (
          category.items.map(item  => (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.menuItem, { borderColor: colors.border }]}
              onPress={() => setEditingItem(item.id)}
            >
              {item.image ? (
                <View style={styles.menuItemImageContainer}>
                  <ImageUploader
                    image={item.image}
                    onImageSelected={(url) => updateItemField(category.id, item.id, 'image', url)}
                    aspectRatio={1}
                    style={styles.menuItemImage}
                    disabled
                  />
                </View>
              ) : (
                <View style={[styles.menuItemPlaceholder, { backgroundColor: colors.card }]}>
                  <Feather name="image" size={24} color={colors.textSecondary} />
                </View>
              )}
              
              <View style={styles.menuItemContent}>
                <Text style={[styles.menuItemName, { color: colors.text }]}>
                  {item.name}
                </Text>
                <Text 
                  style={[styles.menuItemDescription, { color: colors.textSecondary }]}
                  numberOfLines={2}
                >
                  {item.description}
                </Text>
                <Text style={[styles.menuItemPrice, { color: colors.primary }]}>
                  ${item.price.toFixed(2)}
                </Text>
                
                <View style={styles.dietaryBadges}>
                  {item.vegetarian && <Text style={styles.badge}>🥬</Text>}
                  {item.vegan && <Text style={styles.badge}>🌱</Text>}
                  {item.glutenFree && <Text style={styles.badge}>🌾</Text>}
                  {item.popular && <Text style={styles.badge}>⭐</Text>}
                  {item.spicyLevel > 0 && (
                    <Text style={styles.badge}>{"🌶️".repeat(item.spicyLevel)}</Text>
                  )}
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => setEditingItem(item.id)}
              >
                <Feather name="edit-2" size={18} color={colors.primary} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}

        <TouchableOpacity 
          style={[styles.addItemButton, { borderColor: colors.border }]}
          onPress={() => addNewItem(category.id)}
        >
          <Feather name="plus" size={18} color={colors.primary} />
          <Text style={[styles.addItemText, { color: colors.primary }]}>
            Add Menu Item
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const currentItem = activeCategory ? 
    categories.find(cat => cat.id === activeCategory)?.items.find((item: { id: string | null; }) => item.id === editingItem) 
    : null;
    
  const currentCategory = categories.find(cat => cat.id === activeCategory);
  const editingCategoryData = categories.find(cat => cat.id === editingCategory);

  return (
    <FormSection title="Menu">
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        Create your restaurant menu with categories and items. Add descriptions, prices, and dietary information.
      </Text>

      {/* If editing a specific item */}
      {editingItem && currentItem && activeCategory && (
        renderItemEditor(activeCategory, currentItem)
      )}
      
      {/* If editing a category */}
      {editingCategory && editingCategoryData && !editingItem && (
        renderCategoryEditor(editingCategoryData)
      )}
      
      {/* Normal menu view */}
      {!editingItem && !editingCategory && (
        <>
          {/* Categories tabs */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesTabsContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryTab,
                  activeCategory === category.id && styles.activeTab,
                  { borderColor: colors.border }
                ]}
                onPress={() => setActiveCategory(category.id)}
              >
                <Text 
                  style={[
                    styles.categoryTabText,
                    { color: activeCategory === category.id ? colors.primary : colors.text }
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity
              style={[styles.addCategoryButton, { borderColor: colors.border }]}
              onPress={addNewCategory}
            >
              <Feather name="plus" size={16} color={colors.primary} />
            </TouchableOpacity>
          </ScrollView>

          {/* Menu items for active category */}
          {activeCategory && currentCategory ? (
            renderMenuItems(currentCategory)
          ) : (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                {categories.length === 0 
                  ? "No menu categories yet. Click the '+' button to add a category."
                  : "Select a category to see its menu items."
                }
              </Text>
            </View>
          )}
        </>
      )}
    </FormSection>
  );
}

const styles = StyleSheet.create({
  description: {
    fontSize: 14,
    marginBottom: 16,
  },
  categoriesTabsContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 20,
    marginRight: 8,
  },
  activeTab: {
    backgroundColor: 'rgba(128, 128, 255, 0.1)',
  },
  categoryTabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  addCategoryButton: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    textAlign: 'center',
  },
  menuItemsContainer: {
    marginTop: 16,
  },
  categoryHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '600',
  },
  categoryActions: {
    flexDirection: 'row',
  },
  categoryAction: {
    padding: 4,
    marginLeft: 8,
  },
  emptyText: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  menuItemImageContainer: {
    width: 80,
    height: 80,
    overflow: 'hidden',
  },
  menuItemImage: {
    width: 80,
    height: 80,
  },
  menuItemPlaceholder: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemContent: {
    flex: 1,
    padding: 12,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 12,
    marginBottom: 8,
  },
  menuItemPrice: {
    fontSize: 14,
    fontWeight: '600',
  },
  dietaryBadges: {
    flexDirection: 'row',
    marginTop: 4,
  },
  badge: {
    marginRight: 6,
    fontSize: 12,
  },
  editButton: {
    padding: 12,
    alignSelf: 'center',
  },
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
  },
  addItemText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  categoryEditorContainer: {
    marginTop: 16,
  },
  itemEditorContainer: {
    marginTop: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  imageUploader: {
    height: 160,
    marginBottom: 16,
  },
  spicyLevelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  spicyLevelButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  spicyLevelText: {
    fontSize: 14,
    fontWeight: '500',
  },
  button: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  deleteButton: {
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});