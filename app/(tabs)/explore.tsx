// import React, { useState, useRef } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   Image,
//   ActivityIndicator,
//   ScrollView,
//   Animated,
// } from "react-native";
// import { useTheme } from "@/context/ThemeContext";
// import { Feather } from "@expo/vector-icons";
// import { H4, Body2, Caption } from "@/components/ui/Typography";

// // Dummy data for explore page
// const CATEGORIES = [
//   "All",
//   "Food",
//   "Travel",
//   "Fashion",
//   "Technology",
//   "Art",
//   "Music",
//   "Sports",
//   "Fitness",
// ];

// const EXPLORE_ITEMS = [
//   {
//     id: "1",
//     image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
//     title: "Delicious Meals",
//     likes: "4.2k",
//     category: "Food",
//   },
//   {
//     id: "2",
//     image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828",
//     title: "Travel Adventures",
//     likes: "3.5k",
//     category: "Travel",
//   },
//   {
//     id: "3",
//     image: "https://images.unsplash.com/photo-1483985988355-763728e1935b",
//     title: "Fashion Trends",
//     likes: "2.8k",
//     category: "Fashion",
//   },
//   {
//     id: "4",
//     image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
//     title: "Tech Gadgets",
//     likes: "5.1k",
//     category: "Technology",
//   },
//   {
//     id: "5",
//     image: "https://images.unsplash.com/photo-1501084817091-a4f3d1d19e07",
//     title: "Modern Art",
//     likes: "1.9k",
//     category: "Art",
//   },
//   {
//     id: "6",
//     image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
//     title: "Music Festival",
//     likes: "3.2k",
//     category: "Music",
//   },
//   {
//     id: "7",
//     image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211",
//     title: "Sports Events",
//     likes: "2.7k",
//     category: "Sports",
//   },
//   {
//     id: "8",
//     image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
//     title: "Fitness Routines",
//     likes: "1.8k",
//     category: "Fitness",
//   },
// ];

// export default function ExploreScreen() {
//   const { colors } = useTheme();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [isLoading, setIsLoading] = useState(false);
//   const scrollY = useRef(new Animated.Value(0)).current;

//   // Filter items by category and search query
//   const filteredItems = EXPLORE_ITEMS.filter((item) => {
//     const matchesCategory =
//       selectedCategory === "All" || item.category === selectedCategory;
//     const matchesSearch = item.title
//       .toLowerCase()
//       .includes(searchQuery.toLowerCase());
//     return matchesCategory && matchesSearch;
//   });

//   const handleSearch = (query: string) => {
//     setSearchQuery(query);
//     setIsLoading(true);

//     // Simulate search delay
//     setTimeout(() => {
//       setIsLoading(false);
//     }, 500);
//   };

//   const handleCategorySelect = (category: string) => {
//     setSelectedCategory(category);
//     setIsLoading(true);

//     // Simulate loading delay
//     setTimeout(() => {
//       setIsLoading(false);
//     }, 300);
//   };

//   // Animated header - shrinks as you scroll
//   const headerHeight = scrollY.interpolate({
//     inputRange: [0, 100],
//     outputRange: [60, 48],
//     extrapolate: "clamp",
//   });

//   const headerOpacity = scrollY.interpolate({
//     inputRange: [0, 60],
//     outputRange: [1, 0.9],
//     extrapolate: "clamp",
//   });

//   // Category item component with improved styling
//   const CategoryItem = ({ category, isSelected, onSelect }) => (
//     <TouchableOpacity
//       onPress={() => onSelect(category)}
//       style={[
//         styles.categoryItem,
//         isSelected
//           ? { backgroundColor: colors.primary }
//           : {
//               backgroundColor: colors.surfaceVariant,
//               borderColor: colors.border,
//               borderWidth: 1,
//             },
//       ]}
//       activeOpacity={0.7}
//     >
//       <Text
//         style={[
//           styles.categoryText,
//           isSelected
//             ? { color: "#FFFFFF", fontWeight: "600" }
//             : { color: colors.text },
//         ]}
//       >
//         {category}
//       </Text>
//     </TouchableOpacity>
//   );

