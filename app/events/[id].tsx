import React, { useState, useEffect } from "react";
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
  FlatList,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, Stack, router } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { StatusBar } from "expo-status-bar";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { getEventWithDetails } from "@/constants/MockData";
import { format, parseISO } from "date-fns";
import { EventTicketType, EventLocation, EventOrganizer, EventCategory } from "@/types/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { MapComponent, MarkerComponent } from '@/components/MapView';

// Define interfaces that match the actual data structure from the API/mock data
interface EventImage {
  id: string;
  uri: string;
  isCover?: boolean;
}

interface PromoCode {
  id?: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  validUntil?: string;
  maxUses?: number;
  currentUses?: number;
}

interface EventPromotion {
  isPromoted: boolean;
  promotionLevel: 'basic' | 'featured' | 'premium';
  startDate: string | null;
  endDate: string | null;
  budget?: number;
}

interface SkipLineOption {
  enabled: boolean;
  price: number;
  maxPurchases?: number;
  description?: string;
}

interface Ticket {
  id: string;
  type: string;
  price: number;
  currency: string;
  description?: string;
  available: number;
  sold: number;
}

interface EventWithRelations {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  coverImage?: string;
  images?: EventImage[];
  date?: {
    start: string;
    end: string;
  };
  startDate?: string;
  endDate?: string;
  startsAt?: string;
  location: {
    id?: string;
    name: string;
    address: string;
    city: string;
    state?: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
    latitude?: number;
    longitude?: number;
  };
  category: EventCategory;
  organizer: EventOrganizer;
  tickets?: Ticket[];
  ticketTypes?: EventTicketType[];
  attendees?: number;
  attendeeCount?: number;
  isFeatured?: boolean;
  tags?: string[];
  isFree?: boolean;
  promotion?: EventPromotion;
  skipLineOption?: SkipLineOption;
  promoCodes?: PromoCode[];
  createdAt?: string;
  updatedAt?: string;
}

const { width } = Dimensions.get("window");
const imageHeight = 240;

