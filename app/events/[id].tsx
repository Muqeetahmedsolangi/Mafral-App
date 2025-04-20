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
} from "react-native";
import { useLocalSearchParams, Stack, router } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { StatusBar } from "expo-status-bar";
import { Feather, Ionicons } from "@expo/vector-icons";
import { getEventWithDetails } from "@/constants/MockData";
import { format } from "date-fns";
import { EventTicketType } from "@/types/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { MapComponent, MarkerComponent } from '@/components/MapView';

const { width } = Dimensions.get("window");
const imageHeight = 240;

export default function EventDetailsScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams();
  const event = getEventWithDetails(id as string);
  
  const [selectedTicket, setSelectedTicket] = useState<EventTicketType | null>(
    event?.ticketTypes[0] || null
  );
  
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
    // Here you would handle the purchase flow
    // For now let's just navigate to a hypothetical checkout screen
    router.push(`/checkout?eventId=${event.id}&ticketId=${selectedTicket?.id}`);
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
          
          {/* Date & Time */}
          <View style={styles.eventDetailRow}>
            <Feather name="calendar" size={18} color={colors.textSecondary} style={styles.detailIcon} />
            <View>
              <Text style={[styles.detailLabel, { color: colors.text }]}>Date & Time</Text>
              <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                {formattedDate} at {startTime}
              </Text>
            </View>
          </View>
          
          {/* Location */}
          <View style={styles.eventDetailRow}>
            <Feather name="map-pin" size={18} color={colors.textSecondary} style={styles.detailIcon} />
            <View style={styles.locationTextContainer}>
              <Text style={[styles.detailLabel, { color: colors.text }]}>Location</Text>
              <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                {event.location.name}, {event.location.address}, {event.location.city}, {event.location.country}
              </Text>
              <TouchableOpacity 
                style={[styles.directionsButton, { borderColor: colors.primary }]} 
                onPress={handleGetDirections}
              >
                <Text style={[styles.directionsText, { color: colors.primary }]}>Get Directions</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Map View */}
          <View style={styles.mapContainer}>
            <MapComponent
              style={styles.map}
              initialRegion={{
                latitude: event.location.latitude,
                longitude: event.location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <MarkerComponent
                coordinate={{
                  latitude: event.location.latitude,
                  longitude: event.location.longitude,
                }}
                title={event.location.name}
              />
            </MapComponent>
          </View>
          
          {/* About Section */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>About Event</Text>
            <Text style={[styles.aboutText, { color: colors.textSecondary }]}>
              {event.description}
            </Text>
          </View>
          
          {/* Organizer */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Organizer</Text>
            <View style={[styles.organizerContainer, { backgroundColor: colors.surfaceVariant }]}>
              <Image
                source={{ uri: event.organizer.logo }}
                style={styles.organizerLogo}
                resizeMode="cover"
              />
              <View style={styles.organizerDetails}>
                <Text style={[styles.organizerName, { color: colors.text }]}>
                  {event.organizer.name}
                </Text>
                <Text style={[styles.organizerDescription, { color: colors.textSecondary }]} numberOfLines={2}>
                  {event.organizer.description}
                </Text>
                
                {event.organizer.contactEmail && (
                  <TouchableOpacity 
                    style={[styles.contactButton, { backgroundColor: colors.primary }]}
                    onPress={() => Linking.openURL(`mailto:${event.organizer.contactEmail}`)}
                  >
                    <Text style={styles.contactButtonText}>Contact</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
          
          {/* Tickets */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Tickets</Text>
            {event.ticketTypes.map((ticket) => (
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
          
          {/* Attendees */}
          <View style={[styles.sectionContainer, styles.attendeesSection]}>
            <View style={styles.attendeesHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Attendees</Text>
              <View style={styles.attendeesCountContainer}>
                <Text style={[styles.attendeesCount, { color: colors.primary }]}>
                  {event.attendeeCount}
                </Text>
                <Text style={[styles.attendeesLabel, { color: colors.textSecondary }]}>
                  Going
                </Text>
              </View>
            </View>
            
            <View style={styles.attendeeIconsContainer}>
              {/* Just showing placeholder circles for attendees */}
              {Array(5).fill(0).map((_, i) => (
                <View 
                  key={i} 
                  style={[
                    styles.attendeeCircle, 
                    { 
                      backgroundColor: `hsl(${i * 60}, 70%, 80%)`,
                      marginLeft: i > 0 ? -15 : 0,
                      zIndex: 5 - i,
                    }
                  ]}
                >
                  <Text style={styles.attendeeInitial}>{String.fromCharCode(65 + i)}</Text>
                </View>
              ))}
              
              {event.attendeeCount > 5 && (
                <View style={[styles.moreAttendeesCircle, { backgroundColor: colors.surfaceVariant }]}>
                  <Text style={[styles.moreAttendeesText, { color: colors.textSecondary }]}>
                    +{event.attendeeCount - 5}
                  </Text>
                </View>
              )}
            </View>
          </View>
          
          {/* Bottom padding to ensure content doesn't get hidden behind footer */}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  scrollView: {
    flex: 1,
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
  eventDetailRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  detailIcon: {
    marginTop: 2,
    marginRight: 12,
    width: 20,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
  },
  locationTextContainer: {
    flex: 1,
  },
  directionsButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 8,
    borderWidth: 1,
  },
  directionsText: {
    fontSize: 12,
    fontWeight: "600",
  },
  mapContainer: {
    height: 180,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 24,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 22,
  },
  organizerContainer: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 12,
  },
  organizerLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  organizerDetails: {
    flex: 1,
  },
  organizerName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  organizerDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  contactButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 8,
  },
  contactButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
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
  attendeesSection: {
    marginBottom: 100, // Extra space at the bottom
  },
  attendeesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  attendeesCountContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  attendeesCount: {
    fontSize: 16,
    fontWeight: "700",
    marginRight: 4,
  },
  attendeesLabel: {
    fontSize: 14,
  },
  attendeeIconsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  attendeeCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  attendeeInitial: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  moreAttendeesCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: -15,
  },
  moreAttendeesText: {
    fontSize: 14,
    fontWeight: "600",
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
});