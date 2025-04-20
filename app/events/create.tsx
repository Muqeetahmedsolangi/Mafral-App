import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { router, Stack } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/Button';
import { MOCK_CATEGORIES } from '@/constants/MockData';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import MapView, { Marker } from 'react-native-maps';
import { Category } from '@/types/events';

// Define types for the form state
interface TicketType {
  type: string;
  price: string;
  available: string;
}

interface LocationData {
  latitude: number;
  longitude: number;
}

interface EventForm {
  title: string;
  description: string;
  coverImage: string | null;
  startDate: Date;
  endDate: Date;
  category: Category | null;
  location: LocationData | null;
  locationAddress: string;
  ticketTypes: TicketType[];
}

// Location Selection Modal Component
interface LocationSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  colors: any;
  onSelectLocation: (location: any, address: string) => void;
  initialLocation: any | null;
}

// Simple placeholder for LocationSelectionModal
// In a real app, you would create this as a separate component
const LocationSelectionModal: React.FC<LocationSelectionModalProps> = ({ 
  visible, 
  onClose, 
  colors, 
  onSelectLocation, 
  initialLocation 
}) => {
  // This is a placeholder. In a real app, implement a proper modal with map selection
  if (!visible) return null;
  
  return (
    <View style={[styles.modalContainer, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
      <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
        <Text style={[styles.modalTitle, { color: colors.text }]}>Select Location</Text>
        <Text style={{ color: colors.textSecondary, marginBottom: 20 }}>
          This is a placeholder. In a real implementation, include a map for location selection.
        </Text>
        
        {/* For testing purposes - simulate selecting a location */}
        <Button 
          title="Select Demo Location" 
          onPress={() => onSelectLocation({
            coords: {
              latitude: 23.7783,
              longitude: 90.3756,
            }
          }, "123 Main Street, Dhaka, Bangladesh")} 
          variant="primary"
          style={{ marginBottom: 10 }}
        />
        <Button 
          title="Cancel" 
          onPress={onClose} 
          variant="outline"
        />
      </View>
    </View>
  );
};

export default function CreateEventScreen() {
  const { colors } = useTheme();
  const [form, setForm] = useState<EventForm>({
    title: '',
    description: '',
    coverImage: null,
    startDate: new Date(),
    endDate: new Date(Date.now() + 3600000), // 1 hour from now
    category: null,
    location: null,
    locationAddress: '',
    ticketTypes: [{ type: 'General Admission', price: '0', available: '100' }],
  });
  
  // UI states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState<'date' | 'time'>('date');
  const [currentDateField, setCurrentDateField] = useState<'startDate' | 'endDate'>('startDate');
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setForm({
        ...form,
        coverImage: result.assets[0].uri,
      });
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || form[currentDateField];
    setShowDatePicker(Platform.OS === 'ios'); // Only iOS uses manual dismissal
    
    if (selectedDate) {
      setForm({
        ...form,
        [currentDateField]: currentDate,
      });
    }
  };

  const showDateTimePicker = (mode: 'date' | 'time', field: 'startDate' | 'endDate') => {
    setShowDatePicker(true);
    setDatePickerMode(mode);
    setCurrentDateField(field);
  };

  const handleLocationSelect = (newLocation: any, address: string) => {
    setForm({
      ...form,
      location: {
        latitude: newLocation.coords.latitude,
        longitude: newLocation.coords.longitude,
      },
      locationAddress: address,
    });
    setIsLocationModalVisible(false);
  };

  const handleTicketChange = (index: number, field: keyof TicketType, value: string) => {
    const updatedTickets = [...form.ticketTypes];
    updatedTickets[index] = {
      ...updatedTickets[index],
      [field]: value,
    };
    setForm({
      ...form,
      ticketTypes: updatedTickets,
    });
  };

  const addTicketType = () => {
    setForm({
      ...form,
      ticketTypes: [
        ...form.ticketTypes,
        { type: `Ticket ${form.ticketTypes.length + 1}`, price: '0', available: '50' },
      ],
    });
  };

  const removeTicketType = (index: number) => {
    if (form.ticketTypes.length <= 1) {
      Alert.alert('Cannot Remove', 'You need at least one ticket type');
      return;
    }
    
    const updatedTickets = form.ticketTypes.filter((_, i) => i !== index);
    setForm({
      ...form,
      ticketTypes: updatedTickets,
    });
  };

  const handleCreateEvent = () => {
    // Validate form
    if (!form.title || !form.description || !form.coverImage || !form.category || !form.location) {
      Alert.alert('Missing Information', 'Please fill all required fields');
      return;
    }
    
    // In a real app, you would submit to an API
    console.log('Creating event:', form);
    
    Alert.alert(
      'Event Created',
      'Your event has been successfully created!',
      [
        {
          text: 'View Event',
          onPress: () => router.push(`/events/123`),
        },
        {
          text: 'Go to Events',
          onPress: () => router.push('/events'),
        },
      ]
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <Stack.Screen options={{ title: "Create Event", headerShown: false }} />
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => router.back()}>
              <Feather name="arrow-left" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Create Event</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.content}>
            {/* Cover Image */}
            <TouchableOpacity
              style={[
                styles.coverImageContainer,
                { backgroundColor: colors.surfaceVariant }
              ]}
              onPress={handleImagePick}
            >
              {form.coverImage ? (
                <Image source={{ uri: form.coverImage }} style={styles.coverImage} />
              ) : (
                <View style={styles.coverImagePlaceholder}>
                  <Feather name="image" size={40} color={colors.textSecondary} />
                  <Text style={[styles.coverImageText, { color: colors.textSecondary }]}>
                    Upload cover image
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Basic Info */}
            <View style={styles.formSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Basic Information</Text>
              
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Event Title</Text>
                <TextInput
                  style={[styles.textInput, { backgroundColor: colors.surfaceVariant, color: colors.text }]}
                  placeholder="Enter event title"
                  placeholderTextColor={colors.textSecondary}
                  value={form.title}
                  onChangeText={(text) => setForm({ ...form, title: text })}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Description</Text>
                <TextInput
                  style={[
                    styles.textInput, 
                    styles.textArea,
                    { backgroundColor: colors.surfaceVariant, color: colors.text }
                  ]}
                  placeholder="Describe your event"
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  numberOfLines={5}
                  value={form.description}
                  onChangeText={(text) => setForm({ ...form, description: text })}
                />
              </View>
            </View>

            {/* Category */}
            <View style={styles.formSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Category</Text>
              
              <TouchableOpacity
                style={[styles.pickerButton, { backgroundColor: colors.surfaceVariant }]}
                onPress={() => setShowCategoryPicker(!showCategoryPicker)}
              >
                {form.category ? (
                  <View style={styles.selectedCategory}>
                    <View 
                      style={[
                        styles.categoryIcon, 
                        { backgroundColor: form.category.color || colors.primary }
                      ]}
                    >
                      <Feather name={form.category.icon as any} size={16} color="#FFFFFF" />
                    </View>
                    <Text style={[styles.selectedCategoryText, { color: colors.text }]}>
                      {form.category.name}
                    </Text>
                  </View>
                ) : (
                  <Text style={[styles.pickerButtonText, { color: colors.textSecondary }]}>
                    Select a category
                  </Text>
                )}
                <Feather 
                  name={showCategoryPicker ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color={colors.textSecondary} 
                />
              </TouchableOpacity>
              
              {showCategoryPicker && (
                <View style={[styles.categoryList, { backgroundColor: colors.card }]}>
                  {MOCK_CATEGORIES.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={styles.categoryOption}
                      onPress={() => {
                        setForm({ ...form, category });
                        setShowCategoryPicker(false);
                      }}
                    >
                      <View 
                        style={[styles.categoryIcon, { backgroundColor: category.color }]}
                      >
                        <Feather name={category.icon as any} size={16} color="#FFFFFF" />
                      </View>
                      <Text style={[styles.categoryOptionText, { color: colors.text }]}>
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Date & Time */}
            <View style={styles.formSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Date & Time</Text>
              
              <View style={styles.dateTimeContainer}>
                <View style={styles.dateTimeColumn}>
                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Start Date</Text>
                  <TouchableOpacity
                    style={[styles.dateTimeButton, { backgroundColor: colors.surfaceVariant }]}
                    onPress={() => showDateTimePicker('date', 'startDate')}
                  >
                    <Feather name="calendar" size={16} color={colors.textSecondary} />
                    <Text style={[styles.dateTimeText, { color: colors.text }]}>
                      {formatDate(form.startDate)}
                    </Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.dateTimeColumn}>
                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Start Time</Text>
                  <TouchableOpacity
                    style={[styles.dateTimeButton, { backgroundColor: colors.surfaceVariant }]}
                    onPress={() => showDateTimePicker('time', 'startDate')}
                  >
                    <Feather name="clock" size={16} color={colors.textSecondary} />
                    <Text style={[styles.dateTimeText, { color: colors.text }]}>
                      {formatTime(form.startDate)}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.dateTimeContainer}>
                <View style={styles.dateTimeColumn}>
                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>End Date</Text>
                  <TouchableOpacity
                    style={[styles.dateTimeButton, { backgroundColor: colors.surfaceVariant }]}
                    onPress={() => showDateTimePicker('date', 'endDate')}
                  >
                    <Feather name="calendar" size={16} color={colors.textSecondary} />
                    <Text style={[styles.dateTimeText, { color: colors.text }]}>
                      {formatDate(form.endDate)}
                    </Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.dateTimeColumn}>
                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>End Time</Text>
                  <TouchableOpacity
                    style={[styles.dateTimeButton, { backgroundColor: colors.surfaceVariant }]}
                    onPress={() => showDateTimePicker('time', 'endDate')}
                  >
                    <Feather name="clock" size={16} color={colors.textSecondary} />
                    <Text style={[styles.dateTimeText, { color: colors.text }]}>
                      {formatTime(form.endDate)}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {showDatePicker && (
                <DateTimePicker
                  value={form[currentDateField]}
                  mode={datePickerMode}
                  is24Hour={false}
                  display="default"
                  onChange={handleDateChange}
                />
              )}
            </View>

            {/* Location */}
            <View style={styles.formSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Location</Text>
              
              <TouchableOpacity
                style={[styles.locationButton, { backgroundColor: colors.surfaceVariant }]}
                onPress={() => setIsLocationModalVisible(true)}
              >
                <Feather name="map-pin" size={20} color={colors.textSecondary} />
                
                {form.locationAddress ? (
                  <Text style={[styles.locationText, { color: colors.text }]} numberOfLines={2}>
                    {form.locationAddress}
                  </Text>
                ) : (
                  <Text style={[styles.locationPlaceholder, { color: colors.textSecondary }]}>
                    Select event location
                  </Text>
                )}
              </TouchableOpacity>

              {form.location && (
                <View style={styles.locationPreviewContainer}>
                  <View style={styles.locationPreviewMap}>
                    <MapView
                      style={styles.locationMapPreview}
                      initialRegion={{
                        latitude: form.location.latitude,
                        longitude: form.location.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                      }}
                      scrollEnabled={false}
                      zoomEnabled={false}
                    >
                      <Marker
                        coordinate={{
                          latitude: form.location.latitude,
                          longitude: form.location.longitude,
                        }}
                        pinColor={colors.primary}
                      />
                    </MapView>
                  </View>
                </View>
              )}
            </View>

            {/* Tickets */}
            <View style={styles.formSection}>
              <View style={styles.sectionHeaderRow}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Tickets</Text>
                <TouchableOpacity
                  style={[styles.addButton, { backgroundColor: colors.primary }]}
                  onPress={addTicketType}
                >
                  <Feather name="plus" size={16} color="#FFFFFF" />
                  <Text style={styles.addButtonText}>Add Ticket</Text>
                </TouchableOpacity>
              </View>
              
              {form.ticketTypes.map((ticket, index) => (
                <View key={index} style={[styles.ticketCard, { backgroundColor: colors.card }]}>
                  <View style={styles.ticketCardHeader}>
                    <Text style={[styles.ticketCardTitle, { color: colors.text }]}>
                      Ticket Type {index + 1}
                    </Text>
                    <TouchableOpacity onPress={() => removeTicketType(index)}>
                      <Feather name="trash-2" size={20} color={colors.danger} />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Name</Text>
                    <TextInput
                      style={[styles.textInput, { backgroundColor: colors.surfaceVariant, color: colors.text }]}
                      placeholder="Ticket name"
                      placeholderTextColor={colors.textSecondary}
                      value={ticket.type}
                      onChangeText={(text) => handleTicketChange(index, 'type', text)}
                    />
                  </View>
                  
                  <View style={styles.ticketDetailsRow}>
                    <View style={styles.ticketDetailInput}>
                      <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Price</Text>
                      <View style={[styles.priceInputContainer, { backgroundColor: colors.surfaceVariant }]}>
                        <Text style={[styles.currencySymbol, { color: colors.text }]}>$</Text>
                        <TextInput
                          style={[styles.priceInput, { color: colors.text }]}
                          placeholder="0"
                          placeholderTextColor={colors.textSecondary}
                          keyboardType="numeric"
                          value={ticket.price}
                          onChangeText={(text) => handleTicketChange(index, 'price', text)}
                        />
                      </View>
                    </View>
                    
                    <View style={styles.ticketDetailInput}>
                      <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Quantity</Text>
                      <TextInput
                        style={[styles.textInput, { backgroundColor: colors.surfaceVariant, color: colors.text }]}
                        placeholder="100"
                        placeholderTextColor={colors.textSecondary}
                        keyboardType="numeric"
                        value={ticket.available}
                        onChangeText={(text) => handleTicketChange(index, 'available', text)}
                      />
                    </View>
                  </View>
                </View>
              ))}
            </View>

            <View style={{ height: 100 }} />
          </ScrollView>

          {/* Create Button */}
          <View style={[styles.bottomBar, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
            <Button
              title="Create Event"
              variant="primary"
              size="large"
              onPress={handleCreateEvent}
              style={{ flex: 1 }}
            />
          </View>

          {/* Location Selection Modal */}
          <LocationSelectionModal
            visible={isLocationModalVisible}
            onClose={() => setIsLocationModalVisible(false)}
            colors={colors}
            onSelectLocation={handleLocationSelect}
            initialLocation={form.location ? {
              coords: {
                latitude: form.location.latitude,
                longitude: form.location.longitude,
              },
              timestamp: Date.now(),
            } : null}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  coverImageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverImagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverImageText: {
    marginTop: 12,
    fontSize: 16,
  },
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    marginLeft: 4,
    fontWeight: '500',
    fontSize: 12,
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
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  pickerButtonText: {
    fontSize: 16,
  },
  selectedCategory: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  selectedCategoryText: {
    fontSize: 16,
  },
  categoryList: {
    borderRadius: 12,
    marginTop: 4,
    paddingVertical: 8,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  categoryOptionText: {
    fontSize: 16,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  dateTimeColumn: {
    flex: 1,
    marginRight: 8,
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  dateTimeText: {
    marginLeft: 8,
    fontSize: 14,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  locationText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  locationPlaceholder: {
    marginLeft: 12,
    fontSize: 16,
  },
  locationPreviewContainer: {
    marginTop: 12,
  },
  locationPreviewMap: {
    height: 150,
    borderRadius: 12,
    overflow: 'hidden',
  },
  locationMapPreview: {
    flex: 1,
  },
  ticketCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  ticketCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ticketCardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  ticketDetailsRow: {
    flexDirection: 'row',
    marginHorizontal: -4,
  },
  ticketDetailInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  currencySymbol: {
    fontSize: 16,
    marginRight: 4,
  },
  priceInput: {
    flex: 1,
    fontSize: 16,
  },
  bottomBar: {
    padding: 16,
    borderTopWidth: 1,
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    width: '80%',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
});