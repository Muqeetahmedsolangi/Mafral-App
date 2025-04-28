import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  Share,
  Dimensions,
  StatusBar,
  Linking,
  Platform
} from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Restaurant, MenuItem, MenuCategory, TableType } from '@/types/restaurant';
import { getRestaurantById } from '@/constants/restaurantMockData';
import RestaurantInfoSection from '@/components/restaurants/RestaurantInfoSection';
import RestaurantHoursSection from '@/components/restaurants/RestaurantHoursSection';
import RestaurantMenuSection from '@/components/restaurants/RestaurantMenuSection';
import RestaurantTableSection from '@/components/restaurants/RestaurantTablesSection';
import RestaurantImagesSection from '@/components/restaurants/RestaurantBasicInfo';
import RestaurantMapSection from '@/components/restaurants/RestaurantMapSection';

const { width, height } = Dimensions.get('window');
const IMAGE_HEIGHT = height * 0.3;

export default function RestaurantDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'menu' | 'photos'>('info');

  useEffect(() => {
    if (typeof id === 'string') {
      // In a real app, fetch from API
      const fetchedRestaurant = getRestaurantById(id);
      if (fetchedRestaurant) {
        setRestaurant(fetchedRestaurant);
        setIsFavorite(fetchedRestaurant.isFavorite || false);
      }
    }
  }, [id]);
  
  if (!restaurant) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Loading restaurant details...</Text>
      </View>
    );
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${restaurant.name} on Mafral-App!`,
        url: `https://mafral.app/restaurants/${restaurant.id}`,
        title: restaurant.name,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const handleCall = () => {
    if (restaurant.contactInfo.phone) {
      Linking.openURL(`tel:${restaurant.contactInfo.phone}`);
    }
  };

  const handleDirection = () => {
    const { latitude, longitude } = restaurant.address;
    if (latitude && longitude) {
      const url = Platform.select({
        ios: `maps:0,0?q=${restaurant.name}@${latitude},${longitude}`,
        android: `geo:0,0?q=${latitude},${longitude}(${restaurant.name})`,
      });
      if (url) Linking.openURL(url);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'info':
        return (
          <>
            <RestaurantInfoSection restaurant={restaurant} />
            <RestaurantHoursSection openingHours={restaurant.openingHours} />
            <RestaurantTableSection tables={restaurant.tables} onTablesChange={function (tables: TableType[]): void {
                    throw new Error('Function not implemented.');
                } } />
            <RestaurantMapSection 
              address={restaurant.address}
              name={restaurant.name}
            />
          </>
        );
      case 'menu':
        return (
          <RestaurantMenuSection menu={restaurant.menu} />
        );
      case 'photos':
        return (
          <RestaurantImagesSection images={restaurant.images} />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
      <Stack.Screen 
        options={{ 
          headerShown: false,
        }} 
      />
      
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header Image */}
        <View style={styles.headerContainer}>
          <Image source={{ uri: restaurant.coverImage }} style={styles.headerImage} />
          <LinearGradient
            colors={['rgba(0,0,0,0.7)', 'transparent', 'rgba(0,0,0,0.7)']}
            style={styles.headerGradient}
          />
          
          {/* Back Button */}
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: 'rgba(0,0,0,0.5)' }]} 
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          
          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
              onPress={() => setIsFavorite(!isFavorite)}
            >
              <Feather 
                name={isFavorite ? "heart" : "heart"} 
                size={20} 
                color={isFavorite ? colors.error : "white"} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
              onPress={handleShare}
            >
              <Feather name="share" size={20} color="white" />
            </TouchableOpacity>
          </View>
          
          {/* Restaurant Logo */}
          <View style={styles.logoContainer}>
            {restaurant.logoImage ? (
              <Image source={{ uri: restaurant.logoImage }} style={styles.logo} />
            ) : (
              <View style={[styles.logoPlaceholder, { backgroundColor: colors.primary }]}>
                <Text style={styles.logoPlaceholderText}>
                  {restaurant.name.charAt(0)}
                </Text>
              </View>
            )}
          </View>
        </View>
        
        {/* Restaurant Info Header */}
        <View style={styles.infoHeader}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: colors.text }]}>
              {restaurant.name}
            </Text>
            <View style={styles.metaContainer}>
              <View style={styles.ratingContainer}>
                <Feather name="star" size={16} color={colors.warning} />
                <Text style={[styles.rating, { color: colors.text }]}>
                  {restaurant.rating.toFixed(1)} • {restaurant.reviewCount} reviews
                </Text>
              </View>
              
              <View style={styles.cuisineContainer}>
                <Text style={[styles.cuisineText, { color: colors.textSecondary }]}>
                  {restaurant.cuisineTypes.join(' • ')}
                </Text>
              </View>
              
              <View style={styles.priceContainer}>
                <Text style={[styles.price, { color: colors.textSecondary }]}>
                  {restaurant.priceRange} • 
                </Text>
                <Feather name="map-pin" size={14} color={colors.textSecondary} style={{ marginLeft: 4 }} />
                <Text style={[styles.location, { color: colors.textSecondary }]}>
                  {restaurant.address.city}, {restaurant.address.state}
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Quick Action Buttons */}
        <View style={styles.quickActionContainer}>
          <TouchableOpacity 
            style={[styles.quickActionButton, { backgroundColor: colors.card }]}
            onPress={handleCall}
          >
            <Feather name="phone" size={18} color={colors.primary} />
            <Text style={[styles.quickActionText, { color: colors.text }]}>Call</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.quickActionButton, { backgroundColor: colors.card }]}
            onPress={handleDirection}
          >
            <Feather name="map" size={18} color={colors.primary} />
            <Text style={[styles.quickActionText, { color: colors.text }]}>Directions</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.quickActionButton, { backgroundColor: colors.card }]}
            onPress={() => {
              if (restaurant.contactInfo.website) {
                Linking.openURL(restaurant.contactInfo.website.startsWith('http') ? 
                  restaurant.contactInfo.website : 
                  `https://${restaurant.contactInfo.website}`);
              }
            }}
          >
            <Feather name="globe" size={18} color={colors.primary} />
            <Text style={[styles.quickActionText, { color: colors.text }]}>Website</Text>
          </TouchableOpacity>
        </View>
        
        {/* Tab Navigation */}
        <View style={[styles.tabContainer, { borderBottomColor: colors.border }]}>
          <TouchableOpacity 
            style={[
              styles.tab, 
              activeTab === 'info' && { borderBottomColor: colors.primary, borderBottomWidth: 2 }
            ]}
            onPress={() => setActiveTab('info')}
          >
            <Text 
              style={[
                styles.tabText, 
                { color: activeTab === 'info' ? colors.primary : colors.textSecondary }
              ]}
            >
              Info
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.tab, 
              activeTab === 'menu' && { borderBottomColor: colors.primary, borderBottomWidth: 2 }
            ]}
            onPress={() => setActiveTab('menu')}
          >
            <Text 
              style={[
                styles.tabText, 
                { color: activeTab === 'menu' ? colors.primary : colors.textSecondary }
              ]}
            >
              Menu
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.tab, 
              activeTab === 'photos' && { borderBottomColor: colors.primary, borderBottomWidth: 2 }
            ]}
            onPress={() => setActiveTab('photos')}
          >
            <Text 
              style={[
                styles.tabText, 
                { color: activeTab === 'photos' ? colors.primary : colors.textSecondary }
              ]}
            >
              Photos
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Content based on active tab */}
        <ScrollView 
          style={styles.content} 
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {renderTabContent()}
        </ScrollView>
        
        {/* Reserve Button */}
        <TouchableOpacity 
          style={[styles.reserveButton, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/restaurants/reservation')}
        >
          <Text style={styles.reserveButtonText}>Make a Reservation</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    height: IMAGE_HEIGHT,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backButton: {
    position: 'absolute',
    top: 48,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtons: {
    position: 'absolute',
    top: 48,
    right: 16,
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  logoContainer: {
    position: 'absolute',
    bottom: -40,
    left: 16,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'white',
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  logoPlaceholderText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  infoHeader: {
    paddingTop: 56,
    paddingHorizontal: 16,
  },
  titleContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  metaContainer: {
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    marginLeft: 4,
  },
  cuisineContainer: {
    marginBottom: 4,
  },
  cuisineText: {
    fontSize: 14,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 14,
  },
  location: {
    fontSize: 14,
    marginLeft: 4,
  },
  quickActionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  quickActionText: {
    marginLeft: 8,
    fontWeight: '500',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 80,
  },
  reserveButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reserveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});