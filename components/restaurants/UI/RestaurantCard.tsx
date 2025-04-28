import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Restaurant } from '@/types/restaurant';
import { useTheme } from '@/context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

interface FeaturedRestaurantCarouselProps {
  restaurants: Restaurant[];
  onViewAll?: () => void;
}

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width - 48;

const FeaturedRestaurantCarousel: React.FC<FeaturedRestaurantCarouselProps> = ({ 
  restaurants,
  onViewAll
}) => {
  const { colors } = useTheme();

  const renderItem = ({ item }: { item: Restaurant }) => (
    <TouchableOpacity 
      style={styles.carouselItem} 
      onPress={() => router.push(`/restaurants/${item.id}`)}
      activeOpacity={0.9}
    >
      <Image source={{ uri: item.coverImage }} style={styles.image} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.gradient}
      />
      
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          {item.logoImage ? (
            <Image source={{ uri: item.logoImage }} style={styles.logo} />
          ) : (
            <View style={[styles.logoPlaceholder, { backgroundColor: colors.primary }]}>
              <Text style={styles.logoPlaceholderText}>
                {item.name.charAt(0)}
              </Text>
            </View>
          )}
          
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {item.name}
            </Text>
            <View style={styles.ratingContainer}>
              <Feather name="star" size={14} color="#FFD700" />
              <Text style={styles.rating}>
                {item.rating.toFixed(1)} • {item.reviewCount} reviews
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.footer}>
          <View style={styles.cuisineContainer}>
            {item.cuisineTypes.slice(0, 2).map((cuisine, index) => (
              <Text 
                key={index} 
                style={styles.cuisine}
              >
                {cuisine}{index < Math.min(2, item.cuisineTypes.length) - 1 ? ' • ' : ''}
              </Text>
            ))}
          </View>
          
          <TouchableOpacity 
            style={[styles.viewButton, { backgroundColor: 'white' }]}
            onPress={() => router.push(`/restaurants/${item.id}`)}
          >
            <Text style={[styles.viewButtonText, { color: colors.background }]}>
              View
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Featured Restaurants
        </Text>
        {onViewAll && (
          <TouchableOpacity onPress={onViewAll}>
            <Text style={[styles.viewAllText, { color: colors.primary }]}>
              View All
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      <FlatList
        data={restaurants}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToAlignment="center"
        contentContainerStyle={styles.carouselContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  carouselContent: {
    paddingHorizontal: 16,
  },
  carouselItem: {
    width: ITEM_WIDTH,
    height: 200,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
  },
  contentContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  logoPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  logoPlaceholderText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    color: 'white',
    marginLeft: 4,
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cuisineContainer: {
    flexDirection: 'row',
  },
  cuisine: {
    color: 'white',
    fontSize: 12,
    opacity: 0.9,
  },
  viewButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  viewButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default FeaturedRestaurantCarousel;