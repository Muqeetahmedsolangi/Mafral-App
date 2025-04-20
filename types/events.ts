export interface Event {
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
