import {
  Restaurant,
  MenuCategory,
  MenuItem,
  RestaurantCategory,
} from "@/types/restaurant";

// Sample cuisine types for filtering
export const CUISINE_TYPES = [
  "American",
  "Italian",
  "Chinese",
  "Japanese",
  "Mexican",
  "Indian",
  "Thai",
  "Mediterranean",
  "French",
  "Greek",
  "Spanish",
  "Vietnamese",
  "Korean",
  "Turkish",
  "Lebanese",
  "Seafood",
  "Steakhouse",
  "Vegetarian",
  "Vegan",
  "Fusion",
];

// Sample restaurant features for filtering
export const RESTAURANT_FEATURES = [
  { key: "takeout", label: "Takeout", icon: "package" },
  { key: "delivery", label: "Delivery", icon: "truck" },
  { key: "dineIn", label: "Dine-In", icon: "users" },
  { key: "outdoorSeating", label: "Outdoor Seating", icon: "sun" },
  { key: "parking", label: "Parking", icon: "truck" },
  { key: "wifi", label: "Free WiFi", icon: "wifi" },
  { key: "reservations", label: "Reservations", icon: "calendar" },
  { key: "privateEvents", label: "Private Events", icon: "briefcase" },
  { key: "accessibilityFeatures", label: "Accessibility", icon: "heart" },
  { key: "alcoholServed", label: "Alcohol Served", icon: "wine-glass" },
];

// Restaurant categories for browsing
export const RESTAURANT_CATEGORIES: RestaurantCategory[] = [
  "All",
  "Featured",
  "Nearby",
  "Trending",
  "Popular",
  "New",
];

// Empty restaurant template for creating new restaurants
export const EMPTY_RESTAURANT: Omit<Restaurant, "id"> = {
  name: "",
  description: "",
  cuisineTypes: [],
  priceRange: "$$",
  establishedYear: new Date().getFullYear(),
  rating: 0,
  reviewCount: 0,
  coverImage: "",
  logoImage: "",
  address: {
    street: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    latitude: null,
    longitude: null,
  },
  contactInfo: {
    email: "",
    phone: "",
    website: "",
    socialMedia: {
      facebook: "",
      instagram: "",
      twitter: "",
    },
  },
  features: {
    takeout: false,
    delivery: false,
    dineIn: false,
    outdoorSeating: false,
    parking: false,
    wifi: false,
    reservations: false,
    privateEvents: false,
    accessibilityFeatures: false,
    alcoholServed: false,
  },
  openingHours: [
    { day: "Monday", open: true, hours: [{ from: "11:00", to: "22:00" }] },
    { day: "Tuesday", open: true, hours: [{ from: "11:00", to: "22:00" }] },
    { day: "Wednesday", open: true, hours: [{ from: "11:00", to: "22:00" }] },
    { day: "Thursday", open: true, hours: [{ from: "11:00", to: "22:00" }] },
    { day: "Friday", open: true, hours: [{ from: "11:00", to: "23:00" }] },
    { day: "Saturday", open: true, hours: [{ from: "11:00", to: "23:00" }] },
    { day: "Sunday", open: true, hours: [{ from: "12:00", to: "21:00" }] },
  ],
  menu: {
    categories: [],
    items: [],
  },
  tables: [],
  images: [],
  staff: [],
  successStories: [],
};

