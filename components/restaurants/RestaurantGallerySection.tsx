import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Dimensions } from 'react-native';
import { FormSection } from '@/components/ui/FormSection';
import { ImageUploader } from '@/components/ui/ImageUploader';
import { useTheme } from '@/context/ThemeContext';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { RestaurantImage } from '@/types/restaurant';

type Props = {
  images: RestaurantImage[];
  onImagesChange: (images: RestaurantImage[]) => void;
};

const GALLERY_TYPES = [
  { key: 'interior', label: 'Interior', icon: 'chair' },
  { key: 'exterior', label: 'Exterior', icon: 'store' },
  { key: 'food', label: 'Food', icon: 'restaurant' },
  { key: 'ambience', label: 'Ambience', icon: 'lightbulb' },
  { key: 'other', label: 'Other', icon: 'grid-view' },
];

const windowWidth = Dimensions.get('window').width;
const imageWidth = (windowWidth - 48) / 2;

export default function RestaurantGallerySection({ images, onImagesChange }: Props) {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [editMode, setEditMode] = useState(false);

  const addImage = (type: string) => {
    const newImage: RestaurantImage = {
      id: `img_${Date.now()}`,
      url: '',
      type: type as 'interior' | 'exterior' | 'food' | 'ambience' | 'other',
      caption: '',
    };
    onImagesChange([...images, newImage]);
  };

  const updateImage = (imageId: string, url: string) => {
    const updatedImages = images.map(img => {
      if (img.id === imageId) {
        return { ...img, url };
      }
      return img;
    });
    onImagesChange(updatedImages);
  };

  const updateCaption = (imageId: string, caption: string) => {
    const updatedImages = images.map(img => {
      if (img.id === imageId) {
        return { ...img, caption };
      }
      return img;
    });
    onImagesChange(updatedImages);
  };

  const deleteImage = (imageId: string) => {
    onImagesChange(images.filter(img => img.id !== imageId));
  };

  const filteredImages = activeTab === 'all' 
    ? images 
    : images.filter(img => img.type === activeTab);

  return (
    <FormSection title="Photo Gallery">
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        Upload photos of your restaurant, food, and ambiance to attract customers.
      </Text>

      <View style={styles.header}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab, 
              activeTab === 'all' && styles.activeTab,
              { borderColor: colors.border }
            ]}
            onPress={() => setActiveTab('all')}
          >
            <Text 
              style={[
                styles.tabText, 
                { color: activeTab === 'all' ? colors.primary : colors.text }
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          
          <FlatList
            data={GALLERY_TYPES}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.key}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.tab, 
                  activeTab === item.key && styles.activeTab,
                  { borderColor: colors.border }
                ]}
                onPress={() => setActiveTab(item.key)}
              >
                <MaterialIcons 
                  name={item.icon as any} 
                  size={16} 
                  color={activeTab === item.key ? colors.primary : colors.text} 
                  style={styles.tabIcon}
                />
                <Text 
                  style={[
                    styles.tabText, 
                    { color: activeTab === item.key ? colors.primary : colors.text }
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.tabScroll}
          />
        </View>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setEditMode(!editMode)}
        >
          <Text style={{ color: colors.primary }}>
            {editMode ? 'Done' : 'Edit'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.gallery}>
        {filteredImages.map(image => (
          <View 
            key={image.id}
            style={[styles.imageContainer, { borderColor: colors.border }]}
          >
            <ImageUploader
              image={image.url}
              onImageSelected={(url) => updateImage(image.id, url)}
              aspectRatio={1}
              style={styles.imageUploader}
            />
            
            {editMode && (
              <TouchableOpacity
                style={[styles.deleteButton, { backgroundColor: colors.error }]}
                onPress={() => deleteImage(image.id)}
              >
                <Feather name="trash-2" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            )}
            
            <View style={[styles.captionContainer, { backgroundColor: colors.card }]}>
              <Text style={[styles.typeLabel, { color: colors.textSecondary }]}>
                {GALLERY_TYPES.find(type => type.key === image.type)?.label || 'Other'}
              </Text>
            </View>
          </View>
        ))}
        
        {activeTab !== 'all' && (
          <TouchableOpacity
            style={[styles.addImageContainer, { borderColor: colors.border }]}
            onPress={() => addImage(activeTab)}
          >
            <Feather name="plus" size={24} color={colors.primary} />
            <Text style={[styles.addImageText, { color: colors.primary }]}>
              Add Photo
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {activeTab === 'all' && (
        <View style={styles.addButtonsContainer}>
          {GALLERY_TYPES.map(type => (
            <TouchableOpacity
              key={type.key}
              style={[styles.addTypeButton, { borderColor: colors.border }]}
              onPress={() => addImage(type.key)}
            >
              <MaterialIcons name={type.icon as any} size={18} color={colors.primary} />
              <Text style={[styles.addTypeText, { color: colors.primary }]}>
                Add {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </FormSection>
  );
}

const styles = StyleSheet.create({
  description: {
    fontSize: 14,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tabContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  activeTab: {
    backgroundColor: '#f0f0ff',
  },
  tabIcon: {
    marginRight: 4,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
  },
  tabScroll: {
    paddingVertical: 4,
  },
  editButton: {
    padding: 8,
  },
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: imageWidth,
    height: imageWidth,
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    position: 'relative',
  },
  imageUploader: {
    width: '100%',
    height: '100%',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
  },
  typeLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  addImageContainer: {
    width: imageWidth,
    height: imageWidth,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  addImageText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  addButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  addTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    width: '48%',
    justifyContent: 'center',
  },
  addTypeText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '500',
  },
});