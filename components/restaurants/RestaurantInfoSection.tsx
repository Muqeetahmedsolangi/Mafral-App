import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { Restaurant } from '@/types/restaurant';

interface RestaurantInfoSectionProps {
  restaurant: Restaurant;
}

const RestaurantInfoSection: React.FC<RestaurantInfoSectionProps> = ({ 
  restaurant 
}) => {
  const { colors } = useTheme();
  const [expanded, setExpanded] = React.useState(false);
  
  const featureIcons: Record<keyof typeof restaurant.features, string> = {
    takeout: "package",
    delivery: "truck",
    dineIn: "users",
    outdoorSeating: "sun",
    parking: "truck",
    wifi: "wifi",
    reservations: "calendar",
    privateEvents: "briefcase",
    accessibilityFeatures: "heart",
    alcoholServed: "coffee"
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
        <Text 
          style={[styles.description, { color: colors.textSecondary }]}
          numberOfLines={expanded ? undefined : 3}
        >
          {restaurant.description}
        </Text>
        {restaurant.description.length > 120 && (
          <TouchableOpacity 
            style={styles.readMoreButton} 
            onPress={() => setExpanded(!expanded)}
          >
            <Text style={[styles.readMoreText, { color: colors.primary }]}>
              {expanded ? 'Read less' : 'Read more'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Features</Text>
        <View style={styles.featuresContainer}>
          {Object.entries(restaurant.features)
            .filter(([_, value]) => value)
            .map(([key]) => (
              <View 
                key={key} 
                style={[styles.featureItem, { backgroundColor: colors.card }]}
              >
                <Feather 
                  name={featureIcons[key as keyof typeof restaurant.features] as keyof typeof Feather.glyphMap} 
                  size={14} 
                  color={colors.primary} 
                  style={styles.featureIcon}
                />
                <Text style={[styles.featureText, { color: colors.text }]}>
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </Text>
              </View>
            ))}
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Contact</Text>
        <View style={styles.contactItem}>
          <Feather name="phone" size={16} color={colors.primary} style={styles.contactIcon} />
          <Text style={[styles.contactText, { color: colors.text }]}>
            {restaurant.contactInfo.phone}
          </Text>
        </View>
        
        <View style={styles.contactItem}>
          <Feather name="mail" size={16} color={colors.primary} style={styles.contactIcon} />
          <Text style={[styles.contactText, { color: colors.text }]}>
            {restaurant.contactInfo.email}
          </Text>
        </View>
        
        {restaurant.contactInfo.website && (
          <View style={styles.contactItem}>
            <Feather name="globe" size={16} color={colors.primary} style={styles.contactIcon} />
            <Text style={[styles.contactText, { color: colors.text }]}>
              {restaurant.contactInfo.website}
            </Text>
          </View>
        )}
        
        <View style={styles.contactItem}>
          <Feather name="map-pin" size={16} color={colors.primary} style={styles.contactIcon} />
          <Text style={[styles.contactText, { color: colors.text }]}>
            {restaurant.address.street}, {restaurant.address.city}, {restaurant.address.state}, {restaurant.address.country}, {restaurant.address.postalCode}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
  },
  readMoreButton: {
    marginTop: 8,
  },
  readMoreText: {
    fontSize: 14,
    fontWeight: '500',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  featureIcon: {
    marginRight: 6,
  },
  featureText: {
    fontSize: 12,
    fontWeight: '500',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactIcon: {
    marginRight: 12,
    width: 20,
    alignItems: 'center',
  },
  contactText: {
    fontSize: 14,
    flex: 1,
  },
});

export default RestaurantInfoSection;