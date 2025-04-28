import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  ActivityIndicator,
  StatusBar,
  Animated,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { Feather, AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import CommentModal from "@/components/models/CommentModal";
import { REELS } from "@/constants/mediaMockData";
import { Reel } from "@/types/media";

const { width, height } = Dimensions.get("window");

export default function ReelsScreen() {
  const { colors } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [liked, setLiked] = useState<string[]>([]);
  const [commentLiked, setCommentLiked] = useState<string[]>([]);
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);
  const [currentReel, setCurrentReel] = useState<Reel | null>(null);
  const [lastTap, setLastTap] = useState<number | null>(null);
  const [showHeart, setShowHeart] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string[]>([]);
  
  // Animation for the heart
  const heartAnimation = useRef(new Animated.Value(0)).current;
  
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();
  const { postId } = useLocalSearchParams();
  
  useEffect(() => {
    // If a postId was passed, scroll to that post
    if (postId) {
      const index = REELS.findIndex(reel => reel.id === postId);
      if (index !== -1) {
        // Set a small delay to ensure the FlatList is rendered
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({ 
            index, 
            animated: false 
          });
        }, 100);
      }
    }
  }, [postId]);

  const handleLike = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (liked.includes(id)) {
      setLiked(liked.filter((itemId) => itemId !== id));
    } else {
      setLiked([...liked, id]);
    }
  };

  // Handle double-tap to like
  const handleDoubleTap = (id: string) => {
    const now = Date.now();
    if (lastTap && now - lastTap < 300) {
      if (!liked.includes(id)) {
        setLiked([...liked, id]);
        showHeartAnimation(id);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      setLastTap(null);
    } else {
      setLastTap(now);
    }
  };

  // Animation for the heart
  const showHeartAnimation = (id: string) => {
    setShowHeart(id);
    heartAnimation.setValue(0);
    
    Animated.sequence([
      Animated.timing(heartAnimation, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.delay(500),
      Animated.timing(heartAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowHeart(null);
    });
  };

  const handleCommentLike = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (commentLiked.includes(id)) {
      setCommentLiked(commentLiked.filter((itemId) => itemId !== id));
    } else {
      setCommentLiked([...commentLiked, id]);
    }
  };

  const openComments = (reel: Reel) => {
    setCurrentReel(reel);
    setIsCommentsVisible(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const closeComments = () => {
    setIsCommentsVisible(false);
  };

  const handleBackPress = () => {
    router.back();
  };

  const handlePostComment = (text: string) => {
    console.log(`New comment on reel ${currentReel?.id}: ${text}`);
  };

  const handleReplyComment = (commentId: string) => {
    console.log(`Replying to comment ${commentId}`);
  };

  const toggleExpanded = (id: string) => {
    if (expanded.includes(id)) {
      setExpanded(expanded.filter(itemId => itemId !== id));
    } else {
      setExpanded([...expanded, id]);
    }
  };

  const renderReel = ({ item, index }: { item: Reel, index: number }) => {
    const isActive = index === activeIndex;
    const isLiked = liked.includes(item.id);
    const isExpanded = expanded.includes(item.id);
    const isShowingHeart = showHeart === item.id;

    const heartScale = heartAnimation.interpolate({
      inputRange: [0, 0.3, 0.5, 0.7, 1],
      outputRange: [0, 1.2, 1.4, 1.2, 1],
    });

    const heartOpacity = heartAnimation.interpolate({
      inputRange: [0, 0.1, 0.8, 1],
      outputRange: [0, 1, 1, 0],
    });

    return (
      <TouchableWithoutFeedback onPress={() => handleDoubleTap(item.id)}>
        <View style={styles.reelContainer}>
          <Image
            source={{ uri: item.video }}
            style={styles.videoBackground}
            resizeMode="cover"
          />

          {/* Double-tap Heart Animation */}
          {isShowingHeart && (
            <Animated.View style={[
              styles.heartAnimationContainer,
              {
                opacity: heartOpacity,
                transform: [{ scale: heartScale }],
              }
            ]}>
              <AntDesign name="heart" size={100} color="white" />
            </Animated.View>
          )}

          {/* Top Gradient with Back Button */}
          <LinearGradient
            colors={["rgba(0,0,0,0.5)", "transparent"]}
            style={[styles.topGradient, { paddingTop: insets.top }]}
          >
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
              <Feather name="arrow-left" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.reelsTitle}>Reels</Text>
            <TouchableOpacity style={styles.cameraButton}>
              <Feather name="camera" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </LinearGradient>

          {/* Bottom Gradient for content */}
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)"]}
            style={[
              styles.gradient,
              { paddingBottom: insets.bottom > 0 ? insets.bottom : 16 },
            ]}
          />

          {/* Content Container */}
          <View
            style={[
              styles.contentContainer,
              { paddingBottom: insets.bottom > 0 ? insets.bottom : 16 },
            ]}
          >
            {/* Caption and User Info */}
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
              
              {/* Caption with read more functionality */}
              <TouchableOpacity activeOpacity={0.9} onPress={() => toggleExpanded(item.id)}>
                <Text style={styles.caption} numberOfLines={isExpanded ? undefined : 2}>
                  {item.caption}
                </Text>
                {item.caption.length > 80 && !isExpanded && (
                  <Text style={styles.seeMoreText}>more</Text>
                )}
              </TouchableOpacity>

              {/* Sound Info */}
              <View style={styles.soundInfo}>
                <Feather name="music" size={13} color="#FFFFFF" />
                <Text style={styles.soundText}>Original Audio • User</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionContainer}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleLike(item.id)}
                activeOpacity={0.7}
              >
                <AntDesign
                  name={isLiked ? "heart" : "hearto"}
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
              
              {/* User Avatar - Small */}
              <TouchableOpacity style={styles.reelAvatarContainer}>
                <Image source={{ uri: item.user.avatar }} style={styles.reelAvatar} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
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
          data={REELS}
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
          onScrollToIndexFailed={(info) => {
            console.log("Failed to scroll to index", info);
            // Handle the failure to scroll
            const wait = new Promise(resolve => setTimeout(resolve, 500));
            wait.then(() => {
              flatListRef.current?.scrollToIndex({ 
                index: info.index, 
                animated: false 
              });
            });
          }}
        />
      )}

      {currentReel && (
        <CommentModal
          isVisible={isCommentsVisible}
          onClose={closeComments}
          comments={currentReel.commentsList}
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
    height,
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
  backButton: {
    padding: 8,
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
  seeMoreText: {
    color: "#999",
    fontSize: 14,
    marginTop: 3,
    fontWeight: "600",
  },
  soundInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  soundText: {
    color: "#FFFFFF",
    fontSize: 13,
    marginLeft: 5,
  },
  actionContainer: {
    justifyContent: "flex-end",
    alignItems: "center",
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
  reelAvatarContainer: {
    marginTop: 16,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    borderRadius: 24,
    padding: 2,
  },
  reelAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  heartAnimationContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
});