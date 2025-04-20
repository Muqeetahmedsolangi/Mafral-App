import { Event, Category } from "@/types/events";

export const MOCK_CATEGORIES: Category[] = [
  {
    id: "music",
    name: "Music",
    icon: "music",
    color: "#FF6B35",
  },
  {
    id: "design",
    name: "Design",
    icon: "layout",
    color: "#4ECDC4",
  },
  {
    id: "art",
    name: "Art",
    icon: "image",
    color: "#8075FF",
  },
  {
    id: "sports",
    name: "Sports",
    icon: "activity",
    color: "#FF6B35",
  },
  {
    id: "tech",
    name: "Technology",
    icon: "code",
    color: "#1B9AAA",
  },
  {
    id: "food",
    name: "Food",
    icon: "coffee",
    color: "#F25F5C",
  },
  {
    id: "business",
    name: "Business",
    icon: "briefcase",
    color: "#50514F",
  },
  {
    id: "education",
    name: "Education",
    icon: "book",
    color: "#247BA0",
  },
];

export const MOCK_EVENTS: Event[] = [
  {
    id: "evt_1",
    title: "International Band Music Concert",
    description:
      "Experience the magic of live music with international bands performing their greatest hits. Join us for an unforgettable night of music, lights, and energy!",
    shortDescription: "Live performances by top international bands",
    coverImage:
      "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    date: {
      start: "2023-10-15T19:00:00Z",
      end: "2023-10-15T23:00:00Z",
    },
    location: {
      id: "loc_1",
      name: "International Exhibition Center",
      address: "10th Mile, Tumkur Road",
      city: "Bangalore",
      state: "Karnataka",
      country: "India",
      coordinates: {
        latitude: 13.0025,
        longitude: 77.5854,
      },
    },
    organizer: {
      id: "org_1",
      name: "Global Music Productions",
      logo: "https://placehold.co/400x400/eee/333?text=GMP",
      description:
        "Leading organizer of international music concerts and festivals.",
      contactEmail: "contact@globalmusicprod.com",
      website: "https://globalmusicprod.com",
    },
    category: {
      id: "music",
      name: "Music",
      icon: "music",
      color: "#FF6B35",
    },
    tickets: [
      {
        id: "tkt_1_1",
        type: "Standard Entry",
        price: 25.0,
        currency: "USD",
        description: "Standard entry with access to all performances",
        available: 500,
        sold: 320,
      },
      {
        id: "tkt_1_2",
        type: "VIP Access",
        price: 75.0,
        currency: "USD",
        description: "VIP entry with premium seating and backstage tour",
        available: 100,
        sold: 45,
      },
    ],
    attendees: 365,
    isFeatured: true,
    tags: ["music", "concert", "international", "bands"],
    isFree: false,
    startsAt: "19:00",
    createdAt: "2023-08-01T10:30:00Z",
    updatedAt: "2023-08-15T14:20:00Z",
  },
  {
    id: "evt_2",
    title: "Designers Meetup 2023",
    description:
      "Connect with fellow designers, share your portfolio, and learn from industry experts. This meetup features workshops, networking sessions, and keynote speeches from leading design professionals.",
    shortDescription: "Connect with top designers in your area",
    coverImage:
      "https://images.unsplash.com/photo-1558403194-611308249627?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    date: {
      start: "2023-10-22T10:00:00Z",
      end: "2023-10-22T17:00:00Z",
    },
    location: {
      id: "loc_2",
      name: "Gulshan-e-Iqbal Park",
      address: "Main Boulevard",
      city: "Dhaka",
      country: "Bangladesh",
      coordinates: {
        latitude: 23.7644,
        longitude: 90.4046,
      },
    },
    organizer: {
      id: "org_3",
      name: "Design Hub",
      logo: "https://placehold.co/400x400/eee/333?text=DH",
      description:
        "Creative design meetups and workshops for industry professionals",
      contactEmail: "hello@designhub.org",
      website: "https://designhub.org",
    },
    category: {
      id: "design",
      name: "Design",
      icon: "layout",
      color: "#4ECDC4",
    },
    tickets: [
      {
        id: "tkt_2_1",
        type: "Regular Entry",
        price: 15.0,
        currency: "USD",
        description: "Standard entry to all meetup activities",
        available: 200,
        sold: 103,
      },
    ],
    attendees: 103,
    isFeatured: false,
    tags: ["design", "networking", "portfolio", "workshop"],
  },
  {
    id: "evt_3",
    title: "Tech Summit 2023",
    description:
      "Explore the latest innovations in technology with industry leaders from around the world. Features keynotes, panel discussions, and hands-on demonstrations of cutting-edge tech.",
    shortDescription: "Discover the future of technology",
    coverImage:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    date: {
      start: "2023-11-05T09:00:00Z",
      end: "2023-11-07T18:00:00Z",
    },
    location: {
      id: "loc_3",
      name: "National Sports Complex",
      address: "Sports Avenue",
      city: "Islamabad",
      country: "Pakistan",
      coordinates: {
        latitude: 33.6844,
        longitude: 73.0479,
      },
    },
    organizer: {
      id: "org_2",
      name: "TechEvents Inc",
      logo: "https://placehold.co/400x400/eee/333?text=TEI",
      description: "Premier technology events and conference organizer",
      contactEmail: "info@techevents.com",
      website: "https://techevents.com",
    },
    category: {
      id: "tech",
      name: "Technology",
      icon: "code",
      color: "#1B9AAA",
    },
    tickets: [
      {
        id: "tkt_3_1",
        type: "Basic Access",
        price: 50.0,
        currency: "USD",
        description: "Access to all keynotes and panel discussions",
        available: 1000,
        sold: 750,
      },
      {
        id: "tkt_3_2",
        type: "Pro Pass",
        price: 150.0,
        currency: "USD",
        description: "Full access including workshops and networking dinner",
        available: 250,
        sold: 180,
      },
    ],
    attendees: 930,
    isFeatured: true,
    tags: ["tech", "innovation", "software", "hardware"],
  },
  {
    id: "evt_4",
    title: "Charity Fun Run",
    description:
      "Run for a cause! Join our annual charity fun run to support children's education in underprivileged communities. All proceeds will go directly to building schools and providing educational materials.",
    shortDescription: "5K run supporting children's education",
    coverImage:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    date: {
      start: "2023-10-29T07:30:00Z",
      end: "2023-10-29T12:00:00Z",
    },
    location: {
      id: "loc_4",
      name: "Nehru Stadium",
      address: "Jawaharlal Nehru Marg",
      city: "Delhi",
      country: "India",
      coordinates: {
        latitude: 28.5923,
        longitude: 77.2496,
      },
    },
    organizer: {
      id: "org_4",
      name: "Sports Connect",
      logo: "https://placehold.co/400x400/eee/333?text=SC",
      description: "Your connection to the best sporting events nationwide",
      contactEmail: "events@sportsconnect.net",
      website: "https://sportsconnect.net",
    },
    category: {
      id: "sports",
      name: "Sports",
      icon: "activity",
      color: "#FF6B35",
    },
    tickets: [
      {
        id: "tkt_4_1",
        type: "Participant Entry",
        price: 20.0,
        currency: "USD",
        description: "Registration for the 5K run including t-shirt and medal",
        available: 1500,
        sold: 876,
      },
    ],
    attendees: 876,
    isFeatured: true,
    tags: ["charity", "running", "sports", "education"],
  },
  {
    id: "evt_5",
    title: "World Food Festival",
    description:
      "Taste cuisines from around the world at our international food festival. Features food stalls from over 30 countries, cooking demonstrations by celebrity chefs, and live entertainment.",
    shortDescription: "Global cuisines and culinary experiences",
    coverImage:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    date: {
      start: "2023-12-10T11:00:00Z",
      end: "2023-12-12T22:00:00Z",
    },
    location: {
      id: "loc_1",
      name: "International Exhibition Center",
      address: "10th Mile, Tumkur Road",
      city: "Bangalore",
      state: "Karnataka",
      country: "India",
      coordinates: {
        latitude: 13.0025,
        longitude: 77.5854,
      },
    },
    organizer: {
      id: "org_1",
      name: "Global Food Promotions",
      logo: "https://placehold.co/400x400/eee/333?text=GFP",
      description: "Leading organizer of food events and festivals",
      contactEmail: "contact@globalfood.com",
      website: "https://globalfood.com",
    },
    category: {
      id: "food",
      name: "Food",
      icon: "coffee",
      color: "#F25F5C",
    },
    tickets: [
      {
        id: "tkt_5_1",
        type: "Day Pass",
        price: 10.0,
        currency: "USD",
        description: "Single day entry to the festival",
        available: 3000,
        sold: 1200,
      },
      {
        id: "tkt_5_2",
        type: "Weekend Pass",
        price: 25.0,
        currency: "USD",
        description: "Access for all three days of the festival",
        available: 1000,
        sold: 600,
      },
    ],
    attendees: 1800,
    isFeatured: false,
    tags: ["food", "festival", "international", "culinary"],
  },
  {
    id: "evt_6",
    title: "Street Art Exhibition",
    description:
      "Celebrating urban creativity with works from renowned street artists around the globe. Features large-scale murals, installations, workshops, and artist talks.",
    shortDescription: "Urban art from international artists",
    coverImage:
      "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1045&q=80",
    date: {
      start: "2023-11-18T12:00:00Z",
      end: "2023-11-25T20:00:00Z",
    },
    location: {
      id: "loc_2",
      name: "Gulshan-e-Iqbal Park",
      address: "Main Boulevard",
      city: "Dhaka",
      country: "Bangladesh",
      coordinates: {
        latitude: 23.7644,
        longitude: 90.4046,
      },
    },
    organizer: {
      id: "org_3",
      name: "Art Collective",
      logo: "https://placehold.co/400x400/eee/333?text=AC",
      description: "Promoting art in public spaces and cultural exchange",
      contactEmail: "hello@artcollective.org",
      website: "https://artcollective.org",
    },
    category: {
      id: "art",
      name: "Art",
      icon: "image",
      color: "#8075FF",
    },
    tickets: [
      {
        id: "tkt_6_1",
        type: "General Admission",
        price: 0,
        currency: "USD",
        description: "Free entry for everyone",
        available: 10000,
        sold: 0,
      },
      {
        id: "tkt_6_2",
        type: "Guided Tour",
        price: 15.0,
        currency: "USD",
        description: "Guided tour with art experts",
        available: 300,
        sold: 187,
      },
    ],
    attendees: 1750,
    isFeatured: true,
    tags: ["art", "street art", "exhibition", "urban"],
    isFree: true,
  },
];

