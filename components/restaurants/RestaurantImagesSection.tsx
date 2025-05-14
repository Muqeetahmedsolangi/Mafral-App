import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  FlatList, 
  TouchableOpacity, 
  Dimensions
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface RestaurantImagesSectionProps {
  images: string[];
}

const { width } = Dimensions.get('window');
const IMAGE_SIZE = (width - 48) / 2;

const RestaurantImagesSection: React.FC<RestaurantImagesSectionProps> = ({ images }) => {
  const { colors } = useTheme();
  
  if (!images || images.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          No images available
        </Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        numColumns={2}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.imagesGrid}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.imageContainer}>
            <Image 
              source={{ uri: item }} 
              style={[styles.image, { backgroundColor: colors.border }]}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  imagesGrid: {
    paddingBottom: 16,
  },
  imageContainer: {
    margin: 4,
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
  },
});

export default RestaurantImagesSection;