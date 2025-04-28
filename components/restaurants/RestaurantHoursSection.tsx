import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { OpeningHours } from '@/types/restaurant';

interface RestaurantHoursSectionProps {
  openingHours: OpeningHours[];
}

const RestaurantHoursSection: React.FC<RestaurantHoursSectionProps> = ({ 
  openingHours 
}) => {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false);
  
  // Get today's day name
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayHours = openingHours.find(item => item.day === today);
  
  const formatHours = (hours: { from: string, to: string }[]) => {
    if (hours.length === 0) return 'Closed';
    return hours.map(hour => `${hour.from} - ${hour.to}`).join(', ');
  };
  
  return (
    <View style={[styles.container, { borderTopColor: colors.border, borderBottomColor: colors.border }]}>
      <TouchableOpacity 
        style={styles.headerContainer}
        onPress={() => setExpanded(!expanded)}
      >
        <View style={styles.headerLeft}>
          <Feather name="clock" size={20} color={colors.primary} style={styles.icon} />
          <View>
            <Text style={[styles.title, { color: colors.text }]}>Hours</Text>
            {todayHours && (
              <Text style={[styles.todayHours, { color: colors.textSecondary }]}>
                Today: {todayHours.open ? formatHours(todayHours.hours) : 'Closed'}
              </Text>
            )}
          </View>
        </View>
        <Feather 
          name={expanded ? 'chevron-up' : 'chevron-down'} 
          size={20} 
          color={colors.textSecondary} 
        />
      </TouchableOpacity>
      
      {expanded && (
        <View style={styles.hoursContainer}>
          {openingHours.map((item, index) => (
            <View 
              key={item.day} 
              style={[
                styles.hourRow, 
                index < openingHours.length - 1 && { 
                  borderBottomWidth: 1, 
                  borderBottomColor: colors.border 
                }
              ]}
            >
              <Text 
                style={[
                  styles.day, 
                  { color: item.day === today ? colors.primary : colors.text }
                ]}
              >
                {item.day}
              </Text>
              <Text 
                style={[
                  styles.hours, 
                  { 
                    color: item.open 
                      ? (item.day === today ? colors.primary : colors.text) 
                      : colors.textSecondary 
                  }
                ]}
              >
                {item.open ? formatHours(item.hours) : 'Closed'}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginHorizontal: 16,
    marginBottom: 24,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  todayHours: {
    fontSize: 14,
    marginTop: 2,
  },
  hoursContainer: {
    paddingBottom: 16,
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  day: {
    fontWeight: '500',
    fontSize: 14,
  },
  hours: {
    fontSize: 14,
  }
});

export default RestaurantHoursSection;