// Helper functions for accessing events data
export const getFeaturedEvents = () => {
  return MOCK_EVENTS.filter((event) => event.isFeatured);
};

export const getEventsByCategory = (categoryId: string | null) => {
  if (!categoryId) return MOCK_EVENTS;
  return MOCK_EVENTS.filter((event) => event.category.id === categoryId);
};

export const getEventById = (id: string) => {
  return MOCK_EVENTS.find((event) => event.id === id);
};

export const searchEvents = (query: string) => {
  const lowerCaseQuery = query.toLowerCase();
  return MOCK_EVENTS.filter(
    (event) =>
      event.title.toLowerCase().includes(lowerCaseQuery) ||
      event.description.toLowerCase().includes(lowerCaseQuery) ||
      event.location.city.toLowerCase().includes(lowerCaseQuery) ||
      event.tags?.some((tag) => tag.toLowerCase().includes(lowerCaseQuery))
  );
};

// Add this to your MockData.ts file
export const getEventWithRelations = (id: string) => {
  // This is just an alias for getEventById for now
  // You could enhance this to include additional related data if needed
  return getEventById(id);
};

// Add this function to your MockData.ts file
export const getEventWithDetails = (id: string) => {
  const event = getEventById(id);
  if (!event) return null;

  // Transform the event data to match the expected format
  return {
    ...event,
    imageUrl: event.coverImage || event.image,
    startDate: event.date?.start || event.startDate,
    startsAt: event.time?.start || event.startsAt,
    ticketTypes: (event.tickets || []).map((ticket) => ({
      id: ticket.id || `ticket-${Math.random()}`,
      name: ticket.type || ticket.name,
      price: ticket.price || 0,
      currency: ticket.currency || "$",
      description: ticket.description || "",
      availableCount: ticket.available || 100,
      soldCount: ticket.sold || 0,
    })),
    attendeeCount: event.attendees || 0,
    isFree:
      event.isFree ||
      (event.tickets && event.tickets.some((t) => t.price === 0)) ||
      false,
    location: {
      name: event.location?.name || "Venue",
      address: event.location?.address || "",
      city: event.location?.city || "",
      country: event.location?.country || "",
      latitude:
        event.location?.coordinates?.latitude ||
        event.location?.latitude ||
        23.7783,
      longitude:
        event.location?.coordinates?.longitude ||
        event.location?.longitude ||
        90.3756,
    },
    organizer: {
      name: event.organizer?.name || "Event Organizer",
      description:
        event.organizer?.description || "Event Organizer Description",
      logo: event.organizer?.logo || "https://via.placeholder.com/150",
      contactEmail: event.organizer?.contactEmail || null,
    },
  };
};

// Add this function to your existing MockData.ts file

export const getTicketById = (id: string) => {
  const event = getEventById(id.split("-ticket-")[0]);
  if (!event) return null;

  return {
    id: id,
    event: {
      id: event.id,
      title: event.title,
      date: event.startDate,
      imageUrl: event.coverImage || event.imageUrl,
      location: {
        name: event.location.name,
        address: event.location.address,
        city: event.location.city,
        country: event.location.country,
      },
    },
    ticketType: event.tickets[0]?.type || "General Admission",
    price: event.tickets[0]?.price || 0,
    currency: event.tickets[0]?.currency || "$",
    purchaseDate: new Date().toISOString(),
    seat: "05",
    qrCode: `TICKET-${id}-${Math.random().toString(36).substring(7)}`,
    status: "active",
  };
};
