import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { FormSection } from '@/components/ui/FormSection';
import { FormInput } from '@/components/ui/FormInput';
import { MultiSelect } from '@/components/ui/MultiSelect';
import { CuisineType, PriceRange, Amenities, RestaurantFormData } from '@/types/restaurant';
import { RadioButton } from '@/components/ui/RadioButton';

type Props = {
  data: RestaurantFormData;
  cuisineTypes: CuisineType[];
  amenities: Amenities[];
  onChange: (data: Partial<RestaurantFormData>) => void;
};

export default function RestaurantBasicInfo({ data, cuisineTypes, amenities, onChange }: Props) {
  const { colors } = useTheme();

  const handleCuisineChange = (selectedCuisines: CuisineType[]) => {
    onChange({ cuisineTypes: selectedCuisines });
  };

  const handleAmenitiesChange = (selectedAmenities: Amenities[]) => {
    onChange({ amenities: selectedAmenities });
  };

  const handlePriceRangeChange = (value: PriceRange) => {
    onChange({ priceRange: value });
  };

  return (
    <View>
      <FormSection title="Restaurant Information">
        <FormInput
          label="Restaurant Name"
          value={data.name}
          onChangeText={(text) => onChange({ name: text })}
          placeholder="Enter your restaurant name"
          required
        />

        <FormInput
          label="Description"
          value={data.description}
          onChangeText={(text) => onChange({ description: text })}
          placeholder="Describe your restaurant"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          containerStyle={{ height: 120 }}
          required
        />

        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Price Range *
        </Text>
        <View style={styles.priceRangeContainer}>
          {(['$', '$$', '$$$', '$$$$'] as PriceRange[]).map((range) => (
            <RadioButton
              key={range}
              label={range}
              selected={data.priceRange === range}
              onSelect={() => handlePriceRangeChange(range)}
            />
          ))}
        </View>

        <FormInput
          label="Year Established"
          value={data.establishedYear ? data.establishedYear.toString() : ''}
          onChangeText={(text) => onChange({ establishedYear: parseInt(text) || new Date().getFullYear() })}
          placeholder="e.g. 2020"
          keyboardType="numeric"
        />

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Cuisine Types *
          </Text>
          <MultiSelect
            items={cuisineTypes.map(cuisine => ({ label: cuisine, value: cuisine }))}
            selectedItems={data.cuisineTypes}
            onSelectedItemsChange={handleCuisineChange}
            placeholder="Select cuisines"
            searchPlaceholder="Search cuisines"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Amenities
          </Text>
          <MultiSelect
            items={amenities.map(amenity => ({ label: amenity, value: amenity }))}
            selectedItems={data.amenities}
            onSelectedItemsChange={handleAmenitiesChange}
            placeholder="Select amenities"
            searchPlaceholder="Search amenities"
          />
        </View>
      </FormSection>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  inputContainer: {
    marginBottom: 16,
  },
  priceRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
});