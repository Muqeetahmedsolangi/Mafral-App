import React, { useState } from "react";
import { 
  View, 
  StyleSheet, 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  Linking,
  Dimensions,
  Animated,
  Modal,
} from "react-native";
import { useLocalSearchParams, Stack, router } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { getEventWithDetails, saveTicket } from "@/constants/MockData";
import { format } from "date-fns";
import { EventTicketType } from "@/types/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { MapComponent, MarkerComponent } from '@/components/MapView';
import { Ticket } from "@/components/events/Ticket";

const { width } = Dimensions.get("window");
const imageHeight = 240;

export default function EventDetailsScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams();
  const event = getEventWithDetails(id as string);
  
  const [selectedTicket, setSelectedTicket] = useState<EventTicketType | null>(
    event?.ticketTypes && event.ticketTypes.length > 0 ? event.ticketTypes[0] : null
  );
  
  // Add state for the ticket modal
  const [ticketModalVisible, setTicketModalVisible] = useState(false);
  const [ticketData, setTicketData] = useState<any>(null);
  
  const scrollY = new Animated.Value(0);
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, imageHeight - 60],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });
  
  if (!event) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Event not found</Text>
      </View>
    );
  }
  
  const startDate = new Date(event.startDate);
  const formattedDate = format(startDate, "EEEE, MMMM d, yyyy");
  const startTime = event.startsAt || format(startDate, "h:mm a");
  
  const handleGetDirections = () => {
    const { latitude, longitude } = event.location;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url);
  };
  
  const handleTicketSelect = (ticket: EventTicketType) => {
    setSelectedTicket(ticket);
  };
  
  const handleTicketPurchase = () => {
    if (!selectedTicket) return;
    
    // Create a ticket with the event data
    const ticketId = `${event.id}-ticket-${selectedTicket.id || '1'}`; 
    const ticketData = {
      id: ticketId,
      event: {
        id: event.id,
        title: event.title,
        date: event.startDate,
        imageUrl: event.imageUrl || event.coverImage,
        location: {
          name: event.location.name,
          address: event.location.address,
          city: event.location.city,
          country: event.location.country,
        },
      },
      ticketType: selectedTicket.name || "General Admission",
      price: selectedTicket.price || 0,
      currency: selectedTicket.currency || "$",
      purchaseDate: new Date().toISOString(),
      seat: "05",
      qrCode: `TICKET-${ticketId}-${Math.random().toString(36).substring(7)}`,
      status: "active",
    };
    
    // Save the ticket to our "database"
    saveTicket(ticketData);
    
    // Set the ticket data and show the modal
    setTicketData(ticketData);
    setTicketModalVisible(true);
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style="light" />
      
      {/* Animated Header */}
      <Animated.View 
        style={[
          styles.animatedHeader, 
          { 
            backgroundColor: colors.background,
            opacity: headerOpacity,
            borderBottomColor: colors.border,
          }
        ]}
      >
        <SafeAreaView edges={["top"]} style={styles.safeAreaHeader}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => router.back()}>
              <Feather name="arrow-left" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text 
              style={[styles.headerTitle, { color: colors.text }]} 
              numberOfLines={1}
            >
              {event.title}
            </Text>
            <TouchableOpacity>
              <Feather name="share-2" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Animated.View>
      
      {/* Back button on image */}
      <View style={styles.imageBackButtonContainer}>
        <SafeAreaView edges={["top"]}>
          <TouchableOpacity 
            style={[styles.imageBackButton, { backgroundColor: "rgba(0,0,0,0.3)" }]} 
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </SafeAreaView>
      </View>
      
      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {/* Event Image */}
        <Image
          source={{ uri: event.imageUrl }}
          style={styles.eventImage}
          resizeMode="cover"
        />
        
        {/* Event Info */}
        <View style={[styles.eventInfoContainer, { backgroundColor: colors.background }]}>
          <View style={styles.headingRow}>
            <Text style={[styles.eventTitle, { color: colors.text }]}>
              {event.title}
            </Text>
            
            <View 
              style={[
                styles.categoryTag, 
                { backgroundColor: event.category.color + "20" }
              ]}
            >
              <Text style={[styles.categoryText, { color: event.category.color }]}>
                {event.category.name}
              </Text>
            </View>
          </View>
          
          {/* Tickets Section */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Tickets</Text>
            {event.ticketTypes?.map((ticket) => (
              <TouchableOpacity
                key={ticket.id}
                style={[
                  styles.ticketContainer, 
                  { 
                    backgroundColor: selectedTicket?.id === ticket.id 
                      ? colors.primary + "20" 
                      : colors.surfaceVariant 
                  },
                  selectedTicket?.id === ticket.id && {
                    borderWidth: 1,
                    borderColor: colors.primary,
                  }
                ]}
                onPress={() => handleTicketSelect(ticket)}
              >
                <View style={styles.ticketInfo}>
                  <Text style={[styles.ticketName, { color: colors.text }]}>
                    {ticket.name}
                  </Text>
                  {ticket.description && (
                    <Text style={[styles.ticketDescription, { color: colors.textSecondary }]}>
                      {ticket.description}
                    </Text>
                  )}
                </View>
                <View style={styles.ticketPriceContainer}>
                  <Text style={[styles.ticketPrice, { color: colors.text }]}>
                    {ticket.price === 0 ? "FREE" : `${ticket.currency} ${ticket.price}`}
                  </Text>
                  {selectedTicket?.id === ticket.id && (
                    <Feather name="check-circle" size={20} color={colors.primary} style={styles.ticketCheck} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
            
            <View style={styles.availabilityContainer}>
              <Feather name="info" size={16} color={colors.textSecondary} style={styles.infoIcon} />
              <Text style={[styles.availabilityText, { color: colors.textSecondary }]}>
                {selectedTicket 
                  ? `${selectedTicket.availableCount - selectedTicket.soldCount} tickets remaining`
                  : "Select a ticket type"
                }
              </Text>
            </View>
          </View>
          
          <View style={styles.bottomPadding} />
        </View>
      </Animated.ScrollView>
      
      {/* Footer with purchase button */}
      <SafeAreaView edges={["bottom"]} style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <View style={styles.footerContent}>
          {selectedTicket && (
            <View style={styles.footerPriceContainer}>
              <Text style={[styles.footerPriceLabel, { color: colors.textSecondary }]}>
                Price
              </Text>
              <Text style={[styles.footerPrice, { color: colors.text }]}>
                {selectedTicket.price === 0 
                  ? "FREE" 
                  : `${selectedTicket.currency} ${selectedTicket.price}`
                }
              </Text>
            </View>
          )}
          
          <Button
            title={event.isFree ? "Register Now" : "Get Tickets"}
            variant="primary"
            size="large"
            onPress={handleTicketPurchase}
            disabled={!selectedTicket}
            style={styles.getTicketsButton}
          />
        </View>
      </SafeAreaView>
      
      {/* Ticket Modal */}
      {ticketData && (
        <Modal
          visible={ticketModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setTicketModalVisible(false)}
        >
          <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setTicketModalVisible(false)} style={styles.modalCloseButton}>
                <Feather name="x" size={24} color={colors.text} />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Your Ticket</Text>
              <View style={{ width: 24 }} /> {/* Spacer for alignment */}
            </View>
            
            <ScrollView 
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={false}
            >
              <Ticket ticket={ticketData} />
              
              <Text style={[styles.ticketConfirmationText, { color: colors.textSecondary }]}>
                Your ticket has been confirmed! You can access it anytime from your profile.
              </Text>
            </ScrollView>
            
            <SafeAreaView edges={["bottom"]} style={styles.modalFooter}>
              <Button
                title="Close"
                variant="secondary"
                size="large"
                onPress={() => setTicketModalVisible(false)}
                style={styles.modalButton}
              />
              <Button
                title="Go to My Tickets"
                variant="primary"
                size="large"
                onPress={() => {
                  setTicketModalVisible(false);
                  router.push('/profile/tickets');
                }}
                style={styles.modalButton}
              />
            </SafeAreaView>
          </SafeAreaView>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  animatedHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 10,
    borderBottomWidth: 1,
  },
  safeAreaHeader: {
    flex: 1,
  },
  headerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    marginHorizontal: 16,
    textAlign: "center",
  },
  imageBackButtonContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 5,
  },
  imageBackButton: {
    margin: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  eventImage: {
    width,
    height: imageHeight,
  },
  eventInfoContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: "700",
    flex: 1,
  },
  categoryTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  ticketContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  ticketInfo: {
    flex: 1,
  },
  ticketName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  ticketDescription: {
    fontSize: 14,
  },
  ticketPriceContainer: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  ticketPrice: {
    fontSize: 18,
    fontWeight: "700",
  },
  ticketCheck: {
    marginTop: 6,
  },
  availabilityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  infoIcon: {
    marginRight: 8,
  },
  availabilityText: {
    fontSize: 14,
  },
  bottomPadding: {
    height: 40,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
  },
  footerContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  footerPriceContainer: {
    flex: 1,
  },
  footerPriceLabel: {
    fontSize: 12,
  },
  footerPrice: {
    fontSize: 18,
    fontWeight: "700",
  },
  getTicketsButton: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  modalCloseButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  modalScrollContent: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  ticketConfirmationText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
    marginHorizontal: 24,
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});