// Sample mock restaurants
export const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: "1",
    name: "Sapphire Garden",
    description:
      "An elegant Asian fusion restaurant offering innovative dishes combining traditional Eastern flavors with modern Western culinary techniques.",
    cuisineTypes: ["Asian", "Fusion", "Japanese"],
    priceRange: "$$$",
    establishedYear: 2019,
    rating: 4.7,
    reviewCount: 256,
    coverImage:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop",
    logoImage:
      "https://images.unsplash.com/photo-1581873372796-635b67ca2008?q=80&w=2070&auto=format&fit=crop",
    address: {
      street: "123 Culinary Avenue",
      city: "San Francisco",
      state: "CA",
      country: "USA",
      postalCode: "94103",
      latitude: 37.7749,
      longitude: -122.4194,
    },
    contactInfo: {
      email: "info@sapphiregarden.com",
      phone: "+1 (415) 555-7890",
      website: "www.sapphiregarden.com",
      socialMedia: {
        facebook: "sapphiregardensf",
        instagram: "sapphiregarden_sf",
        twitter: "sapphiregardenSF",
      },
    },
    features: {
      takeout: true,
      delivery: true,
      dineIn: true,
      outdoorSeating: true,
      parking: true,
      wifi: true,
      reservations: true,
      privateEvents: true,
      accessibilityFeatures: true,
      alcoholServed: true,
    },
    openingHours: [
      { day: "Monday", open: false, hours: [] },
      { day: "Tuesday", open: true, hours: [{ from: "17:00", to: "22:00" }] },
      { day: "Wednesday", open: true, hours: [{ from: "17:00", to: "22:00" }] },
      { day: "Thursday", open: true, hours: [{ from: "17:00", to: "22:00" }] },
      { day: "Friday", open: true, hours: [{ from: "17:00", to: "23:00" }] },
      { day: "Saturday", open: true, hours: [{ from: "17:00", to: "23:00" }] },
      { day: "Sunday", open: true, hours: [{ from: "17:00", to: "22:00" }] },
    ],
    menu: {
      categories: [
        {
          id: "cat1",
          name: "Appetizers",
          description: "Start your meal with these delightful small plates",
        },
        {
          id: "cat2",
          name: "Main Courses",
          description: "Signature entrées featuring the finest ingredients",
        },
        {
          id: "cat3",
          name: "Sushi & Sashimi",
          description: "Fresh seafood prepared with traditional techniques",
        },
        {
          id: "cat4",
          name: "Desserts",
          description: "Sweet endings to your culinary journey",
        },
      ],
      items: [
        {
          id: "item1",
          categoryId: "cat1",
          name: "Tempura Lobster Bites",
          description: "Crispy lobster tempura with yuzu aioli and tobiko",
          price: 18.0,
          image:
            "https://images.unsplash.com/photo-1535400255456-84a8629ca23d?q=80&w=1974&auto=format&fit=crop",
          isVegetarian: false,
          isFeatured: true,
        },
        {
          id: "item2",
          categoryId: "cat2",
          name: "Miso Black Cod",
          description:
            "Marinated for 72 hours in our house blend miso, served with pickled daikon and baby bok choy",
          price: 36.0,
          image:
            "https://images.unsplash.com/photo-1615361200141-f45040f367be?q=80&w=2064&auto=format&fit=crop",
          isGlutenFree: true,
          isFeatured: true,
        },
      ],
    },
    tables: [
      {
        id: "table1",
        name: "Standard Table",
        capacity: 4,
        count: 12,
        isReservable: true,
      },
      {
        id: "table2",
        name: "Booth",
        capacity: 6,
        count: 6,
        isReservable: true,
      },
      {
        id: "table3",
        name: "Counter Seating",
        capacity: 1,
        count: 10,
        isReservable: true,
      },
      {
        id: "table4",
        name: "Private Dining Room",
        capacity: 12,
        count: 1,
        isReservable: true,
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1514516345957-556ca7c90a29?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1563245738-9172821e07da?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2074&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1425042626922-8a5922861566?q=80&w=2070&auto=format&fit=crop",
    ],
    staff: [
      {
        id: "staff1",
        name: "Chef Hiroshi Tanaka",
        position: "Executive Chef",
        bio: "With 20 years of experience in top restaurants across Japan and the United States, Chef Hiroshi brings authentic techniques and innovative vision to Sapphire Garden.",
        image:
          "https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?q=80&w=2080&auto=format&fit=crop",
      },
    ],
    successStories: [
      {
        id: "story1",
        title: "Michelin Star Recognition",
        content:
          "Just 18 months after opening, Sapphire Garden was awarded its first Michelin star, recognizing our dedication to culinary excellence and innovation.",
        image:
          "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop",
        date: "2021-05-15",
      },
    ],
    isFavorite: false,
    isPromoted: true,
  },
  {
    id: "2",
    name: "Olive & Vine",
    description:
      "A charming Mediterranean restaurant specializing in farm-to-table cuisine featuring locally sourced ingredients and authentic recipes from Greece, Italy, and Spain.",
    cuisineTypes: ["Mediterranean", "Italian", "Greek"],
    priceRange: "$$",
    establishedYear: 2017,
    rating: 4.5,
    reviewCount: 342,
    coverImage:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2074&auto=format&fit=crop",
    logoImage:
      "https://images.unsplash.com/photo-1637421414166-a684d5183df9?q=80&w=2102&auto=format&fit=crop",
    address: {
      street: "45 Market Street",
      city: "Boston",
      state: "MA",
      country: "USA",
      postalCode: "02109",
      latitude: 42.3601,
      longitude: -71.0589,
    },
    contactInfo: {
      email: "hello@oliveandvine.com",
      phone: "+1 (617) 555-6123",
      website: "www.oliveandvine.com",
      socialMedia: {
        facebook: "oliveandvineboston",
        instagram: "oliveandvine_bos",
        twitter: "olivevineBoston",
      },
    },
    features: {
      takeout: true,
      delivery: false,
      dineIn: true,
      outdoorSeating: true,
      parking: false,
      wifi: true,
      reservations: true,
      privateEvents: true,
      accessibilityFeatures: true,
      alcoholServed: true,
    },
    openingHours: [
      { day: "Monday", open: true, hours: [{ from: "11:30", to: "21:00" }] },
      { day: "Tuesday", open: true, hours: [{ from: "11:30", to: "21:00" }] },
      { day: "Wednesday", open: true, hours: [{ from: "11:30", to: "21:00" }] },
      { day: "Thursday", open: true, hours: [{ from: "11:30", to: "21:00" }] },
      { day: "Friday", open: true, hours: [{ from: "11:30", to: "22:00" }] },
      { day: "Saturday", open: true, hours: [{ from: "11:00", to: "22:00" }] },
      { day: "Sunday", open: true, hours: [{ from: "11:00", to: "20:00" }] },
    ],
    menu: {
      categories: [
        {
          id: "cat1",
          name: "Small Plates",
          description: "Shareable Mediterranean starters",
        },
        {
          id: "cat2",
          name: "Pasta & Grains",
          description: "Handmade pasta and ancient grain dishes",
        },
        {
          id: "cat3",
          name: "Main Courses",
          description: "Hearty entrées inspired by Mediterranean cuisine",
        },
        {
          id: "cat4",
          name: "Desserts",
          description: "Sweet Mediterranean treats",
        },
      ],
      items: [
        {
          id: "item1",
          categoryId: "cat1",
          name: "Mezze Sampler",
          description:
            "A selection of hummus, baba ganoush, tzatziki, olives, and warm pita",
          price: 16.0,
          image:
            "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?q=80&w=2034&auto=format&fit=crop",
          isVegetarian: true,
          isFeatured: true,
        },
        {
          id: "item2",
          categoryId: "cat3",
          name: "Grilled Branzino",
          description:
            "Whole Mediterranean sea bass grilled with lemon, herbs, and olive oil, served with seasonal vegetables",
          price: 28.0,
          image:
            "https://images.unsplash.com/photo-1551504734-5ee1c4a2159b?q=80&w=2070&auto=format&fit=crop",
          isGlutenFree: true,
          isFeatured: true,
        },
      ],
    },
    tables: [
      {
        id: "table1",
        name: "Indoor Table",
        capacity: 4,
        count: 18,
        isReservable: true,
      },
      {
        id: "table2",
        name: "Patio Table",
        capacity: 4,
        count: 12,
        isReservable: true,
        isOutdoor: true,
      },
      {
        id: "table3",
        name: "Family Table",
        capacity: 8,
        count: 4,
        isReservable: true,
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?q=80&w=1972&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1586999768265-24af89630739?q=80&w=1974&auto=format&fit=crop",
    ],
    staff: [],
    successStories: [],
    isFavorite: true,
    isPromoted: false,
  },
  {
    id: "3",
    name: "The Maple Table",
    description:
      "A warm and inviting farm-to-table restaurant specializing in modern American comfort food made with seasonal ingredients from local farms.",
    cuisineTypes: ["American", "Breakfast", "Brunch"],
    priceRange: "$$",
    establishedYear: 2018,
    rating: 4.8,
    reviewCount: 423,
    coverImage:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop",
    logoImage:
      "https://images.unsplash.com/photo-1542834759-0e0bf11330c6?q=80&w=1974&auto=format&fit=crop",
    address: {
      street: "234 Harvest Lane",
      city: "Portland",
      state: "OR",
      country: "USA",
      postalCode: "97204",
      latitude: 45.5152,
      longitude: -122.6784,
    },
    contactInfo: {
      email: "info@themapletable.com",
      phone: "+1 (503) 555-9876",
      website: "www.themapletable.com",
      socialMedia: {
        facebook: "mapletablepdx",
        instagram: "mapletable_pdx",
        twitter: "MapleTablePDX",
      },
    },
    features: {
      takeout: true,
      delivery: true,
      dineIn: true,
      outdoorSeating: true,
      parking: true,
      wifi: true,
      reservations: false,
      privateEvents: false,
      accessibilityFeatures: true,
      alcoholServed: true,
    },
    openingHours: [
      { day: "Monday", open: true, hours: [{ from: "07:00", to: "15:00" }] },
      { day: "Tuesday", open: true, hours: [{ from: "07:00", to: "15:00" }] },
      { day: "Wednesday", open: true, hours: [{ from: "07:00", to: "15:00" }] },
      { day: "Thursday", open: true, hours: [{ from: "07:00", to: "15:00" }] },
      { day: "Friday", open: true, hours: [{ from: "07:00", to: "15:00" }] },
      { day: "Saturday", open: true, hours: [{ from: "07:00", to: "16:00" }] },
      { day: "Sunday", open: true, hours: [{ from: "07:00", to: "16:00" }] },
    ],
    menu: {
      categories: [
        { id: "cat1", name: "Breakfast", description: "Served all day" },
        { id: "cat2", name: "Lunch", description: "Available after 11am" },
        {
          id: "cat3",
          name: "Drinks",
          description: "Locally roasted coffee and fresh juices",
        },
      ],
      items: [
        {
          id: "item1",
          categoryId: "cat1",
          name: "Farmhouse Breakfast",
          description:
            "Two eggs any style, maple bacon, heirloom potatoes, sourdough toast, and seasonal preserves",
          price: 15.95,
          image:
            "https://images.unsplash.com/photo-1533920379810-6bedac961c2a?q=80&w=2069&auto=format&fit=crop",
          isGlutenFree: false,
          isFeatured: true,
        },
      ],
    },
    tables: [
      {
        id: "table1",
        name: "Standard Table",
        capacity: 4,
        count: 14,
        isReservable: false,
      },
      {
        id: "table2",
        name: "Counter Seating",
        capacity: 1,
        count: 12,
        isReservable: false,
      },
      {
        id: "table3",
        name: "Garden Table",
        capacity: 6,
        count: 6,
        isReservable: false,
        isOutdoor: true,
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1533920379810-6bedac961c2a?q=80&w=2069&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1588123190131-1c3faa3f5b8e?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?q=80&w=2069&auto=format&fit=crop",
    ],
    staff: [],
    successStories: [],
    isFavorite: false,
    isPromoted: false,
  },
  {
    id: "4",
    name: "Spice Route",
    description:
      "An authentic Indian restaurant offering regional specialties from across the subcontinent, from fragrant curries to tandoor-grilled meats and fresh-baked naan.",
    cuisineTypes: ["Indian", "Pakistani", "Vegetarian"],
    priceRange: "$$",
    establishedYear: 2015,
    rating: 4.6,
    reviewCount: 512,
    coverImage:
      "https://images.unsplash.com/photo-1517244683847-7456b63c5969?q=80&w=1988&auto=format&fit=crop",
    logoImage:
      "https://images.unsplash.com/photo-1617196035154-1e7e6e28b0db?q=80&w=2070&auto=format&fit=crop",
    address: {
      street: "78 Curry Lane",
      city: "Chicago",
      state: "IL",
      country: "USA",
      postalCode: "60605",
      latitude: 41.8781,
      longitude: -87.6298,
    },
    contactInfo: {
      email: "hello@spiceroute.com",
      phone: "+1 (312) 555-3392",
      website: "www.spiceroute.com",
      socialMedia: {
        facebook: "spiceroutechi",
        instagram: "spiceroute_chicago",
        twitter: "SpiceRouteChi",
      },
    },
    features: {
      takeout: true,
      delivery: true,
      dineIn: true,
      outdoorSeating: false,
      parking: true,
      wifi: true,
      reservations: true,
      privateEvents: true,
      accessibilityFeatures: true,
      alcoholServed: true,
    },
    openingHours: [
      { day: "Monday", open: false, hours: [] },
      {
        day: "Tuesday",
        open: true,
        hours: [
          { from: "11:30", to: "14:30" },
          { from: "17:00", to: "22:00" },
        ],
      },
      {
        day: "Wednesday",
        open: true,
        hours: [
          { from: "11:30", to: "14:30" },
          { from: "17:00", to: "22:00" },
        ],
      },
      {
        day: "Thursday",
        open: true,
        hours: [
          { from: "11:30", to: "14:30" },
          { from: "17:00", to: "22:00" },
        ],
      },
      {
        day: "Friday",
        open: true,
        hours: [
          { from: "11:30", to: "14:30" },
          { from: "17:00", to: "23:00" },
        ],
      },
      { day: "Saturday", open: true, hours: [{ from: "12:00", to: "23:00" }] },
      { day: "Sunday", open: true, hours: [{ from: "12:00", to: "21:00" }] },
    ],
    menu: {
      categories: [
        {
          id: "cat1",
          name: "Appetizers",
          description: "Start your meal with these delightful small plates",
        },
        {
          id: "cat2",
          name: "Vegetarian Curries",
          description: "Plant-based dishes rich in flavor",
        },
        {
          id: "cat3",
          name: "Non-Vegetarian Curries",
          description: "Hearty meat and seafood curries",
        },
        {
          id: "cat4",
          name: "Tandoori Specialties",
          description: "Marinated and clay oven grilled meats",
        },
        {
          id: "cat5",
          name: "Breads & Rice",
          description: "Accompaniments for your meal",
        },
        {
          id: "cat6",
          name: "Desserts",
          description: "Sweet endings to your spice journey",
        },
      ],
      items: [
        {
          id: "item1",
          categoryId: "cat1",
          name: "Samosa Chaat",
          description:
            "Crispy samosas topped with chickpeas, yogurt, tamarind and mint chutneys",
          price: 8.95,
          image:
            "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1974&auto=format&fit=crop",
          isVegetarian: true,
          isFeatured: true,
        },
        {
          id: "item2",
          categoryId: "cat3",
          name: "Butter Chicken",
          description:
            "Tandoori chicken simmered in a rich tomato and butter sauce with aromatic spices",
          price: 18.95,
          image:
            "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=2070&auto=format&fit=crop",
          isGlutenFree: true,
          isFeatured: true,
        },
      ],
    },
    tables: [
      {
        id: "table1",
        name: "Standard Table",
        capacity: 4,
        count: 15,
        isReservable: true,
      },
      {
        id: "table2",
        name: "Family Table",
        capacity: 8,
        count: 5,
        isReservable: true,
      },
      {
        id: "table3",
        name: "Private Dining",
        capacity: 14,
        count: 1,
        isReservable: true,
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?q=80&w=2042&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1574653853027-5382a3d23a7d?q=80&w=1974&auto=format&fit=crop",
    ],
    staff: [],
    successStories: [],
    isFavorite: true,
    isPromoted: true,
  },
  {
    id: "5",
    name: "Trattoria Milano",
    description:
      "An authentic Italian trattoria serving regional specialties from Northern Italy with an emphasis on handmade pasta and seasonal ingredients.",
    cuisineTypes: ["Italian", "European", "Mediterranean"],
    priceRange: "$$$",
    establishedYear: 2016,
    rating: 4.7,
    reviewCount: 378,
    coverImage:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop",
    logoImage:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=2069&auto=format&fit=crop",
    address: {
      street: "317 Pasta Avenue",
      city: "New York",
      state: "NY",
      country: "USA",
      postalCode: "10014",
      latitude: 40.7128,
      longitude: -74.006,
    },
    contactInfo: {
      email: "ciao@trattoriamilano.com",
      phone: "+1 (212) 555-6789",
      website: "www.trattoriamilano.com",
      socialMedia: {
        facebook: "trattoriamilanonyc",
        instagram: "trattoriamilano_nyc",
        twitter: "TrattoriaMilano",
      },
    },
    features: {
      takeout: true,
      delivery: false,
      dineIn: true,
      outdoorSeating: true,
      parking: false,
      wifi: true,
      reservations: true,
      privateEvents: true,
      accessibilityFeatures: true,
      alcoholServed: true,
    },
    openingHours: [
      { day: "Monday", open: false, hours: [] },
      { day: "Tuesday", open: true, hours: [{ from: "17:00", to: "22:00" }] },
      { day: "Wednesday", open: true, hours: [{ from: "17:00", to: "22:00" }] },
      { day: "Thursday", open: true, hours: [{ from: "17:00", to: "22:00" }] },
      {
        day: "Friday",
        open: true,
        hours: [
          { from: "12:00", to: "15:00" },
          { from: "17:00", to: "23:00" },
        ],
      },
      {
        day: "Saturday",
        open: true,
        hours: [
          { from: "12:00", to: "15:00" },
          { from: "17:00", to: "23:00" },
        ],
      },
      { day: "Sunday", open: true, hours: [{ from: "12:00", to: "21:00" }] },
    ],
    menu: {
      categories: [
        {
          id: "cat1",
          name: "Antipasti",
          description: "Traditional Italian starters",
        },
        { id: "cat2", name: "Pasta", description: "Handmade fresh daily" },
        { id: "cat3", name: "Secondi", description: "Main courses" },
        { id: "cat4", name: "Contorni", description: "Side dishes" },
        { id: "cat5", name: "Dolci", description: "Desserts" },
      ],
      items: [
        {
          id: "item1",
          categoryId: "cat2",
          name: "Tagliatelle al Ragù",
          description:
            "Fresh egg pasta ribbons with slow-cooked beef and pork ragù",
          price: 22.0,
          image:
            "https://images.unsplash.com/photo-1673914484766-913eaaec8e97?q=80&w=1974&auto=format&fit=crop",
          isVegetarian: false,
          isFeatured: true,
        },
      ],
    },
    tables: [
      {
        id: "table1",
        name: "Indoor Table",
        capacity: 4,
        count: 12,
        isReservable: true,
      },
      {
        id: "table2",
        name: "Bar Seating",
        capacity: 1,
        count: 8,
        isReservable: false,
      },
      {
        id: "table3",
        name: "Outdoor Patio",
        capacity: 2,
        count: 6,
        isReservable: true,
        isOutdoor: true,
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1458644267420-66bc8a5f21e4?q=80&w=2036&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2074&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=2032&auto=format&fit=crop",
    ],
    staff: [],
    successStories: [],
    isFavorite: false,
    isPromoted: true,
  },
];

// Helper functions

// Get restaurants by category
export function getRestaurantsByCategory(
  category: RestaurantCategory
): Restaurant[] {
  if (category === "All") {
    return MOCK_RESTAURANTS;
  } else if (category === "Featured") {
    return MOCK_RESTAURANTS.filter((restaurant) => restaurant.isPromoted);
  } else if (category === "Nearby") {
    // In a real app, you would use geolocation to find nearby restaurants
    // For now, we'll just return a subset of restaurants
    return MOCK_RESTAURANTS.slice(0, 3);
  } else if (category === "Trending") {
    // For demo purposes, we'll sort by rating
    return [...MOCK_RESTAURANTS].sort((a, b) => b.rating - a.rating);
  } else if (category === "Popular") {
    // For demo purposes, we'll sort by review count
    return [...MOCK_RESTAURANTS].sort((a, b) => b.reviewCount - a.reviewCount);
  } else if (category === "New") {
    // For demo purposes, we'll sort by establishment year (newest first)
    return [...MOCK_RESTAURANTS].sort(
      (a, b) => b.establishedYear - a.establishedYear
    );
  }

  return MOCK_RESTAURANTS;
}

// Get a specific restaurant by ID
export function getRestaurantById(id: string): Restaurant | undefined {
  return MOCK_RESTAURANTS.find((restaurant) => restaurant.id === id);
}

// Search restaurants by query
export function searchRestaurants(query: string): Restaurant[] {
  const lowercaseQuery = query.toLowerCase();
  return MOCK_RESTAURANTS.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(lowercaseQuery) ||
      restaurant.description.toLowerCase().includes(lowercaseQuery) ||
      restaurant.cuisineTypes.some((cuisine) =>
        cuisine.toLowerCase().includes(lowercaseQuery)
      )
  );
}

// Filter restaurants by cuisine type
export function filterRestaurantsByCuisine(cuisineType: string): Restaurant[] {
  return MOCK_RESTAURANTS.filter((restaurant) =>
    restaurant.cuisineTypes.includes(cuisineType)
  );
}
