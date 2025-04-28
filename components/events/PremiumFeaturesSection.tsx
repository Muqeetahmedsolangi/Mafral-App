import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  TextInput,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { EventPromotion, SkipLineOption } from '@/types/events';

interface PremiumFeaturesSectionProps {
  promotion: EventPromotion;
  skipLineOption: SkipLineOption;
  onPromotionChange: (promotion: EventPromotion) => void;
  onSkipLineOptionChange: (option: SkipLineOption) => void;
}

const PremiumFeaturesSection: React.FC<PremiumFeaturesSectionProps> = ({
  promotion,
  skipLineOption,
  onPromotionChange,
  onSkipLineOptionChange,
}) => {
  const { colors } = useTheme();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const updatePromotion = (field: keyof EventPromotion, value: any) => {
    onPromotionChange({
      ...promotion,
      [field]: value
    });
  };

  const updateSkipLine = (field: keyof SkipLineOption, value: any) => {
    onSkipLineOptionChange({
      ...skipLineOption,
      [field]: value
    });
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Premium Options</Text>
      
      {/* Event Promotion */}
      <View style={[styles.featureCard, { backgroundColor: colors.card }]}>
        <TouchableOpacity 
          style={styles.featureHeader}
          onPress={() => toggleSection('promotion')}
        >
          <View style={styles.featureHeaderLeft}>
            <View style={[styles.featureIcon, { backgroundColor: colors.primary + '20' }]}>
              <Feather name="trending-up" size={18} color={colors.primary} />
            </View>
            <View>
              <Text style={[styles.featureTitle, { color: colors.text }]}>
                Promote Event
              </Text>
              <Text style={[styles.featureSubtitle, { color: colors.textSecondary }]}>
                Get more visibility and attendees
              </Text>
            </View>
          </View>
          
          <Switch
            value={promotion.isPromoted}
            onValueChange={(value) => updatePromotion('isPromoted', value)}
            trackColor={{ false: '#767577', true: colors.primary + '70' }}
            thumbColor={promotion.isPromoted ? colors.primary : '#f4f3f4'}
          />
        </TouchableOpacity>
        
        {expandedSection === 'promotion' && promotion.isPromoted && (
          <View style={styles.featureContent}>
            <Text style={[styles.contentTitle, { color: colors.textSecondary }]}>
              Promotion Level
            </Text>
            
            <View style={styles.promotionOptions}>
              {['basic', 'featured', 'premium'].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.promotionLevel,
                    { 
                      backgroundColor: promotion.promotionLevel === level 
                        ? colors.primary 
                        : colors.surfaceVariant
                    }
                  ]}
                  onPress={() => updatePromotion('promotionLevel', level)}
                >
                  <Text 
                    style={[
                      styles.promotionLevelText,
                      { color: promotion.promotionLevel === level ? '#fff' : colors.text }
                    ]}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                Promotion Budget ($)
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  { backgroundColor: colors.surfaceVariant, color: colors.text }
                ]}
                value={promotion.budget?.toString() || ''}
                onChangeText={(text) => updatePromotion('budget', text ? parseFloat(text) : 0)}
                keyboardType="numeric"
                placeholder="e.g. 100"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>
        )}
      </View>
      
      {/* Skip-the-line Option */}
      <View style={[styles.featureCard, { backgroundColor: colors.card }]}>
        <TouchableOpacity 
          style={styles.featureHeader}
          onPress={() => toggleSection('skipLine')}
        >
          <View style={styles.featureHeaderLeft}>
            <View style={[styles.featureIcon, { backgroundColor: colors.secondary.yellow + '20' }]}>
              <Feather name="fast-forward" size={18} color={colors.secondary.yellow} />
            </View>
            <View>
              <Text style={[styles.featureTitle, { color: colors.text }]}>
                Skip-the-Line Passes
              </Text>
              <Text style={[styles.featureSubtitle, { color: colors.textSecondary }]}>
                Allow attendees to skip the entry line
              </Text>
            </View>
          </View>
          
          <Switch
            value={skipLineOption.enabled}
            onValueChange={(value) => updateSkipLine('enabled', value)}
            trackColor={{ false: '#767577', true: colors.secondary.yellow + '70' }}
            thumbColor={skipLineOption.enabled ? colors.secondary.yellow : '#f4f3f4'}
          />
        </TouchableOpacity>
        
        {expandedSection === 'skipLine' && skipLineOption.enabled && (
          <View style={styles.featureContent}>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                Skip-Line Pass Price ($)
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  { backgroundColor: colors.surfaceVariant, color: colors.text }
                ]}
                value={skipLineOption.price.toString()}
                onChangeText={(text) => updateSkipLine('price', text ? parseFloat(text) : 0)}
                keyboardType="numeric"
                placeholder="e.g. 15"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                Maximum Available Passes
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  { backgroundColor: colors.surfaceVariant, color: colors.text }
                ]}
                value={skipLineOption.maxPurchases.toString()}
                onChangeText={(text) => updateSkipLine('maxPurchases', text ? parseInt(text) : 0)}
                keyboardType="numeric"
                placeholder="e.g. 50"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                Description
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  styles.textArea,
                  { backgroundColor: colors.surfaceVariant, color: colors.text }
                ]}
                value={skipLineOption.description}
                onChangeText={(text) => updateSkipLine('description', text)}
                placeholder="Explain the benefits of the skip-line pass"
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  featureCard: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  featureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  featureHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  featureSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  featureContent: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  contentTitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  promotionOptions: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  promotionLevel: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
  },
  promotionLevelText: {
    fontWeight: '500',
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  textInput: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingVertical: 12,
  },
});

export default PremiumFeaturesSection;