export interface Event {
  startDate: string;
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  coverImage: string;
  date: {
    start: string; // ISO string
    end: string; // ISO string
  };
  location: {
    longitude: number;
    latitude: number;
    id?: string;
    name: string;
    address: string;
    city: string;
    state?: string;
    country: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  organizer: {
    id: string;
    name: string;
    avatar?: string;
    logo?: string;
    description?: string;
    contactEmail?: string;
    contactPhone?: string;
    website?: string;
  };
  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
  tickets: {
    id: string;
    type: string;
    price: number;
    currency: string;
    description?: string;
    available: number;
    sold: number;
  }[];
  attendees: number;
  isFeatured: boolean;
  tags?: string[];
  isFree?: boolean;
  startsAt?: string; // time string "19:00"
  createdAt?: string; // ISO string
  updatedAt?: string; // ISO string
}

// Add the EventWithRelations interface that includes all potential data from created events
export interface EventWithRelations extends Event {
  // Additional fields that might be present in created events
  imageUrl?: string;
  images?: EventImage[];
  endDate?: string;
  ticketTypes?: {
    id: string;
    name: string;
    price: number;
    currency: string;
    description?: string;
    availableCount: number;
    soldCount: number;
  }[];
  attendeeCount?: number;
  promotion?: EventPromotion;
  skipLineOption?: SkipLineOption;
  promoCodes?: PromoCode[];
  // Any other fields needed to ensure compatibility with both mock and created events

  // Add explicit location structure
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
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
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

export interface EventPromotion {
  isPromoted: boolean;
  promotionLevel: "basic" | "featured" | "premium";
  startDate: Date | null;
  endDate: Date | null;
  budget?: number;
  targetAudience?: string[];
}

export interface SkipLineOption {
  enabled: boolean;
  price: number;
  maxPurchases: number;
  description: string;
}

export interface PromoCode {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  maxUses: number;
  usedCount: number;
  validUntil: Date;
  minimumPurchase?: number;
  isActive: boolean;
}

export interface EventImage {
  id: string;
  uri: string;
  isCover?: boolean;
}

// Define or import EventForm before using it
export interface EventForm {
  title: string;
  description: string;
  date: {
    start: string; // ISO string
    end: string; // ISO string
  };
  location: {
    name: string;
    address: string;
    city: string;
    country: string;
  };
}

export interface EventFormExtended extends EventForm {
  images: EventImage[];
  promotion: EventPromotion;
  skipLineOption: SkipLineOption;
  promoCodes: PromoCode[];
  tags: string[];
}
