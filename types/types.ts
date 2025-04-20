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
  latitude: number;
  longitude: number;
}

export interface EventOrganizer {
  id: string;
  name: string;
  logo?: string;
  description?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  imageUrl: string;
  startDate: string; // ISO string
  endDate?: string; // ISO string
  location: EventLocation;
  categoryId: string;
  organizerId: string;
  ticketTypes: EventTicketType[];
  attendeeCount: number;
  isFeatured: boolean;
  tags?: string[];
  isFree: boolean;
  startsAt?: string; // time string "19:00"
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface EventWithRelations extends Event {
  category: EventCategory;
  organizer: EventOrganizer;
}
