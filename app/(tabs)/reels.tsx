// app/(tabs)/reels.tsx
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StatusBar,
  Animated,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import CommentModal, { CommentType } from "@/components/models/CommentModal";

const { width, height } = Dimensions.get("window");

// Dummy data for reels
const REELS_DATA = [
  {
    id: "1",
    video: "https://images.unsplash.com/photo-1531747056595-07f6cbbe10ad",
    user: {
      id: "user1",
      username: "traveller_mike",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    caption: "Amazing sunset view from the mountain top! #travel #adventure",
    likes: "52.1k",
    comments: "412",
    shares: "215",
    commentsList: [
      {
        id: "c1",
        user: {
          username: "mountain_lover",
          avatar: "https://randomuser.me/api/portraits/women/22.jpg",
        },
        text: "This view is absolutely breathtaking! Where exactly is this?",
        likes: 24,
        time: "2h",
      },
      {
        id: "c2",
        user: {
          username: "adventure_time",
          avatar: "https://randomuser.me/api/portraits/men/45.jpg",
        },
        text: "I've been wanting to visit this place for so long! Did you camp there overnight?",
        likes: 17,
        time: "4h",
      },
      {
        id: "c3",
        user: {
          username: "photo_enthusiast",
          avatar: "https://randomuser.me/api/portraits/women/30.jpg",
        },
        text: "The lighting in this shot is perfect. What camera did you use?",
        likes: 8,
        time: "5h",
      },
    ],
  },
  {
    id: "2",
    video: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
    user: {
      id: "user2",
      username: "food_lover",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    caption: "Homemade pizza is the best pizza! Check out my recipe in bio.",
    likes: "84.3k",
    comments: "1.2k",
    shares: "532",
    commentsList: [
      {
        id: "c1",
        user: {
          username: "pizza_fan",
          avatar: "https://randomuser.me/api/portraits/men/36.jpg",
        },
        text: "That crust looks perfect! Is your recipe on your blog?",
        likes: 56,
        time: "1h",
      },
      {
        id: "c2",
        user: {
          username: "chef_amanda",
          avatar: "https://randomuser.me/api/portraits/women/50.jpg",
        },
        text: "Love the toppings combination! I'll have to try this during the weekend.",
        likes: 23,
        time: "3h",
      },
    ],
  },
  {
    id: "3",
    video: "https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717",
    user: {
      id: "user3",
      username: "fitness_guru",
      avatar: "https://randomuser.me/api/portraits/men/62.jpg",
    },
    caption: "Morning workout routine that will change your life! #fitness",
    likes: "36.7k",
    comments: "284",
    shares: "145",
    commentsList: [
      {
        id: "c1",
        user: {
          username: "gym_rat",
          avatar: "https://randomuser.me/api/portraits/men/75.jpg",
        },
        text: "Great form! How many reps do you recommend for beginners?",
        likes: 15,
        time: "45m",
      },
      {
        id: "c2",
        user: {
          username: "healthy_habits",
          avatar: "https://randomuser.me/api/portraits/women/67.jpg",
        },
        text: "This is exactly what I needed to see today. Motivation boost!",
        likes: 28,
        time: "2h",
      },
      {
        id: "c3",
        user: {
          username: "workout_daily",
          avatar: "https://randomuser.me/api/portraits/men/55.jpg",
        },
        text: "Do you have any modifications for people with knee issues?",
        likes: 7,
        time: "3h",
      },
    ],
  },
  {
    id: "4",
    video: "https://images.unsplash.com/photo-1561037404-61cd46aa615b",
    user: {
      id: "user4",
      username: "tech_nerd",
      avatar: "https://randomuser.me/api/portraits/women/28.jpg",
    },
    caption: "Testing out the latest gadget! This thing is amazing.",
    likes: "19.8k",
    comments: "327",
    shares: "98",
    commentsList: [
      {
        id: "c1",
        user: {
          username: "gadget_lover",
          avatar: "https://randomuser.me/api/portraits/men/18.jpg",
        },
        text: "How's the battery life? I've been thinking about getting one!",
        likes: 31,
        time: "1h",
      },
      {
        id: "c2",
        user: {
          username: "tech_reviewer",
          avatar: "https://randomuser.me/api/portraits/women/33.jpg",
        },
        text: "Great review! Is it worth the price tag?",
        likes: 14,
        time: "4h",
      },
    ],
  },
  {
    id: "5",
    video: "https://images.unsplash.com/photo-1542596768-5d1d21f1cf98",
    user: {
      id: "user5",
      username: "fashion_icon",
      avatar: "https://randomuser.me/api/portraits/women/14.jpg",
    },
    caption: "Summer outfit of the day! What do you think? #fashion #ootd",
    likes: "68.9k",
    comments: "523",
    shares: "312",
    commentsList: [
      {
        id: "c1",
        user: {
          username: "style_queen",
          avatar: "https://randomuser.me/api/portraits/women/19.jpg",
        },
        text: "Love the color combination! Where's that top from?",
        likes: 45,
        time: "3h",
      },
      {
        id: "c2",
        user: {
          username: "trend_follower",
          avatar: "https://randomuser.me/api/portraits/men/23.jpg",
        },
        text: "This outfit is perfect for summer! Definitely saving for inspiration.",
        likes: 22,
        time: "5h",
      },
      {
        id: "c3",
        user: {
          username: "fashion_blogger",
          avatar: "https://randomuser.me/api/portraits/women/37.jpg",
        },
        text: "Those accessories complete the look so well! Always on point!",
        likes: 18,
        time: "6h",
      },
    ],
  },
];

export default function ReelsScreen() {
  const { colors } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [liked, setLiked] = useState<string[]>([]);
  const [commentLiked, setCommentLiked] = useState<string[]>([]);
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);
  const [currentReel, setCurrentReel] = useState(null);
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();

  const handleLike = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (liked.includes(id)) {
      setLiked(liked.filter((itemId) => itemId !== id));
    } else {
      setLiked([...liked, id]);
    }
  };

  const handleCommentLike = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (commentLiked.includes(id)) {
      setCommentLiked(commentLiked.filter((itemId) => itemId !== id));
    } else {
      setCommentLiked([...commentLiked, id]);
    }
  };

  const openComments = (reel) => {
    setCurrentReel(reel);
    setIsCommentsVisible(true);
  };

  const closeComments = () => {
    setIsCommentsVisible(false);
  };

  const handlePostComment = (text: string) => {
    console.log(`New comment on reel ${currentReel?.id}: ${text}`);
  };

  const handleReplyComment = (commentId: string) => {
    console.log(`Replying to comment ${commentId}`);
  };

  const renderReel = ({ item, index }) => {
    const isActive = index === activeIndex;
    const isLiked = liked.includes(item.id);

    return (
      <View style={[styles.reelContainer]}>
        <Image
          source={{ uri: item.video }}
          style={styles.videoBackground}
          resizeMode="cover"
        />

        <LinearGradient
          colors={["rgba(0,0,0,0.5)", "transparent"]}
          style={[styles.topGradient, { paddingTop: insets.top }]}
        >
          <Text style={styles.reelsTitle}>Reels</Text>
          <TouchableOpacity style={styles.cameraButton}>
            <Feather name="camera" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </LinearGradient>

        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          style={[
            styles.gradient,
            { paddingBottom: insets.bottom > 0 ? insets.bottom : 16 },
          ]}
        />

        <View
          style={[
            styles.contentContainer,
            { paddingBottom: insets.bottom > 0 ? insets.bottom : 16 },
          ]}
        >
          <View style={styles.captionContainer}>
            <View style={styles.userInfo}>
              <Image
                source={{ uri: item.user.avatar }}
                style={styles.userAvatar}
              />
              <Text style={styles.username}>{item.user.username}</Text>
              <TouchableOpacity style={styles.followButton} activeOpacity={0.7}>
                <Text style={styles.followButtonText}>Follow</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.caption} numberOfLines={2}>
              {item.caption}
            </Text>
          </View>

          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleLike(item.id)}
              activeOpacity={0.7}
            >
              <Feather
                name={isLiked ? "heart" : "heart"}
                size={28}
                color={isLiked ? "#FF375F" : "#FFFFFF"}
                style={{ opacity: isLiked ? 1 : 0.95 }}
              />
              <Text style={styles.actionText}>
                {isLiked
                  ? (
                      parseInt(item.likes.replace("k", "000")) + 1
                    ).toLocaleString()
                  : item.likes}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => openComments(item)}
              activeOpacity={0.7}
            >
              <Feather name="message-circle" size={28} color="#FFFFFF" />
              <Text style={styles.actionText}>{item.comments}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
              <Feather name="send" size={26} color="#FFFFFF" />
              <Text style={styles.actionText}>{item.shares}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
              <Feather name="more-vertical" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 300,
  };

  return (
    <View style={[styles.container, { backgroundColor: "black" }]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={REELS_DATA}
          renderItem={renderReel}
          keyExtractor={(item) => item.id}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          snapToInterval={height}
          decelerationRate="fast"
          viewabilityConfig={viewabilityConfig}
          onViewableItemsChanged={onViewableItemsChanged}
          windowSize={3}
          maxToRenderPerBatch={2}
          removeClippedSubviews={true}
          initialNumToRender={2}
        />
      )}

      {currentReel && (
        <CommentModal
          isVisible={isCommentsVisible}
          onClose={closeComments}
          comments={currentReel.commentsList as CommentType[]}
          onLikeComment={handleCommentLike}
          onReplyComment={handleReplyComment}
          onPostComment={handlePostComment}
          likedComments={commentLiked}
          title={`${currentReel.comments} Comments`}
          currentUserAvatar="https://randomuser.me/api/portraits/lego/1.jpg"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  reelContainer: {
    width,
    height: height,
    position: "relative",
  },
  videoBackground: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  topGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  reelsTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  cameraButton: {
    padding: 8,
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60%",
  },
  contentContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  captionContainer: {
    flex: 1,
    marginRight: 16,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    marginRight: 8,
  },
  username: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
    marginRight: 8,
  },
  followButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  followButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
  },
  caption: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 20,
  },
  actionContainer: {
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 20,
  },
  actionButton: {
    alignItems: "center",
    marginTop: 16,
  },
  actionText: {
    color: "#FFFFFF",
    fontSize: 12,
    marginTop: 4,
  },
});
