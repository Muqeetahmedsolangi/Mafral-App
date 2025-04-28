import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';

interface SectionHeaderProps {
  title: string;
  onViewAllPress?: () => void;
  iconName?: keyof typeof Feather.glyphMap;
  iconColor?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  title, 
  onViewAllPress, 
  iconName, 
  iconColor 
}) => {
  const { colors } = useTheme();
  
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTitleContainer}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {title}
        </Text>
        {iconName && (
          <Feather name={iconName} size={16} color={iconColor || colors.primary} />
        )}
      </View>
      
      {onViewAllPress && (
        <TouchableOpacity onPress={onViewAllPress}>
          <Text style={[styles.viewAllText, { color: colors.primary }]}>
            VIEW ALL
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 6,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default SectionHeader;