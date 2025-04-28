import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { FormSection } from '@/components/ui/FormSection';
import { FormInput } from '@/components/ui/FormInput';
import { FormTextArea } from '@/components/ui/FormTextArea';
import { ChipSelect } from '@/components/ui/ChipSelect';
import { ImageUploader } from '@/components/ui/ImageUploader';
import { CUISINE_TYPES } from '@/constants/restaurantMockData';
import { useTheme } from '@/context/ThemeContext';
import { PriceRange } from '@/types/restaurant';

type Props = {
  name: string;
  description: string;
  cuisine: string[]; // We can keep this as cuisine since that's how it's used in the component
  priceRange: PriceRange | number; // Make sure this accepts both types
  established: string;
  coverImage: string;
  logoImage: string;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
  onCuisineChange: (cuisine: string[]) => void;
  onPriceRangeChange: (priceRange: PriceRange | number) => void;
  onEstablishedChange: (year: string) => void;
  onCoverImageChange: (url: string) => void;
  onLogoImageChange: (url: string) => void;
};

export default function RestaurantBasicInfoSection({
  name,
  description,
  cuisine,
  priceRange,
  established,
  coverImage,
  logoImage,
  onNameChange,
  onDescriptionChange,
  onCuisineChange,
  onPriceRangeChange,
  onEstablishedChange,
  onCoverImageChange,
  onLogoImageChange
}: Props) {
  const { colors } = useTheme();
  
  // Add proper rendering (remove empty View)
  return (
    <FormSection title="Restaurant Information">
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        Enter the basic details about your restaurant to help customers find you.
      </Text>
      
      <FormInput
        label="Restaurant Name"
        value={name}
        onChangeText={onNameChange}
        placeholder="Enter restaurant name"
        required
      />
      
      <FormTextArea
        label="Description"
        value={description}
        onChangeText={onDescriptionChange}
        placeholder="Describe your restaurant, cuisine style, and what makes it unique"
        minHeight={120}
        required
      />
      
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        Cuisine Types
      </Text>
      <ChipSelect
        options={CUISINE_TYPES.map(type => ({ id: type, name: type }))}
        selectedValues={cuisine}
        onSelectionChange={onCuisineChange}
        multiple
      />
      
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        Price Range
      </Text>
      <View style={styles.priceRangeContainer}>
        {(['$', '$$', '$$$', '$$$$'] as PriceRange[]).map(price => (
          <TouchableOpacity
            key={price}
            style={[
              styles.priceOption,
              priceRange === price && { 
                backgroundColor: colors.primary + '20',
                borderColor: colors.primary
              },
              { borderColor: colors.border }
            ]}
            onPress={() => onPriceRangeChange(price)}
          >
            <Text style={[
              styles.priceText,
              { color: priceRange === price ? colors.primary : colors.text }
            ]}>
              {price}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <FormInput
        label="Year Established"
        value={established}
        onChangeText={onEstablishedChange}
        placeholder="e.g. 2022"
        keyboardType="numeric"
      />
      
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        Cover Image
      </Text>
      <Text style={[styles.helperText, { color: colors.textSecondary }]}>
        Upload a high-quality image of your restaurant or signature dish
      </Text>
      <ImageUploader
        image={coverImage}
        onImageSelected={onCoverImageChange}
        aspectRatio={16/9}
        style={styles.coverImageUploader}
      />
      
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        Restaurant Logo
      </Text>
      <ImageUploader
        image={logoImage}
        onImageSelected={onLogoImageChange}
        aspectRatio={1}
        style={styles.logoImageUploader}
      />
    </FormSection>
  );
}

const styles = StyleSheet.create({
  description: {
    fontSize: 14,
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  helperText: {
    fontSize: 12,
    marginBottom: 8,
  },
  priceRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  priceOption: {
    flex: 1,
    margin: 4,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '500',
  },
  coverImageUploader: {
    height: 200,
    marginBottom: 24,
  },
  logoImageUploader: {
    height: 120,
    width: 120,
    borderRadius: 60,
    marginBottom: 16,
    alignSelf: 'center',
  }
});