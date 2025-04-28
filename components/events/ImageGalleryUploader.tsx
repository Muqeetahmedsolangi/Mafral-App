import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { EventImage } from '@/types/events';
import { useTheme } from '@/context/ThemeContext';

interface ImageGalleryUploaderProps {
  images: EventImage[];
  onImagesChange: (images: EventImage[]) => void;
  maxImages?: number;
}

const ImageGalleryUploader: React.FC<ImageGalleryUploaderProps> = ({
  images,
  onImagesChange,
  maxImages = 5,
}) => {
  const { colors } = useTheme();

  const handleAddImage = async () => {
    if (images.length >= maxImages) {
      return; // Maximum images reached
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      const newImage: EventImage = {
        id: Date.now().toString(),
        uri: result.assets[0].uri,
        isCover: images.length === 0, // First image is the cover by default
      };
      
      onImagesChange([...images, newImage]);
    }
  };

  const handleRemoveImage = (id: string) => {
    const updatedImages = images.filter(img => img.id !== id);
    
    // If the cover image was removed, set the first remaining image as cover
    if (images.find(img => img.id === id)?.isCover && updatedImages.length > 0) {
      updatedImages[0].isCover = true;
    }
    
    onImagesChange(updatedImages);
  };

  const handleSetCover = (id: string) => {
    const updatedImages = images.map(img => ({
      ...img,
      isCover: img.id === id
    }));
    onImagesChange(updatedImages);
  };

  const coverImage = images.find(img => img.isCover);

  return (
    <View style={styles.container}>
      {/* Cover Image */}
      <TouchableOpacity
        style={[
          styles.coverImageContainer,
          { backgroundColor: colors.surfaceVariant }
        ]}
        onPress={handleAddImage}
      >
        {coverImage ? (
          <Image source={{ uri: coverImage.uri }} style={styles.coverImage} />
        ) : (
          <View style={styles.coverImagePlaceholder}>
            <Feather name="image" size={40} color={colors.textSecondary} />
            <Text style={[styles.coverImageText, { color: colors.textSecondary }]}>
              Add Cover Photos
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Gallery Thumbnails */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbnailsRow}>
        {images.map((image) => (
          <View key={image.id} style={styles.thumbnailWrapper}>
            <Image source={{ uri: image.uri }} style={styles.thumbnail} />
            
            <View style={styles.thumbnailOverlay}>
              {image.isCover ? (
                <View style={[styles.coverBadge, { backgroundColor: colors.primary }]}>
                  <Text style={styles.coverBadgeText}>Cover</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={[styles.setCoverButton, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
                  onPress={() => handleSetCover(image.id)}
                >
                  <Text style={styles.setCoverButtonText}>Set as cover</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveImage(image.id)}
              >
                <Feather name="x" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
        
        {images.length < maxImages && (
          <TouchableOpacity
            style={[styles.addImageButton, { backgroundColor: colors.surfaceVariant }]}
            onPress={handleAddImage}
          >
            <Feather name="plus" size={24} color={colors.primary} />
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  coverImageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 10,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverImagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverImageText: {
    marginTop: 12,
    fontSize: 16,
  },
  thumbnailsRow: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  thumbnailWrapper: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'space-between',
    padding: 4,
  },
  coverBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  coverBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  setCoverButton: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  setCoverButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageButton: {
    width: 80,
    height: 80,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderStyle: 'dashed',
  },
});

export default ImageGalleryUploader;