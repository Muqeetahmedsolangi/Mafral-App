// User-related types
export interface UserData {
  id: string;
  email: string;
  fullName?: string;
  token: string;
  isVerified: boolean;
}

export interface AuthState {
  user: UserData | null;
  isLoading: boolean;
  error: string | null;
}

// Theme types
export interface ThemeColors {
  // Background colors
  background: string;
  card: string;
  surface: string;
  surfaceVariant: string;

  // Text colors
  text: string;
  textSecondary: string;
  textMuted: string;

  // Brand colors
  primary: string;
  secondary: {
    yellow: string;
    blue: string;
    green: string;
    darkOrange: string;
  };

  // State colors
  info: string;
  success: string;
  warning: string;
  error: string;
  danger?: string; // For compatibility with both error/danger styles

  // UI element colors
  border: string;
  divider: string;
  icon: string;
  iconInactive: string;

  // Tab bar specific
  tabBar: string;
  tabBarBorder: string;
  tabBarActive: string;
  tabBarInactive: string;
  tabBarActiveIndicator: string;
}

export type ThemeType = "light" | "dark";

// Event types
export interface EventCategory {
  id: string;
  name: string;
  icon: string; // Can be a name for an icon or image path
  color?: string;
}

export interface EventTicketType {
  id: string;
  name: string;
  price: number;
  currency: string;
  description?: string;
  availableCount: number;
  soldCount: number;
}

export interface EventLocation {
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
  latitude?: number; // For backward compatibility
  longitude?: number; // For backward compatibility
}

export interface EventOrganizer {
  id: string;
  name: string;
  logo?: string;
  avatar?: string; // Alternative field for logo
  description?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
}

export interface EventDateRange {
  start: string; // ISO string
  end: string; // ISO string
}

export interface EventImage {
  id: string;
  uri: string;
  isCover?: boolean;
}

export interface Ticket {
  id: string;
  type: string;
  price: number;
  currency: string;
  description?: string;
  available: number;
  sold: number;
}

export interface PromoCode {
  id?: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  validUntil?: string;
  maxUses?: number;
  currentUses?: number;
}

export interface EventPromotion {
  isPromoted: boolean;
  promotionLevel: "basic" | "featured" | "premium";
  startDate: string | null;
  endDate: string | null;
  budget?: number;
}

export interface SkipLineOption {
  enabled: boolean;
  price: number;
  maxPurchases?: number;
  description?: string;
}

// Core Event interface for creating events
export interface Event {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  coverImage?: string;
  imageUrl?: string; // Alternative field for coverImage
  images?: EventImage[];
  date?: EventDateRange;
  startDate?: string; // ISO string
  endDate?: string; // ISO string
  startsAt?: string; // time string "19:00"
  location: EventLocation;
  category: EventCategory;
  categoryId?: string; // For references
  organizer: EventOrganizer;
  organizerId?: string; // For references
  tickets?: Ticket[];
  ticketTypes?: EventTicketType[];
  attendees?: number;
  attendeeCount?: number; // Alternative field for attendees
  isFeatured?: boolean;
  tags?: string[];
  isFree?: boolean;
  createdAt?: string; // ISO string
  updatedAt?: string; // ISO string
  // Additional features
  promotion?: EventPromotion;
  skipLineOption?: SkipLineOption;
  promoCodes?: PromoCode[];
}

// Fully loaded event with all relationships
export interface EventWithRelations {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  coverImage?: string;
  imageUrl?: string; // Alternative for coverImage from MockData.getEventWithDetails
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
    // Make coordinates structure flexible to handle different formats
    coordinates?: {
      latitude: number;
      longitude: number;
    };
    latitude?: number; // Direct latitude for compatibility with MockData
    longitude?: number; // Direct longitude for compatibility with MockData
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

// Form state for creating events
export interface EventForm {
  title: string;
  description: string;
  date: {
    start: string;
    end: string;
  };
  location: {
    name: string;
    address: string;
    city: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  images: EventImage[];
  tags: string[];
}

export interface EventFormExtended extends EventForm {
  promotion: EventPromotion;
  skipLineOption: SkipLineOption;
  promoCodes: PromoCode[];
}