export default function EventDetailsScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams();
  
  // State to hold the event data, accepting both mock data and created events
  const [event, setEvent] = useState<EventWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Event UI state
  const [selectedTicket, setSelectedTicket] = useState<EventTicketType | null>(null);
  const [showAllImages, setShowAllImages] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  
  // Animation for header
  const scrollY = new Animated.Value(0);
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, imageHeight - 60],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });
  
  // Fetch event data on component mount
  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      
      try {
        let eventData = getEventWithDetails(id as string);
        if (!eventData) {
          if (id && typeof id === 'string' && id.startsWith('event-')) {
            eventData = {
              id: id as string,
              title: "Newly Created Event",
              description: "This event was just created and would normally be loaded from storage.",
              coverImage: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
              startDate: new Date().toISOString(),
              date: {
                start: new Date().toISOString(),
                end: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
              },
              location: {
                name: "Event Venue",
                address: "123 Main Street",
                city: "Your City",
                country: "Your Country",
                coordinates: {
                  latitude: 40.7128,
                  longitude: -74.006,
                },
                latitude: undefined,
                longitude: undefined
              },
              category: {
                id: "general",
                name: "General",
                icon: "calendar",
                color: "#6200EE",
              },
              organizer: {
                id: "org_self",
                name: "Event Organizer",
                logo: "https://placehold.co/400x400/eee/333?text=EO",
                description: "Event organizer description",
                contactEmail: "contact@example.com",
              },
              tickets: [
                {
                  id: "ticket-default",
                  type: "General Admission",
                  price: 0,
                  currency: "USD",
                  description: "Standard entry to the event",
                  available: 100,
                  sold: 0,
                }
              ],
              attendees: 0,
              isFeatured: false,
              tags: ["new", "event"],
              isFree: true,
              startsAt: "19:00",
            };
            
            // Note: In a real app, you would merge any stored event data here
          }
        }
        
        if (eventData) {
          setEvent(eventData);
          // Initialize selected ticket with first ticket
          if (eventData.ticketTypes && eventData.ticketTypes.length > 0) {
            setSelectedTicket(eventData.ticketTypes[0]);
          } else if (eventData.tickets && eventData.tickets.length > 0) {
            // Format ticket data to match EventTicketType
            const ticket = eventData.tickets[0];
            setSelectedTicket({
              id: ticket.id,
              name: ticket.type,
              price: ticket.price,
              currency: ticket.currency,
              description: ticket.description || '',
              availableCount: ticket.available,
              soldCount: ticket.sold,
            });
          }
        }
      } catch (error) {
        console.error("Error loading event:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvent();
  }, [id]);
  
  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading event details...</Text>
      </View>
    );
  }
  
  if (!event) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <SafeAreaView edges={["top"]}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => router.back()}>
              <Feather name="arrow-left" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={48} color={colors.textSecondary} />
          <Text style={[styles.errorTitle, { color: colors.text }]}>Event not found</Text>
          <Text style={[styles.errorMessage, { color: colors.textSecondary }]}>
            The event you're looking for doesn't exist or may have been removed.
          </Text>
          <Button
            title="Go Back"
            variant="primary"
            size="medium"
            onPress={() => router.back()}
            style={{ marginTop: 24 }}
          />
        </View>
      </View>
    );
  }
  
  // Process event data to add support for multiple images
  const eventImages: EventImage[] = event.images 
    ? event.images 
    : event.coverImage
      ? [{ id: 'main', uri: event.coverImage, isCover: true }]
      : [{ id: 'default', uri: "https://placehold.co/600x400/eee/aaa?text=No+Image", isCover: true }];
  
  const startDate = event.date?.start ? new Date(event.date.start) : new Date(event.startDate || Date.now());
  const endDate = event.date?.end ? new Date(event.date.end) : event.endDate ? new Date(event.endDate) : null;
  
  const formattedStartDate = format(startDate, "EEEE, MMMM d, yyyy");
  const formattedEndDate = endDate ? format(endDate, "EEEE, MMMM d, yyyy") : null;
  const startTime = event.startsAt || format(startDate, "h:mm a");
  const endTime = endDate ? format(endDate, "h:mm a") : null;
  
  const handleGetDirections = () => {
    // Get coordinates from event location
    const latitude = event.location.coordinates?.latitude ?? 
      event.location.latitude ?? 0;
    const longitude = event.location.coordinates?.longitude ?? 
      event.location.longitude ?? 0;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url);
  };
  
  const handleTicketSelect = (ticket: EventTicketType) => {
    setSelectedTicket(ticket);
  };
  
  const handleTicketPurchase = () => {
    // Here you would handle the purchase flow
    // For now let's just navigate to a hypothetical checkout screen
    router.push(`/checkout?eventId=${event.id}&ticketId=${selectedTicket?.id}${promoApplied ? `&promo=${promoCode}` : ''}`);
  };
  
  const handleApplyPromoCode = () => {
    // In a real app, you would validate the promo code against the event's promo codes
    if (promoCode) {
      setPromoApplied(true);
      setShowPromoModal(false);
    }
  };
  
  const renderEventDate = () => {
    if (!endDate || formattedStartDate === formattedEndDate) {
      return (
        <View>
          <Text style={[styles.detailLabel, { color: colors.text }]}>Date & Time</Text>
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>
            {formattedStartDate} at {startTime}
            {endTime && startTime !== endTime ? ` - ${endTime}` : ''}
          </Text>
        </View>
      );
    } else {
      return (
        <View>
          <Text style={[styles.detailLabel, { color: colors.text }]}>Date & Time</Text>
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>
            Start: {formattedStartDate} at {startTime}
          </Text>
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>
            End: {formattedEndDate} at {endTime}
          </Text>
        </View>
      );
    }
  };
  
  // Get ticket types for display with proper type casting
  const ticketTypes: EventTicketType[] = event.ticketTypes || 
    (event.tickets?.map((ticket) => ({
      id: ticket.id,
      name: ticket.type,
      price: ticket.price,
      currency: ticket.currency,
      description: ticket.description || '',
      availableCount: ticket.available,
      soldCount: ticket.sold,
    })) || []);
  
  // Get event location coordinates
  const latitude = event.location.coordinates?.latitude ?? 
    event.location.latitude ?? 0;
  const longitude = event.location.coordinates?.longitude ?? 
    event.location.longitude ?? 0;
  
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
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: eventImages[0].uri }}
            style={styles.eventImage}
            resizeMode="cover"
          />
          
          {eventImages.length > 1 && (
            <TouchableOpacity 
              style={[styles.moreImagesButton, { backgroundColor: colors.card }]}
              onPress={() => setShowAllImages(true)}
            >
              <Feather name="grid" size={16} color={colors.text} />
              <Text style={[styles.moreImagesText, { color: colors.text }]}>
                +{eventImages.length - 1} Photos
              </Text>
            </TouchableOpacity>
          )}
        </View>
        
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

          {/* Premium Badge (if event is promoted) */}
          {event.promotion?.isPromoted && (
            <View style={[styles.premiumBadge, { backgroundColor: colors.primary + '20' }]}>
              <Feather name="star" size={14} color={colors.primary} />
              <Text style={[styles.premiumText, { color: colors.primary }]}>
                {event.promotion.promotionLevel === 'premium' 
                  ? 'Premium Event' 
                  : event.promotion.promotionLevel === 'featured' 
                    ? 'Featured Event'
                    : 'Promoted Event'
                }
              </Text>
            </View>
          )}

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {event.tags.map((tag, index) => (
                  <View 
                    key={index} 
                    style={[styles.tag, { backgroundColor: colors.surfaceVariant }]}
                  >
                    <Text style={[styles.tagText, { color: colors.text }]}>
                      #{tag}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
          
          {/* Date & Time */}
          <View style={styles.eventDetailRow}>
            <Feather name="calendar" size={18} color={colors.textSecondary} style={styles.detailIcon} />
            {renderEventDate()}
          </View>
          
          {/* Location */}
          <View style={styles.eventDetailRow}>
            <Feather name="map-pin" size={18} color={colors.textSecondary} style={styles.detailIcon} />
            <View style={styles.locationTextContainer}>
              <Text style={[styles.detailLabel, { color: colors.text }]}>Location</Text>
              <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                {event.location.name},
              </Text>
              <Text style={[styles.detailText, { color: colors.textSecondary, marginBottom: 4 }]}>
                {event.location.address}, {event.location.city}, {event.location.country}
              </Text>
              
              <Text style={[styles.coordinatesText, { color: colors.textSecondary }]}>
                Coordinates: {latitude.toFixed(6)}, {longitude.toFixed(6)}
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
                latitude,
                longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <MarkerComponent
                coordinate={{
                  latitude,
                  longitude,
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
          
          {/* Skip Line Option (if available) */}
          {event.skipLineOption?.enabled && (
            <View style={[styles.skipLineContainer, { backgroundColor: colors.primary + '10' }]}>
              <View style={styles.skipLineHeader}>
                <MaterialCommunityIcons name="ticket-confirmation" size={24} color={colors.primary} />
                <Text style={[styles.skipLineTitle, { color: colors.primary }]}>Skip the Line</Text>
              </View>
              <Text style={[styles.skipLineDescription, { color: colors.textSecondary }]}>
                {event.skipLineOption.description || "Skip the entry line and get immediate access to the event."}
              </Text>
              <View style={styles.skipLineDetails}>
                <Text style={[styles.skipLinePrice, { color: colors.text }]}>
                  ${event.skipLineOption.price}
                </Text>
                <TouchableOpacity
                  style={[styles.skipLineButton, { backgroundColor: colors.primary }]}
                >
                  <Text style={styles.skipLineButtonText}>Add Skip Line</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          
          {/* Organizer */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Organizer</Text>
            <View style={[styles.organizerContainer, { backgroundColor: colors.surfaceVariant }]}>
              <Image
                source={{ uri: event.organizer.logo || 'https://placehold.co/400x400/eee/333?text=Org' }}
                style={styles.organizerLogo}
                resizeMode="cover"
              />
              <View style={styles.organizerDetails}>
                <Text style={[styles.organizerName, { color: colors.text }]}>
                  {event.organizer.name}
                </Text>
                <Text style={[styles.organizerDescription, { color: colors.textSecondary }]} numberOfLines={2}>
                  {event.organizer.description || 'Event organizer'}
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
            {ticketTypes.map((ticket) => (
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
                  <Text style={[
                    styles.ticketPrice, 
                    { color: colors.text },
                    promoApplied && { textDecorationLine: 'line-through' }
                  ]}>
                    {ticket.price === 0 ? "FREE" : `${ticket.currency} ${ticket.price}`}
                  </Text>
                  
                  {promoApplied && (
                    <Text style={[styles.discountedPrice, { color: colors.primary }]}>
                      {ticket.price === 0 ? "FREE" : `${ticket.currency} ${(ticket.price * 0.85).toFixed(2)}`}
                    </Text>
                  )}
                  
                  {selectedTicket?.id === ticket.id && (
                    <Feather name="check-circle" size={20} color={colors.primary} style={styles.ticketCheck} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
            
            <View style={styles.promoCodeRow}>
              <TouchableOpacity 
                style={[styles.promoButton, { borderColor: colors.border }]} 
                onPress={() => setShowPromoModal(true)}
              >
                <Feather name="tag" size={16} color={colors.primary} />
                <Text style={[styles.promoButtonText, { color: colors.primary }]}>
                  {promoApplied ? 'Promo Applied' : 'Add Promo Code'}
                </Text>
              </TouchableOpacity>
            </View>
            
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
                  {event.attendees || event.attendeeCount || 0}
                </Text>
                <Text style={[styles.attendeesLabel, { color: colors.textSecondary }]}>
                  Going
                </Text>
              </View>
            </View>
            
            <View style={styles.attendeeIconsContainer}>
              {/* Just showing placeholder circles for attendees */}
              {Array(Math.min(5, event.attendees || event.attendeeCount || 0)).fill(0).map((_, i) => (
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
              
              {(event.attendees || event.attendeeCount || 0) > 5 && (
                <View style={[styles.moreAttendeesCircle, { backgroundColor: colors.surfaceVariant }]}>
                  <Text style={[styles.moreAttendeesText, { color: colors.textSecondary }]}>
                    +{(event.attendees || event.attendeeCount || 0) - 5}
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
              
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {promoApplied && (
                  <Text style={[styles.footerPrice, { color: colors.textSecondary, textDecorationLine: 'line-through', marginRight: 8, fontSize: 14 }]}>
                    {selectedTicket.price === 0 
                      ? "FREE" 
                      : `${selectedTicket.currency} ${selectedTicket.price}`
                    }
                  </Text>
                )}
                
                <Text style={[styles.footerPrice, { color: colors.text }]}>
                  {selectedTicket.price === 0 
                    ? "FREE" 
                    : `${selectedTicket.currency} ${promoApplied 
                      ? (selectedTicket.price * 0.85).toFixed(2)
                      : selectedTicket.price}`
                  }
                </Text>
              </View>
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
      
      {/* Image Gallery Modal */}
      <Modal
        visible={showAllImages}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAllImages(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: 'rgba(0,0,0,0.9)' }]}>
          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.galleryHeader}>
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={() => setShowAllImages(false)}
              >
                <Feather name="x" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.galleryTitle}>Event Photos</Text>
              <Text style={styles.galleryCounter}>
                {currentImageIndex + 1}/{eventImages.length}
              </Text>
            </View>
            
            <FlatList
              data={eventImages}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              initialScrollIndex={0}
              keyExtractor={(item) => item.id}
              onMomentumScrollEnd={(e) => {
                const index = Math.floor(e.nativeEvent.contentOffset.x / width);
                setCurrentImageIndex(index);
              }}
              renderItem={({ item }) => (
                <View style={styles.galleryImageContainer}>
                  <Image 
                    source={{ uri: item.uri }}
                    style={styles.galleryImage}
                    resizeMode="contain"
                  />
                  {item.isCover && (
                    <View style={styles.coverBadge}>
                      <Text style={styles.coverBadgeText}>Cover Photo</Text>
                    </View>
                  )}
                </View>
              )}
            />
          </SafeAreaView>
        </View>
      </Modal>
      
      {/* Promo Code Modal */}
      <Modal
        visible={showPromoModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPromoModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
          <View style={[styles.promoModalContent, { backgroundColor: colors.card }]}>
            <View style={styles.promoModalHeader}>
              <Text style={[styles.promoModalTitle, { color: colors.text }]}>Enter Promo Code</Text>
              <TouchableOpacity onPress={() => setShowPromoModal(false)}>
                <Feather name="x" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <View style={[styles.promoInputContainer, { backgroundColor: colors.surfaceVariant }]}>
              <Feather name="tag" size={20} color={colors.textSecondary} />
              <TextInput
                style={[styles.promoInput, { color: colors.text }]}
                placeholder="Enter your promo code"
                placeholderTextColor={colors.textSecondary}
                value={promoCode}
                onChangeText={setPromoCode}
                autoCapitalize="characters"
              />
              {promoCode.length > 0 && (
                <TouchableOpacity onPress={() => setPromoCode('')}>
                  <Feather name="x-circle" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              )}
            </View>
            
            {/* Available Promo Codes */}
            {event.promoCodes && event.promoCodes.length > 0 && (
              <View style={styles.availablePromoContainer}>
                <Text style={[styles.availablePromoTitle, { color: colors.textSecondary }]}>
                  Available Promo Codes
                </Text>
                {event.promoCodes.map((code: PromoCode, index: number) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.promoOption, { backgroundColor: colors.surfaceVariant }]}
                    onPress={() => setPromoCode(code.code)}
                  >
                    <View style={styles.promoOptionLeft}>
                      <Text style={[styles.promoOptionCode, { color: colors.text }]}>
                        {code.code}
                      </Text>
                      <Text style={[styles.promoOptionDetails, { color: colors.textSecondary }]}>
                        {code.discountType === 'percentage'
                          ? `${code.discountValue}% off`
                          : `${code.discountValue} off`
                        }
                      </Text>
                    </View>
                    <Feather name="chevron-right" size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                ))}
              </View>
            )}
            
            <Button
              title="Apply"
              variant="primary"
              size="large"
              disabled={!promoCode}
              onPress={handleApplyPromoCode}
              style={styles.applyButton}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    textAlign: 'center',
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
  imageContainer: {
    position: 'relative',
    width,
    height: imageHeight,
  },
  eventImage: {
    width,
    height: imageHeight,
  },
  moreImagesButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  moreImagesText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '500',
  },
  eventInfoContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: "700",
    flex: 1,
    marginRight: 8,
  },
  categoryTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  premiumText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  tagsContainer: {
    marginBottom: 16,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
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
  coordinatesText: {
    fontSize: 12,
    fontStyle: 'italic',
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
  skipLineContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  skipLineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  skipLineTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  skipLineDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  skipLineDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skipLinePrice: {
    fontSize: 18,
    fontWeight: '700',
  },
  skipLineButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  skipLineButtonText: {
    color: 'white',
    fontWeight: '600',
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
  discountedPrice: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 4,
  },
  ticketCheck: {
    marginTop: 6,
  },
  promoCodeRow: {
    marginTop: 8,
    marginBottom: 12,
  },
  promoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  promoButtonText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 6,
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
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Gallery Modal Styles
  galleryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  galleryTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  galleryCounter: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  galleryImageContainer: {
    width,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  galleryImage: {
    width: width * 0.9,
    height: width * 0.9,
  },
  coverBadge: {
    position: 'absolute',
    bottom: 120,
    right: 40,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  coverBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  // Promo Code Modal Styles
  promoModalContent: {
    width: '90%',
    borderRadius: 16,
    padding: 20,
    maxHeight: '80%',
  },
  promoModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  promoModalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  promoInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  promoInput: {
    flex: 1,
    fontSize: 16,
    marginHorizontal: 12,
  },
  availablePromoContainer: {
    marginBottom: 20,
  },
  availablePromoTitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  promoOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  promoOptionLeft: {
    flex: 1,
  },
  promoOptionCode: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  promoOptionDetails: {
    fontSize: 14,
  },
  applyButton: {
    marginTop: 8,
  }
});