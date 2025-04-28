import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FormSection } from '@/components/ui/FormSection';
import { SwitchItem } from '@/components/ui/SwitchItem';
import { useTheme } from '@/context/ThemeContext';
import { Feather } from '@expo/vector-icons';

type RestaurantFeatures = {
  takeout: boolean;
  delivery: boolean;
  dineIn: boolean;
  outdoorSeating: boolean;
  parking: boolean;
  wifi: boolean;
  reservations: boolean;
  privateEvents: boolean;
  accessibilityFeatures: boolean;
  alcoholServed: boolean;
};

type Props = {
  features: RestaurantFeatures;
  onFeaturesChange: (features: RestaurantFeatures) => void;
};

export default function RestaurantFeaturesSection({ features, onFeaturesChange }: Props) {
  const { colors } = useTheme();

  const handleToggle = (key: keyof RestaurantFeatures) => {
    onFeaturesChange({
      ...features,
      [key]: !features[key]
    });
  };

  return (
    <FormSection title="Restaurant Features">
      <View style={styles.featuresContainer}>
        <SwitchItem
          label="Dine-In Service"
          value={features.dineIn}
          onValueChange={() => handleToggle('dineIn')}
          icon={<Feather name="users" size={18} color={colors.text} />}
        />

        <SwitchItem
          label="Takeout Available"
          value={features.takeout}
          onValueChange={() => handleToggle('takeout')}
          icon={<Feather name="package" size={18} color={colors.text} />}
        />

        <SwitchItem
          label="Delivery Service"
          value={features.delivery}
          onValueChange={() => handleToggle('delivery')}
          icon={<Feather name="truck" size={18} color={colors.text} />}
        />

        <SwitchItem
          label="Outdoor Seating"
          value={features.outdoorSeating}
          onValueChange={() => handleToggle('outdoorSeating')}
          icon={<Feather name="sun" size={18} color={colors.text} />}
        />
        
        <SwitchItem
          label="Parking Available"
          value={features.parking}
          onValueChange={() => handleToggle('parking')}
          icon={<Feather name="navigation" size={18} color={colors.text} />}
        />

        <SwitchItem
          label="Free Wi-Fi"
          value={features.wifi}
          onValueChange={() => handleToggle('wifi')}
          icon={<Feather name="wifi" size={18} color={colors.text} />}
        />

        <SwitchItem
          label="Reservations Accepted"
          value={features.reservations}
          onValueChange={() => handleToggle('reservations')}
          icon={<Feather name="calendar" size={18} color={colors.text} />}
        />

        <SwitchItem
          label="Private Events"
          value={features.privateEvents}
          onValueChange={() => handleToggle('privateEvents')}
          icon={<Feather name="star" size={18} color={colors.text} />}
        />

        <SwitchItem
          label="Accessibility Features"
          value={features.accessibilityFeatures}
          onValueChange={() => handleToggle('accessibilityFeatures')}
          icon={<Feather name="heart" size={18} color={colors.text} />}
        />

        <SwitchItem
          label="Alcohol Served"
          value={features.alcoholServed}
          onValueChange={() => handleToggle('alcoholServed')}
          icon={<Feather name="coffee" size={18} color={colors.text} />}
        />
      </View>
    </FormSection>
  );
}

const styles = StyleSheet.create({
  featuresContainer: {
    gap: 12,
  },
});