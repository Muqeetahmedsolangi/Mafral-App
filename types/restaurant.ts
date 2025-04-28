export interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisineTypes: string[];
  priceRange: string; // "$" | "$$" | "$$$" | "$$$$"
  establishedYear: number;
  rating: number;
  reviewCount: number;
  coverImage: string;
  logoImage?: string;
  address: RestaurantAddress;
  contactInfo: ContactInfo;
  features: RestaurantFeatures;
  openingHours: OpeningHours[];
  menu: {
    categories: MenuCategory[];
    items: MenuItem[];
  };
  tables: TableType[];
  images: string[];
  staff: StaffMember[];
  successStories: SuccessStory[];
  isFavorite?: boolean;
  isPromoted?: boolean;
}

export interface RestaurantAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude: number | null;
  longitude: number | null;
}

export interface ContactInfo {
  email: string;
  phone: string;
  website: string;
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
}

export interface RestaurantFeatures {
  takeout: boolean;
  delivery: boolean;
  dineIn: boolean;
  outdoorSeating: boolean;
  parking: boolean;
  wifi: boolean;
  reservations: boolean;
  privateEvents: boolean;
  accessibilityFeatures: boolean;
  alcoholServed: boolean;
}

export interface OpeningHours {
  day: string;
  open: boolean;
  hours: {
    from: string;
    to: string;
  }[];
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isSpicy?: boolean;
  isFeatured?: boolean;
}

export interface TableType {
  id: string;
  name: string;
  capacity: number;
  count: number;
  isReservable: boolean;
  isOutdoor?: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  position: string;
  bio?: string;
  image?: string;
}

export interface SuccessStory {
  id: string;
  title: string;
  content: string;
  image?: string;
  date: string;
}

export type RestaurantCreationStep =
  | "basicInfo"
  | "location"
  | "features"
  | "openingHours"
  | "menu"
  | "tables"
  | "gallery"
  | "staff"
  | "stories"
  | "review";

export type RestaurantCategory =
  | "All"
  | "Featured"
  | "Nearby"
  | "Trending"
  | "Popular"
  | "New";
