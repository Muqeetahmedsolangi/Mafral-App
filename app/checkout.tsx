import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { getEventById } from '@/constants/MockData';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/Button';

export default function CheckoutScreen() {
  const { colors } = useTheme();
  const { eventId, ticketId } = useLocalSearchParams();
  const event = getEventById(eventId as string);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isLoading, setIsLoading] = useState(false);
  
  if (!event) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Event not found</Text>
      </View>
    );
  }
  
  const ticket = event.tickets.find(t => t.id === ticketId) || event.tickets[0];
  const startDate = parseISO(event.date.start);
  const formattedDate = format(startDate, 'EEEE, MMMM d, yyyy');
  
  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };
  
  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
  };
  
  const handleCompleteCheckout = () => {
    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.email) {
      Alert.alert('Missing Information', 'Please fill all required fields');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Purchase Complete!',
        'Your ticket has been booked successfully. Check your email for details.',
        [
          {
            text: 'View Ticket',
            onPress: () => router.push(`/tickets/${event.id}`),
          },
          {
            text: 'Back to Events',
            onPress: () => router.push('/events'),
          },
        ]
      );
    }, 2000);
  };
  
  return (
    <>
      <Stack.Screen
        options={{
          title: "Checkout",
          headerBackTitle: "Event Details",
        }}
      />
      <StatusBar style="dark" />
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Event Summary */}
          <View style={[styles.eventSummary, { backgroundColor: colors.card }]}>
            <Image source={{ uri: event.coverImage }} style={styles.eventImage} />
            <View style={styles.eventInfo}>
              <Text style={[styles.eventTitle, { color: colors.text }]} numberOfLines={1}>
                {event.title}
              </Text>
              <Text style={[styles.eventDate, { color: colors.textSecondary }]}>
                {formattedDate}
              </Text>
              <Text style={[styles.eventLocation, { color: colors.textSecondary }]} numberOfLines={1}>
                {event.location.name}
              </Text>
            </View>
          </View>
          
          {/* Ticket Details */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Ticket Details</Text>
            <View style={[styles.ticketCard, { backgroundColor: colors.card }]}>
              <View style={styles.ticketRow}>
                <Text style={[styles.ticketLabel, { color: colors.textSecondary }]}>Type</Text>
                <Text style={[styles.ticketValue, { color: colors.text }]}>
                  {ticket.type}
                </Text>
              </View>
              <View style={styles.ticketRow}>
                <Text style={[styles.ticketLabel, { color: colors.textSecondary }]}>Price</Text>
                <Text style={[styles.ticketValue, { color: colors.text }]}>
                  {ticket.price === 0 ? "FREE" : `${ticket.currency} ${ticket.price.toFixed(2)}`}
                </Text>
              </View>
              <View style={styles.ticketRow}>
                <Text style={[styles.ticketLabel, { color: colors.textSecondary }]}>Quantity</Text>
                <Text style={[styles.ticketValue, { color: colors.text }]}>1</Text>
              </View>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <View style={styles.ticketRow}>
                <Text style={[styles.ticketTotalLabel, { color: colors.text }]}>Total</Text>
                <Text style={[styles.ticketTotalValue, { color: colors.primary }]}>
                  {ticket.price === 0 ? "FREE" : `${ticket.currency} ${ticket.price.toFixed(2)}`}
                </Text>
              </View>
            </View>
          </View>
          
          {/* Attendee Information */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Attendee Information</Text>
            <View style={styles.formGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>First Name *</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.surfaceVariant, color: colors.text }]}
                placeholder="Enter your first name"
                placeholderTextColor={colors.textSecondary}
                value={formData.firstName}
                onChangeText={(text) => handleInputChange('firstName', text)}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Last Name *</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.surfaceVariant, color: colors.text }]}
                placeholder="Enter your last name"
                placeholderTextColor={colors.textSecondary}
                value={formData.lastName}
                onChangeText={(text) => handleInputChange('lastName', text)}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Email Address *</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.surfaceVariant, color: colors.text }]}
                placeholder="Enter your email address"
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                value={formData.email}
                onChangeText={(text) => handleInputChange('email', text)}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Phone Number</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.surfaceVariant, color: colors.text }]}
                placeholder="Enter your phone number"
                placeholderTextColor={colors.textSecondary}
                keyboardType="phone-pad"
                value={formData.phone}
                onChangeText={(text) => handleInputChange('phone', text)}
              />
            </View>
          </View>
          
          {/* Payment Method - Only show if not free */}
          {ticket.price > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Payment Method</Text>
              <View style={styles.paymentOptions}>
                <TouchableOpacity
                  style={[
                    styles.paymentOption,
                    paymentMethod === 'card' && { borderColor: colors.primary },
                    { backgroundColor: colors.card }
                  ]}
                  onPress={() => handlePaymentMethodChange('card')}
                >
                  <Feather
                    name="credit-card"
                    size={20}
                    color={paymentMethod === 'card' ? colors.primary : colors.textSecondary}
                    style={styles.paymentIcon}
                  />
                  <View style={styles.paymentText}>
                    <Text style={[styles.paymentTitle, { color: colors.text }]}>Card Payment</Text>
                    <Text style={[styles.paymentDescription, { color: colors.textSecondary }]}>
                      Pay with Visa, MasterCard, etc.
                    </Text>
                  </View>
                  {paymentMethod === 'card' && (
                    <Feather name="check-circle" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.paymentOption,
                    paymentMethod === 'paypal' && { borderColor: colors.primary },
                    { backgroundColor: colors.card }
                  ]}
                  onPress={() => handlePaymentMethodChange('paypal')}
                >
                  <Feather
                    name="credit-card"
                    size={20}
                    color={paymentMethod === 'paypal' ? colors.primary : colors.textSecondary}
                    style={styles.paymentIcon}
                  />
                  <View style={styles.paymentText}>
                    <Text style={[styles.paymentTitle, { color: colors.text }]}>PayPal</Text>
                    <Text style={[styles.paymentDescription, { color: colors.textSecondary }]}>
                      Fast and secure payment with PayPal
                    </Text>
                  </View>
                  {paymentMethod === 'paypal' && (
                    <Feather name="check-circle" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
          
          <View style={{ height: 100 }} />
        </ScrollView>
        
        {/* Complete Purchase Button */}
        <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
          <Button
            title={ticket.price === 0 ? "Complete Registration" : "Complete Purchase"}
            variant="primary"
            size="large"
            loading={isLoading}
            onPress={handleCompleteCheckout}
            style={{ width: '100%' }}
          />
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  eventSummary: {
    flexDirection: 'row',
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  eventImage: {
    width: 80,
    height: 80,
  },
  eventInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 12,
    marginBottom: 2,
  },
  eventLocation: {
    fontSize: 12,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  ticketCard: {
    borderRadius: 12,
    padding: 16,
  },
  ticketRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  ticketLabel: {
    fontSize: 14,
  },
  ticketValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  ticketTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  ticketTotalValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  formGroup: {
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
  paymentOptions: {
    gap: 12,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: 12,
  },
  paymentIcon: {
    marginRight: 12,
  },
  paymentText: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  paymentDescription: {
    fontSize: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
  },
});