//   // Grid item component with shadow and hover effect
//   const GridItem = ({ item }) => (
//     <TouchableOpacity
//       style={[
//         styles.gridItem,
//         {
//           backgroundColor: colors.card,
//           shadowColor: colors.text,
//         },
//       ]}
//       activeOpacity={0.8}
//     >
//       <View style={styles.imageContainer}>
//         <Image source={{ uri: item.image }} style={styles.itemImage} />
//         <View style={[styles.categoryTag, { backgroundColor: colors.primary }]}>
//           <Caption style={{ color: "#FFFFFF" }}>{item.category}</Caption>
//         </View>
//       </View>
//       <View style={styles.itemInfo}>
//         <Text
//           style={[styles.itemTitle, { color: colors.text }]}
//           numberOfLines={1}
//         >
//           {item.title}
//         </Text>
//         <View style={styles.itemStats}>
//           <Feather name="heart" size={12} color={colors.primary} />
//           <Text style={[styles.itemLikes, { color: colors.textSecondary }]}>
//             {item.likes}
//           </Text>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={[styles.container, { backgroundColor: colors.background }]}>
//       {/* Sticky Search Bar */}
//       <Animated.View
//         style={[
//           styles.searchBarContainer,
//           {
//             backgroundColor: colors.background,
//             height: headerHeight,
//             opacity: headerOpacity,
//           },
//         ]}
//       >
//         <View
//           style={[
//             styles.searchBar,
//             { backgroundColor: colors.surface, borderColor: colors.border },
//           ]}
//         >
//           <Feather
//             name="search"
//             size={20}
//             color={colors.iconInactive}
//             style={styles.searchIcon}
//           />
//           <TextInput
//             style={[styles.searchInput, { color: colors.text }]}
//             placeholder="Search..."
//             placeholderTextColor={colors.textMuted}
//             value={searchQuery}
//             onChangeText={handleSearch}
//           />
//           {searchQuery.length > 0 && (
//             <TouchableOpacity onPress={() => handleSearch("")}>
//               <Feather name="x" size={18} color={colors.iconInactive} />
//             </TouchableOpacity>
//           )}
//         </View>
//       </Animated.View>

//       {/* Categories */}
//       <Animated.ScrollView
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={styles.categoriesContainer}
//         decelerationRate="fast"
//         snapToInterval={100} // Approximate width of each category + margin
//         snapToAlignment="start"
//       >
//         {CATEGORIES.map((category) => (
//           <CategoryItem
//             key={category}
//             category={category}
//             isSelected={selectedCategory === category}
//             onSelect={handleCategorySelect}
//           />
//         ))}
//       </Animated.ScrollView>

//       {/* Content */}
//       {isLoading ? (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator color={colors.primary} size="large" />
//         </View>
//       ) : filteredItems.length > 0 ? (
//         <Animated.FlatList
//           data={filteredItems}
//           keyExtractor={(item) => item.id}
//           numColumns={2}
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={styles.gridContainer}
//           onScroll={Animated.event(
//             [{ nativeEvent: { contentOffset: { y: scrollY } } }],
//             { useNativeDriver: false }
//           )}
//           renderItem={({ item }) => <GridItem item={item} />}
//         />
//       ) : (
//         <View style={styles.noResultsContainer}>
//           <Feather name="search" size={50} color={colors.textMuted} />
//           <Text style={[styles.noResultsText, { color: colors.textSecondary }]}>
//             No results found
//           </Text>
//           <Text style={[styles.noResultsSubtext, { color: colors.textMuted }]}>
//             Try a different search term or category
//           </Text>
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 8,
//   },
//   searchBarContainer: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     justifyContent: "center",
//     zIndex: 10,
//     elevation: 3,
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     shadowOffset: { width: 0, height: 2 },
//   },
//   searchBar: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 10,
//     borderWidth: 1,
//   },
//   searchIcon: {
//     marginRight: 8,
//   },
//   searchInput: {
//     flex: 1,
//     height: 40,
//     fontSize: 16,
//   },
//   categoriesContainer: {
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//   },
//   categoryItem: {
//     paddingHorizontal: 18,
//     paddingVertical: 10,
//     borderRadius: 24,
//     marginRight: 10,
//     minWidth: 70,
//     alignItems: "center",
//   },
//   categoryText: {
//     fontSize: 14,
//     fontWeight: "500",
//   },
//   gridContainer: {
//     padding: 12,
//     paddingBottom: 30,
//   },
//   gridItem: {
//     flex: 1,
//     margin: 8,
//     borderRadius: 16,
//     overflow: "hidden",
//     elevation: 4,
//     shadowOpacity: 0.2,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//   },
//   imageContainer: {
//     position: "relative",
//   },
//   itemImage: {
//     width: "100%",
//     height: 160,
//   },
//   categoryTag: {
//     position: "absolute",
//     bottom: 8,
//     left: 8,
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 4,
//   },
//   itemInfo: {
//     padding: 12,
//   },
//   itemTitle: {
//     fontSize: 14,
//     fontWeight: "600",
//     marginBottom: 6,
//   },
//   itemStats: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   itemLikes: {
//     fontSize: 12,
//     marginLeft: 4,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   noResultsContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 30,
//   },
//   noResultsText: {
//     fontSize: 18,
//     fontWeight: "600",
//     marginTop: 16,
//     marginBottom: 8,
//   },
//   noResultsSubtext: {
//     fontSize: 14,
//     textAlign: "center",
//   },
// });

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  ScrollView,
  Animated,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { Feather } from "@expo/vector-icons";
import { H4, Body2, Caption } from "@/components/ui/Typography";

// Dummy data for explore page
const CATEGORIES = [
  "All",
  "Food",
  "Travel",
  "Fashion",
  "Technology",
  "Art",
  "Music",
  "Sports",
  "Fitness",
];

