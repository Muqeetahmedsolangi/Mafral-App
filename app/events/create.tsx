import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router, Stack } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/Button';
import { MOCK_CATEGORIES } from '@/constants/MockData';
import DateTimePicker from '@react-native-community/datetimepicker';
import { EventFormExtended, EventPromotion, PromoCode, SkipLineOption, Category } from '@/types/events';

// Import all the component modules
import ImageGalleryUploader from '@/components/events/ImageGalleryUploader';
import LocationPicker from '@/components/events/LocationPicker';
import TagInput from '@/components/events/TagInput';
import PremiumFeaturesSection from '@/components/events/PremiumFeaturesSection';
import PromoCodesManager from '@/components/events/PromoCodesManager';
import EventSuccessScreen from '@/components/events/EventSuccessScreen';

// Define types for the form state
interface TicketType {
  id: string;
  type: string;
  price: number;
  currency: string;
  description?: string;
  available: number;
  sold: number;
}

export default function CreateEventScreen() {
  const { colors } = useTheme();
  
  // Initialize with default values
  const [form, setForm] = useState<EventFormExtended>({
    title: '',
    description: '',
    date: {
      start: new Date().toISOString(),
      end: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
    },
    location: {
      name: '',
      address: '',
      city: '',
      country: '',
    },
    images: [],
    promotion: {
      isPromoted: false,
      promotionLevel: 'basic',
      startDate: null,
      endDate: null,
      budget: 100,
    },
    skipLineOption: {
      enabled: false,
      price: 20,
      maxPurchases: 50,
      description: 'Skip the entry line and get immediate access to the event.',
    },
    promoCodes: [],
    tags: [],
  });
  
  // Form fields for additional properties
  const [category, setCategory] = useState<Category | null>(null);
  const [tickets, setTickets] = useState<TicketType[]>([
    {
      id: 'ticket-1',
      type: 'General Admission',
      price: 0,
      currency: 'USD',
      description: 'Standard entry to the event',
      available: 100,
      sold: 0,
    }
  ]);
  
  // UI states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState<'date' | 'time'>('date');
  const [currentDateField, setCurrentDateField] = useState<'start' | 'end'>('start');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [mapCoordinates, setMapCoordinates] = useState<{latitude: number, longitude: number} | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [createdEventId, setCreatedEventId] = useState<string | null>(null);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios'); // Only iOS uses manual dismissal
    
    if (selectedDate) {
      const updatedDate = { ...form.date };
      
      if (currentDateField === 'start') {
        updatedDate.start = selectedDate.toISOString();
      } else {
        updatedDate.end = selectedDate.toISOString();
      }
      
      setForm({
        ...form,
        date: updatedDate,
      });
    }
  };

  const showDateTimePicker = (mode: 'date' | 'time', field: 'start' | 'end') => {
    setShowDatePicker(true);
    setDatePickerMode(mode);
    setCurrentDateField(field);
  };

  const handleImageChange = (images: any[]) => {
    setForm({
      ...form,
      images,
    });
  };

  const handleLocationChange = (coordinates: { latitude: number; longitude: number }, address: string) => {
    // Parse address to extract city, country, etc.
    const addressParts = address.split(', ');
    
    setMapCoordinates(coordinates);
    setForm({
      ...form,
      location: {
        name: addressParts[0] || '',
        address: address,
        city: addressParts.length > 1 ? addressParts[1] : '',
        country: addressParts.length > 2 ? addressParts[addressParts.length - 1] : '',
      }
    });
  };

  const handleTicketChange = (index: number, field: keyof TicketType, value: any) => {
    const updatedTickets = [...tickets];
    updatedTickets[index] = {
      ...updatedTickets[index],
      [field]: value,
    };
    setTickets(updatedTickets);
  };

  const addTicketType = () => {
    const newTicketId = `ticket-${tickets.length + 1}`;
    setTickets([
      ...tickets,
      {
        id: newTicketId,
        type: `Ticket Type ${tickets.length + 1}`,
        price: 0,
        currency: 'USD',
        description: '',
        available: 50,
        sold: 0,
      },
    ]);
  };

  const removeTicketType = (index: number) => {
    if (tickets.length <= 1) {
      Alert.alert('Cannot Remove', 'You need at least one ticket type');
      return;
    }
    
    const updatedTickets = tickets.filter((_, i) => i !== index);
    setTickets(updatedTickets);
  };

  const handleTagsChange = (tags: string[]) => {
    setForm({
      ...form,
      tags,
    });
  };

  const handlePromotionChange = (promotion: EventPromotion) => {
    setForm({
      ...form,
      promotion,
    });
  };

  const handleSkipLineChange = (skipLineOption: SkipLineOption) => {
    setForm({
      ...form,
      skipLineOption,
    });
  };

  const handlePromoCodesChange = (promoCodes: PromoCode[]) => {
    setForm({
      ...form,
      promoCodes,
    });
  };

  const validateForm = () => {
    if (!form.title.trim()) {
      Alert.alert('Missing Information', 'Please enter an event title');
      return false;
    }
    
    if (!form.description.trim()) {
      Alert.alert('Missing Information', 'Please enter an event description');
      return false;
    }
    
    if (form.images.length === 0) {
      Alert.alert('Missing Information', 'Please add at least one event image');
      return false;
    }
    
    if (!category) {
      Alert.alert('Missing Information', 'Please select a category');
      return false;
    }
    
    if (!form.location.address) {
      Alert.alert('Missing Information', 'Please select a location');
      return false;
    }
    
    return true;
  };

  const handleCreateEvent = () => {
    if (!validateForm()) return;
    
    // Combine all data for the complete event object
    const eventData = {
      ...form,
      category,
      tickets,
      location: {
        ...form.location,
        coordinates: mapCoordinates || { latitude: 0, longitude: 0 },
      },
    };
    
    setIsSubmitting(true);
    
    // In a real app, you would submit to an API
    // Here we simulate the API call with setTimeout
    console.log('Creating event:', eventData);
    
    setTimeout(() => {
      // Generate a random event ID
      const newEventId = 'event-' + Math.floor(Math.random() * 10000);
      setCreatedEventId(newEventId);
      
      // In a real app, you would store the created event data in AsyncStorage or API
      // For demo purposes, we just generate an ID and show the success screen
      
      setIsSubmitting(false);
      setShowSuccessScreen(true);
    }, 1500);
  };

  const goToNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSuccessScreenClose = () => {
    setShowSuccessScreen(false);
    if (createdEventId) {
      router.push(`/events/${createdEventId}`);
    } else {
      router.back();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const stepIndicators = [
    {
      title: 'Basic Info',
      sections: ['images', 'basic', 'category'],
    },
    {
      title: 'Date & Location',
      sections: ['datetime', 'location'],
    },
    {
      title: 'Tickets',
      sections: ['tickets'],
    },
    {
      title: 'Extras',
      sections: ['premium', 'promo'],
    },
  ];

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

          {/* Step Indicators */}
          <View style={styles.stepIndicatorContainer}>
            <View style={styles.stepIndicatorLine} />
            {stepIndicators.map((step, index) => (
              <View
                key={index}
                style={[
                  styles.stepDot,
                  {
                    backgroundColor: currentStep > index ? colors.primary : currentStep === index + 1 ? colors.primary : colors.border,
                    borderColor: currentStep === index + 1 ? colors.primary : 'transparent',
                  },
                ]}
              >
                <Text style={[
                  styles.stepNumber,
                  { color: currentStep > index || currentStep === index + 1 ? '#FFF' : colors.textSecondary }
                ]}>
                  {index + 1}
                </Text>
              </View>
            ))}
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <>
                {/* Event Images */}
                <View style={styles.formSection}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Event Images</Text>
                  <ImageGalleryUploader 
                    images={form.images}
                    onImagesChange={handleImageChange}
                    maxImages={5}
                  />
                </View>

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
                  
                  <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Tags</Text>
                    <TagInput
                      tags={form.tags}
                      onTagsChange={handleTagsChange}
                      maxTags={10}
                      placeholder="Add tags (press space or comma to add)"
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
                    {category ? (
                      <View style={styles.selectedCategory}>
                        <View 
                          style={[
                            styles.categoryIcon, 
                            { backgroundColor: category.color || colors.primary }
                          ]}
                        >
                          <Feather name={category.icon as any} size={16} color="#FFFFFF" />
                        </View>
                        <Text style={[styles.selectedCategoryText, { color: colors.text }]}>
                          {category.name}
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
                      {MOCK_CATEGORIES.map((cat) => (
                        <TouchableOpacity
                          key={cat.id}
                          style={styles.categoryOption}
                          onPress={() => {
                            setCategory(cat);
                            setShowCategoryPicker(false);
                          }}
                        >
                          <View 
                            style={[styles.categoryIcon, { backgroundColor: cat.color }]}
                          >
                            <Feather name={cat.icon as any} size={16} color="#FFFFFF" />
                          </View>
                          <Text style={[styles.categoryOptionText, { color: colors.text }]}>
                            {cat.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              </>
            )}

            {/* Step 2: Date & Location */}
            {currentStep === 2 && (
              <>
                {/* Date & Time */}
                <View style={styles.formSection}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Date & Time</Text>
                  
                  <View style={styles.dateTimeContainer}>
                    <View style={styles.dateTimeColumn}>
                      <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Start Date</Text>
                      <TouchableOpacity
                        style={[styles.dateTimeButton, { backgroundColor: colors.surfaceVariant }]}
                        onPress={() => showDateTimePicker('date', 'start')}
                      >
                        <Feather name="calendar" size={16} color={colors.textSecondary} />
                        <Text style={[styles.dateTimeText, { color: colors.text }]}>
                          {formatDate(form.date.start)}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    
                    <View style={styles.dateTimeColumn}>
                      <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Start Time</Text>
                      <TouchableOpacity
                        style={[styles.dateTimeButton, { backgroundColor: colors.surfaceVariant }]}
                        onPress={() => showDateTimePicker('time', 'start')}
                      >
                        <Feather name="clock" size={16} color={colors.textSecondary} />
                        <Text style={[styles.dateTimeText, { color: colors.text }]}>
                          {formatTime(form.date.start)}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  <View style={styles.dateTimeContainer}>
                    <View style={styles.dateTimeColumn}>
                      <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>End Date</Text>
                      <TouchableOpacity
                        style={[styles.dateTimeButton, { backgroundColor: colors.surfaceVariant }]}
                        onPress={() => showDateTimePicker('date', 'end')}
                      >
                        <Feather name="calendar" size={16} color={colors.textSecondary} />
                        <Text style={[styles.dateTimeText, { color: colors.text }]}>
                          {formatDate(form.date.end)}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    
                    <View style={styles.dateTimeColumn}>
                      <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>End Time</Text>
                      <TouchableOpacity
                        style={[styles.dateTimeButton, { backgroundColor: colors.surfaceVariant }]}
                        onPress={() => showDateTimePicker('time', 'end')}
                      >
                        <Feather name="clock" size={16} color={colors.textSecondary} />
                        <Text style={[styles.dateTimeText, { color: colors.text }]}>
                          {formatTime(form.date.end)}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {showDatePicker && (
                    <DateTimePicker
                      value={new Date(currentDateField === 'start' ? form.date.start : form.date.end)}
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
                  <LocationPicker 
                    location={mapCoordinates}
                    address={form.location.address}
                    onLocationChange={handleLocationChange}
                  />
                </View>
              </>
            )}

            {/* Step 3: Tickets */}
            {currentStep === 3 && (
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
                
                {tickets.map((ticket, index) => (
                  <View key={ticket.id} style={[styles.ticketCard, { backgroundColor: colors.card }]}>
                    <View style={styles.ticketCardHeader}>
                      <Text style={[styles.ticketCardTitle, { color: colors.text }]}>
                        Ticket Type {index + 1}
                      </Text>
                      <TouchableOpacity onPress={() => removeTicketType(index)}>
                        <Feather name="trash-2" size={20} color={colors.danger || "#FF6B6B"} />
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
                    
                    <View style={styles.inputGroup}>
                      <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Description (optional)</Text>
                      <TextInput
                        style={[styles.textInput, { backgroundColor: colors.surfaceVariant, color: colors.text }]}
                        placeholder="Ticket description"
                        placeholderTextColor={colors.textSecondary}
                        value={ticket.description || ''}
                        onChangeText={(text) => handleTicketChange(index, 'description', text)}
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
                            value={ticket.price.toString()}
                            onChangeText={(text) => handleTicketChange(index, 'price', text ? parseFloat(text) : 0)}
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
                          value={ticket.available.toString()}
                          onChangeText={(text) => handleTicketChange(index, 'available', text ? parseInt(text) : 0)}
                        />
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Step 4: Premium Features & Promo Codes */}
            {currentStep === 4 && (
              <>
                {/* Premium Features */}
                <PremiumFeaturesSection 
                  promotion={form.promotion}
                  skipLineOption={form.skipLineOption}
                  onPromotionChange={handlePromotionChange}
                  onSkipLineOptionChange={handleSkipLineChange}
                />

                {/* Promo Codes */}
                <PromoCodesManager
                  promoCodes={form.promoCodes}
                  onPromoCodesChange={handlePromoCodesChange}
                />
              </>
            )}

            <View style={{ height: 100 }} />
          </ScrollView>

          {/* Navigation Buttons */}
          <View style={[styles.bottomBar, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
            {currentStep > 1 && (
              <Button
                title="Previous"
                variant="secondary"
                size="large"
                onPress={goToPreviousStep}
                style={{ flex: 1, marginRight: 8 }}
              />
            )}
            
            {currentStep < 4 ? (
              <Button
                title="Next"
                variant="primary"
                size="large"
                onPress={goToNextStep}
                style={{ flex: currentStep > 1 ? 1 : 2 }}
              />
            ) : (
              <Button
                title={isSubmitting ? "Creating..." : "Create Event"}
                variant="primary"
                size="large"
                onPress={handleCreateEvent}
                style={{ flex: 1 }}
                disabled={isSubmitting}
                loading={isSubmitting}
              />
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* Success Screen Component */}
      <EventSuccessScreen
        visible={showSuccessScreen}
        eventId={createdEventId}
        onClose={handleSuccessScreenClose}
        message="It takes less than 24hrs to display events with MAFRAL"
        showViewEventButton={true}
      />
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
  // Step Indicators
  stepIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingVertical: 16,
    position: 'relative',
  },
  stepIndicatorLine: {
    position: 'absolute',
    top: '50%',
    left: 50,
    right: 50,
    height: 2,
    backgroundColor: '#ddd',
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    borderWidth: 3,
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    padding: 16,
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
    flexDirection: 'row',
  },
});