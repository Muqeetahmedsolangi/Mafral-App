import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FormSection } from '@/components/ui/FormSection';
import { SwitchItem } from '@/components/ui/SwitchItem';
import { useTheme } from '@/context/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { OpeningHours } from '@/types/restaurant';
import DateTimePickerModal from "react-native-modal-datetime-picker";

type Props = {
  hours: OpeningHours[];
  onHoursChange: (hours: OpeningHours[]) => void;
};

export default function RestaurantOpeningHoursSection({ hours, onHoursChange }: Props) {
  const { colors } = useTheme();
  const [selectedDay, setSelectedDay] = React.useState<string | null>(null);
  const [timeType, setTimeType] = React.useState<'from' | 'to'>('from');
  const [selectedHourIndex, setSelectedHourIndex] = React.useState(0);
  const [isTimePickerVisible, setTimePickerVisible] = React.useState(false);

  const formatTime = (timeString: string) => {
    try {
      const date = new Date(`2000-01-01T${timeString}`);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return timeString;
    }
  };

  const handleDayToggle = (dayIndex: number) => {
    const updatedHours = [...hours];
    updatedHours[dayIndex].open = !updatedHours[dayIndex].open;
    onHoursChange(updatedHours);
  };

  const openTimePicker = (day: string, type: 'from' | 'to', hourIndex: number = 0) => {
    setSelectedDay(day);
    setTimeType(type);
    setSelectedHourIndex(hourIndex);
    setTimePickerVisible(true);
  };

  const handleTimeConfirm = (date: Date) => {
    const timeString = date.toTimeString().substring(0, 5);
    if (!selectedDay) return;
    
    const updatedHours = [...hours];
    const dayIndex = updatedHours.findIndex(h => h.day === selectedDay);
    
    if (dayIndex === -1) return;
    
    if (timeType === 'from') {
      updatedHours[dayIndex].hours[selectedHourIndex].from = timeString;
    } else {
      updatedHours[dayIndex].hours[selectedHourIndex].to = timeString;
    }
    
    onHoursChange(updatedHours);
    setTimePickerVisible(false);
  };

  const handleTimeCancel = () => {
    setTimePickerVisible(false);
  };

  const addHoursSlot = (dayIndex: number) => {
    const updatedHours = [...hours];
    updatedHours[dayIndex].hours.push({ from: "09:00", to: "17:00" });
    onHoursChange(updatedHours);
  };

  const removeHoursSlot = (dayIndex: number, slotIndex: number) => {
    const updatedHours = [...hours];
    updatedHours[dayIndex].hours.splice(slotIndex, 1);
    onHoursChange(updatedHours);
  };

  return (
    <FormSection title="Opening Hours">
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        Set your restaurant's opening hours. You can add multiple time slots for each day.
      </Text>

      {hours.map((day, dayIndex) => (
        <View key={day.day} style={styles.dayContainer}>
          <SwitchItem
            label={day.day}
            value={day.open}
            onValueChange={() => handleDayToggle(dayIndex)}
          />

          {day.open && (
            <View style={styles.hoursContainer}>
              {day.hours.map((timeSlot, slotIndex) => (
                <View key={slotIndex} style={styles.timeSlotContainer}>
                  <TouchableOpacity 
                    style={[styles.timeButton, { borderColor: colors.border }]}
                    onPress={() => openTimePicker(day.day, 'from', slotIndex)}
                  >
                    <Text style={{ color: colors.text }}>{formatTime(timeSlot.from)}</Text>
                  </TouchableOpacity>
                  
                  <Text style={[styles.toText, { color: colors.textSecondary }]}>to</Text>
                  
                  <TouchableOpacity 
                    style={[styles.timeButton, { borderColor: colors.border }]}
                    onPress={() => openTimePicker(day.day, 'to', slotIndex)}
                  >
                    <Text style={{ color: colors.text }}>{formatTime(timeSlot.to)}</Text>
                  </TouchableOpacity>

                  {day.hours.length > 1 && (
                    <TouchableOpacity 
                      style={styles.removeButton}
                      onPress={() => removeHoursSlot(dayIndex, slotIndex)}
                    >
                      <Feather name="x" size={20} color={colors.error} />
                    </TouchableOpacity>
                  )}
                </View>
              ))}

              <TouchableOpacity 
                style={[styles.addButton, { borderColor: colors.border }]}
                onPress={() => addHoursSlot(dayIndex)}
              >
                <Feather name="plus" size={16} color={colors.primary} />
                <Text style={{ color: colors.primary, marginLeft: 8 }}>Add Hours</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}

      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleTimeConfirm}
        onCancel={handleTimeCancel}
      />
    </FormSection>
  );
}

const styles = StyleSheet.create({
  description: {
    fontSize: 14,
    marginBottom: 16,
  },
  dayContainer: {
    marginBottom: 16,
  },
  hoursContainer: {
    marginTop: 8,
    marginLeft: 32,
  },
  timeSlotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    minWidth: 90,
    alignItems: 'center',
  },
  toText: {
    marginHorizontal: 8,
  },
  removeButton: {
    padding: 8,
    marginLeft: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderWidth: 1,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
});