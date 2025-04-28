import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { Button } from '@/components/ui/Button';
import { StepIndicator } from '@/components/ui/StepIndicator';
import { EMPTY_RESTAURANT } from '@/constants/restaurantMockData';
import { Restaurant, RestaurantCreationStep, OpeningHours } from '@/types/restaurant';
import { router } from 'expo-router';

// Import all restaurant section components
import RestaurantBasicInfoSection from '@/components/restaurants/RestaurantBasicInfoSection';
import RestaurantLocationSection from '@/components/restaurants/RestaurantLocationSection';
import RestaurantFeaturesSection from '@/components/restaurants/RestaurantFeaturesSection';
import RestaurantOpeningHoursSection from '@/components/restaurants/RestaurantOpeningHoursSection';
import RestaurantMenuSection from '@/components/restaurants/RestaurantMenuSection';
import RestaurantTablesSection from '@/components/restaurants/RestaurantTablesSection';
import RestaurantGallerySection from '@/components/restaurants/RestaurantGallerySection';
import RestaurantStaffSection from '@/components/restaurants/RestaurantStaffSection';
import RestaurantSuccessStoriesSection from '@/components/restaurants/RestaurantSuccessStoriesSection';

export default function CreateRestaurantScreen() {
  const { colors } = useTheme();
  const [currentStep, setCurrentStep] = useState<RestaurantCreationStep>('basicInfo');
  const [restaurant, setRestaurant] = useState<Omit<Restaurant, 'id'>>({
    ...EMPTY_RESTAURANT,
    features: {
      takeout: false,
      delivery: false,
      dineIn: false, // Make sure this property exists and is spelled correctly
      outdoorSeating: false,
      parking: false,
      wifi: false,
      reservations: false,
      privateEvents: false,
      accessibilityFeatures: false,
      alcoholServed: false,
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Define the steps in the restaurant creation process
  const steps: { key: RestaurantCreationStep; title: string }[] = [
    { key: 'basicInfo', title: 'Basic Info' },
    { key: 'location', title: 'Location' },
    { key: 'features', title: 'Features' },
    { key: 'openingHours', title: 'Hours' },
    { key: 'menu', title: 'Menu' },
    { key: 'tables', title: 'Tables' },
    { key: 'gallery', title: 'Gallery' },
    { key: 'staff', title: 'Staff' },
    { key: 'stories', title: 'Stories' },
    { key: 'review', title: 'Review' },
  ];

  const currentStepIndex = steps.findIndex(step => step.key === currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  const handleBack = () => {
    if (isFirstStep) {
      // Confirm before discarding changes
      Alert.alert(
        'Discard Changes?',
        'Are you sure you want to cancel? All your changes will be lost.',
        [
          { text: 'No', style: 'cancel' },
          { 
            text: 'Yes', 
            style: 'destructive', 
            onPress: () => router.back() 
          }
        ]
      );
    } else {
      // Go to previous step
      const previousStep = steps[currentStepIndex - 1].key;
      setCurrentStep(previousStep);
    }
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (isLastStep) {
        handleSubmit();
      } else {
        // Go to next step
        const nextStep = steps[currentStepIndex + 1].key;
        setCurrentStep(nextStep);
      }
    }
  };

  const validateCurrentStep = (): boolean => {
    // Validation logic for each step
    switch (currentStep) {
      case 'basicInfo':
        if (!restaurant.name.trim()) {
          Alert.alert('Missing Information', 'Please enter a restaurant name');
          return false;
        }
        if (!restaurant.description.trim()) {
          Alert.alert('Missing Information', 'Please enter a description for your restaurant');
          return false;
        }
        if (restaurant.cuisineTypes.length === 0) {
          Alert.alert('Missing Information', 'Please select at least one cuisine type');
          return false;
        }
        return true;
        
      case 'location':
        if (!restaurant.address.street.trim() || !restaurant.address.city.trim() || !restaurant.address.country.trim()) {
          Alert.alert('Missing Address', 'Please complete the required address fields');
          return false;
        }
        
        // Try a different approach to validation
        const lat = restaurant.address.latitude;
        const lng = restaurant.address.longitude;
        
        // Log debug info
        console.log('Validating coordinates:', { 
          lat, 
          lng, 
          latType: typeof lat, 
          lngType: typeof lng,
          latIsNaN: isNaN(lat as number),
          lngIsNaN: isNaN(lng as number)
        });
        
        // More comprehensive check including empty strings and undefined
        if (lat === null || lat === undefined || 
            lng === null || lng === undefined || 
            isNaN(Number(lat)) || isNaN(Number(lng))) {
          
 
        }
        
        if (!restaurant.contactInfo.email.trim() || !restaurant.contactInfo.phone.trim()) {
          Alert.alert('Missing Contact Information', 'Please provide email and phone number');
          return false;
        }
        return true;
        
      case 'openingHours':
        const hasOpenDays = restaurant.openingHours.some(day => day.open && day.hours.length > 0);
        if (!hasOpenDays) {
          Alert.alert('Missing Hours', 'Please set opening hours for at least one day');
          return false;
        }
        return true;
        
      case 'menu':
        if (restaurant.menu.categories.length === 0) {
          Alert.alert('Missing Menu', 'Please add at least one menu category');
          return false;
        }
        return true;
        
      // Add more validations for other steps as needed
      
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // In a real app, you would send the data to your backend API
      console.log('Submitting restaurant data:', restaurant);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success message
      Alert.alert(
        'Restaurant Created!',
        'Your restaurant has been successfully created.',
        [
          { text: 'OK', onPress: () => router.back() }
        ]
      );
    } catch (error) {
      console.error('Error submitting restaurant:', error);
      Alert.alert('Error', 'There was a problem creating your restaurant. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // State updater functions
  const updateBasicInfo = (
    field: keyof Pick<Restaurant, 'name' | 'description' | 'cuisineTypes' | 'priceRange' | 'establishedYear' | 'coverImage' | 'logoImage'>, 
    value: any
  ) => {
    setRestaurant(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const updateAddress = (newAddress: Partial<typeof restaurant.address>) => {
    setRestaurant(prev => {
      // Ensure latitude and longitude are proper numbers if they exist
      const updatedAddress = {
        ...prev.address,
        ...newAddress
      };
      
      // Make explicit number conversions for coordinates to avoid type issues
      if (newAddress.latitude !== undefined && newAddress.latitude !== null) {
        updatedAddress.latitude = Number(newAddress.latitude);
      }
      
      if (newAddress.longitude !== undefined && newAddress.longitude !== null) {
        updatedAddress.longitude = Number(newAddress.longitude);
      }
      
      // Log the coordinates to verify they're being set correctly
      console.log("Updated coordinates:", {
        latitude: updatedAddress.latitude,
        longitude: updatedAddress.longitude
      });
      
      return {
        ...prev,
        address: updatedAddress
      };
    });
  };

  const updateContactInfo = (contactInfo: typeof restaurant.contactInfo) => {
    setRestaurant(prev => ({
      ...prev,
      contactInfo
    }));
  };

  const updateFeatures = (features: typeof restaurant.features) => {
    setRestaurant(prev => ({
      ...prev,
      features
    }));
  };
  
  const updateOpeningHours = (hours: OpeningHours[]) => {
    setRestaurant(prev => ({
      ...prev,
      openingHours: hours
    }));
  };
  
  const updateMenu = (categories: typeof restaurant.menu.categories, items: typeof restaurant.menu.items) => {
    setRestaurant(prev => ({
      ...prev,
      menu: {
        categories,
        items
      }
    }));
  };
  
  const updateTables = (tables: typeof restaurant.tables) => {
    setRestaurant(prev => ({
      ...prev,
      tables
    }));
  };
  
  const updateImages = (images: typeof restaurant.images) => {
    setRestaurant(prev => ({
      ...prev,
      images
    }));
  };
  
  const updateStaff = (staff: typeof restaurant.staff) => {
    setRestaurant(prev => ({
      ...prev,
      staff
    }));
  };
  
  const updateSuccessStories = (stories: typeof restaurant.successStories) => {
    setRestaurant(prev => ({
      ...prev,
      successStories: stories
    }));
  };

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 'basicInfo':
        return (
          <RestaurantBasicInfoSection
            name={restaurant.name}
            description={restaurant.description}
            cuisine={restaurant.cuisineTypes} // Map cuisineTypes to cuisine for the component
            priceRange={restaurant.priceRange}
            established={restaurant.establishedYear.toString()} // Convert to string
            coverImage={restaurant.coverImage || ''}
            logoImage={restaurant.logoImage || ''}
            onNameChange={(value) => updateBasicInfo('name', value)}
            onDescriptionChange={(value) => updateBasicInfo('description', value)}
            onCuisineChange={(value) => updateBasicInfo('cuisineTypes', value)}
            onPriceRangeChange={(value) => updateBasicInfo('priceRange', value)}
            onEstablishedChange={(value) => updateBasicInfo('establishedYear', parseInt(value) || new Date().getFullYear())}
            onCoverImageChange={(value) => updateBasicInfo('coverImage', value)}
            onLogoImageChange={(value) => updateBasicInfo('logoImage', value)}
          />
        );
      
      case 'location':
        return (
          <RestaurantLocationSection
            address={restaurant.address}
            contactInfo={restaurant.contactInfo}
            onAddressChange={updateAddress}
            onContactInfoChange={updateContactInfo}
          />
        );
      
      case 'features':
        return (
          <RestaurantFeaturesSection
            features={restaurant.features} // Make sure this exists
            onFeaturesChange={(features) => {
              setRestaurant(prev => ({
                ...prev,
                features
              }));
            }}
          />
        );
        
      case 'openingHours':
        return (
          <RestaurantOpeningHoursSection
            hours={restaurant.openingHours}
            onHoursChange={updateOpeningHours}
          />
        );
        
      case 'menu':
        return (
          <RestaurantMenuSection
            categories={restaurant.menu.categories}
            onCategoriesChange={(categories) => updateMenu(categories, restaurant.menu.items)}
          />
        );
        
      case 'tables':
        return (
          <RestaurantTablesSection
            tables={restaurant.tables}
            onTablesChange={updateTables}
          />
        );
        
      case 'gallery':
        return (
          <RestaurantGallerySection
            images={restaurant.images}
            onImagesChange={updateImages}
          />
        );
        
      case 'staff':
        return (
          <RestaurantStaffSection
            staff={restaurant.staff}
            onStaffChange={updateStaff}
          />
        );
        
      case 'stories':
        return (
          <RestaurantSuccessStoriesSection
            stories={restaurant.successStories}
            onStoriesChange={updateSuccessStories}
          />
        );
        
      case 'review':
        return (
          <View style={styles.reviewContainer}>
            <Text style={[styles.reviewTitle, { color: colors.text }]}>
              Review Your Restaurant
            </Text>
            <Text style={[styles.reviewSubtitle, { color: colors.textSecondary }]}>
              Please review all information before submitting
            </Text>
            
            {/* Restaurant preview card */}
            <View style={[styles.previewCard, { backgroundColor: colors.card }]}>
              {restaurant.coverImage ? (
                <Image 
                  source={{ uri: restaurant.coverImage }}
                  style={styles.previewCoverImage}
                />
              ) : (
                <View style={[styles.previewCoverPlaceholder, { backgroundColor: colors.surface }]}>
                  <Feather name="image" size={32} color={colors.textSecondary} />
                </View>
              )}
              
              <View style={styles.previewContent}>
                <View style={styles.previewHeader}>
                  {restaurant.logoImage ? (
                    <Image 
                      source={{ uri: restaurant.logoImage }}
                      style={styles.previewLogoImage}
                    />
                  ) : (
                    <View style={[styles.previewCoverPlaceholder, { backgroundColor: colors.surface }]}>
                      <Feather name="camera" size={24} color={colors.textSecondary} />
                    </View>
                  )}
                  
                  <View style={styles.previewHeaderText}>
                    <Text style={[styles.previewName, { color: colors.text }]}>
                      {restaurant.name || 'Restaurant Name'}
                    </Text>
                    <Text style={[styles.previewCuisine, { color: colors.textSecondary }]}>
                      {restaurant.cuisineTypes.join(' • ') || 'No cuisine types selected'}
                    </Text>
                    <View style={styles.previewDetails}>
                      <Text style={{ color: colors.primary }}>
                        {restaurant.priceRange}
                      </Text>
                      <Text style={{ color: colors.textSecondary }}> • </Text>
                      <Text style={{ color: colors.text }}>
                        {restaurant.address.city || 'No location'}, {restaurant.address.country || ''}
                      </Text>
                    </View>
                  </View>
                </View>
                
                <Text style={[styles.previewDescription, { color: colors.text }]} numberOfLines={3}>
                  {restaurant.description || 'No description provided'}
                </Text>
                
                <View style={[styles.previewStats, { borderTopColor: colors.border }]}>
                  <View style={styles.previewStat}>
                    <Text style={[styles.previewStatValue, { color: colors.text }]}>
                      {restaurant.menu.categories.length}
                    </Text>
                    <Text style={[styles.previewStatLabel, { color: colors.textSecondary }]}>
                      Menu Categories
                    </Text>
                  </View>
                  
                  <View style={styles.previewStat}>
                    <Text style={[styles.previewStatValue, { color: colors.text }]}>
                      {restaurant.tables.length}
                    </Text>
                    <Text style={[styles.previewStatLabel, { color: colors.textSecondary }]}>
                      Table Types
                    </Text>
                  </View>
                  
                  <View style={styles.previewStat}>
                    <Text style={[styles.previewStatValue, { color: colors.text }]}>
                      {restaurant.images.length}
                    </Text>
                    <Text style={[styles.previewStatLabel, { color: colors.textSecondary }]}>
                      Gallery Images
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            
            <Text style={[styles.disclaimer, { color: colors.textSecondary }]}>
              By submitting, you confirm that all information provided is accurate and that you have the rights to use any uploaded images.
            </Text>
          </View>
        );
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Feather name="chevron-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Create Restaurant</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Step Indicator */}
      <StepIndicator
        steps={steps.map(step => step.title)}
        currentStep={currentStepIndex}
        onStepPress={(index) => {
          // Only allow navigating to previous steps or current step
          if (index <= currentStepIndex) {
            setCurrentStep(steps[index].key);
          }
        }}
      />
      
      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderStepContent()}
        <View style={styles.spacer} />
      </ScrollView>
      
      {/* Bottom Bar */}
      <View style={[styles.bottomBar, { borderTopColor: colors.border }]}>
        <Button
          title="Back"
          variant="outline"
          size="medium"
          onPress={handleBack}
          style={styles.bottomButton}
          disabled={isSubmitting}
        />
        <Button
          title={isLastStep ? "Submit" : "Next"}
          variant="primary"
          size="medium"
          onPress={handleNext}
          style={styles.bottomButton}
          loading={isSubmitting}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  spacer: {
    height: 40,
  },
  bottomBar: {
    padding: 16,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  reviewContainer: {
    padding: 16,
  },
  reviewTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  reviewSubtitle: {
    fontSize: 14,
    marginBottom: 24,
  },
  previewCard: {
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
  },
  previewCoverImage: {
    width: '100%',
    height: 160,
  },
  previewContent: {
    padding: 16,
  },
  previewHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  previewLogoImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  previewHeaderText: {
    flex: 1,
    justifyContent: 'center',
  },
  previewName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  previewCuisine: {
    fontSize: 14,
    marginBottom: 4,
  },
  previewDetails: {
    flexDirection: 'row',
  },
  previewDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  previewStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  previewStat: {
    alignItems: 'center',
  },
  previewStatValue: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  previewStatLabel: {
    fontSize: 12,
  },
  disclaimer: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  previewCoverPlaceholder: {
    width: '100%',
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
});