const EXPLORE_ITEMS = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    title: "Delicious Meals",
    likes: "4.2k",
    category: "Food",
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828",
    title: "Travel Adventures",
    likes: "3.5k",
    category: "Travel",
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b",
    title: "Fashion Trends",
    likes: "2.8k",
    category: "Fashion",
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    title: "Tech Gadgets",
    likes: "5.1k",
    category: "Technology",
  },
  {
    id: "5",
    image: "https://images.unsplash.com/photo-1501084817091-a4f3d1d19e07",
    title: "Modern Art",
    likes: "1.9k",
    category: "Art",
  },
  {
    id: "6",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
    title: "Music Festival",
    likes: "3.2k",
    category: "Music",
  },
  {
    id: "7",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211",
    title: "Sports Events",
    likes: "2.7k",
    category: "Sports",
  },
  {
    id: "8",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
    title: "Fitness Routines",
    likes: "1.8k",
    category: "Fitness",
  },
];

export default function ExploreScreen() {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Food");
  const [isLoading, setIsLoading] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  // Filter items by category and search query
  const filteredItems = EXPLORE_ITEMS.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSearch = (query) => {
    setSearchQuery(query);
    setIsLoading(true);

    // Simulate search delay
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsLoading(true);

    // Simulate loading delay
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  // Animated header - shrinks as you scroll
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [60, 48],
    extrapolate: "clamp",
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [1, 0.9],
    extrapolate: "clamp",
  });

  // Category item component with improved styling
  const CategoryItem = ({ category, isSelected, onSelect }) => (
    <TouchableOpacity
      onPress={() => onSelect(category)}
      style={[
        styles.categoryItem,
        {
          backgroundColor: isSelected ? "#FF5722" : "#F5F5F5",
          borderColor: isSelected ? "#FF5722" : "#EBEBEB",
        },
      ]}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.categoryText,
          { color: isSelected ? "#FFFFFF" : "#757575" },
        ]}
      >
        {category}
      </Text>
    </TouchableOpacity>
  );

  // Grid item component with shadow and hover effect
  const GridItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.gridItem,
        {
          backgroundColor: colors.card,
          shadowColor: colors.text,
        },
      ]}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        <View style={[styles.categoryTag, { backgroundColor: "#FF5722" }]}>
          <Caption style={{ color: "#FFFFFF" }}>{item.category}</Caption>
        </View>
      </View>
      <View style={styles.itemInfo}>
        <Text
          style={[styles.itemTitle, { color: colors.text }]}
          numberOfLines={1}
        >
          {item.title}
        </Text>
        <View style={styles.itemStats}>
          <Feather name="heart" size={12} color="#FF5722" />
          <Text style={[styles.itemLikes, { color: colors.textSecondary }]}>
            {item.likes}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Sticky Search Bar */}
      <Animated.View
        style={[
          styles.searchBarContainer,
          {
            backgroundColor: colors.background,
            height: headerHeight,
            opacity: headerOpacity,
          },
        ]}
      >
        <View
          style={[
            styles.searchBar,
            { backgroundColor: "#F5F5F5", borderColor: "#EBEBEB" },
          ]}
        >
          <Feather
            name="search"
            size={20}
            color="#9E9E9E"
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search..."
            placeholderTextColor="#9E9E9E"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch("")}>
              <Feather name="x" size={18} color="#9E9E9E" />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
        style={styles.categoriesScrollView}
      >
        {CATEGORIES.map((category) => (
          <CategoryItem
            key={category}
            category={category}
            isSelected={selectedCategory === category}
            onSelect={handleCategorySelect}
          />
        ))}
      </ScrollView>

      {/* Content */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#FF5722" size="large" />
        </View>
      ) : filteredItems.length > 0 ? (
        <Animated.FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.gridContainer}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          renderItem={({ item }) => <GridItem item={item} />}
        />
      ) : (
        <View style={styles.noResultsContainer}>
          <Feather name="search" size={50} color="#9E9E9E" />
          <Text style={[styles.noResultsText, { color: colors.textSecondary }]}>
            No results found
          </Text>
          <Text style={[styles.noResultsSubtext, { color: "#9E9E9E" }]}>
            Try a different search term or category
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 8,
  },
  searchBarContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: "center",
    zIndex: 10,
    elevation: 3,
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  categoriesScrollView: {
    maxHeight: 60,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryItem: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    marginRight: 10,
    minWidth: 70,
    alignItems: "center",
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
  },
  gridContainer: {
    padding: 12,
    paddingBottom: 30,
  },
  gridItem: {
    flex: 1,
    margin: 8,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  imageContainer: {
    position: "relative",
  },
  itemImage: {
    width: "100%",
    height: 160,
  },
  categoryTag: {
    position: "absolute",
    bottom: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  itemInfo: {
    padding: 12,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  itemStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemLikes: {
    fontSize: 12,
    marginLeft: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    textAlign: "center",
  },
});
