import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { Feather } from "@expo/vector-icons";
import CommentModal, { CommentType } from "@/components/models/CommentModal";
import * as Haptics from "expo-haptics";

// Dummy data for posts
const POSTS = [
  {
    id: "1",
    user: {
      id: "user1",
      name: "Sarah Johnson",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    content:
      "Just finished my morning hike! The views were breathtaking today. #nature #hiking",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b",
    likes: 246,
    comments: 15,
    timestamp: "35m",
    commentsList: [
      {
        id: "c1",
        user: {
          username: "nature_lover",
          avatar: "https://randomuser.me/api/portraits/women/22.jpg",
        },
        text: "This view is absolutely stunning! Where is this hiking trail?",
        likes: 24,
        time: "20m",
      },
      {
        id: "c2",
        user: {
          username: "mountain_climber",
          avatar: "https://randomuser.me/api/portraits/men/45.jpg",
        },
        text: "The colors in this photo are incredible. What time of day was this?",
        likes: 17,
        time: "25m",
      },
      {
        id: "c3",
        user: {
          username: "adventure_seeker",
          avatar: "https://randomuser.me/api/portraits/women/30.jpg",
        },
        text: "I've been wanting to go hiking more. Any recommendations for beginner trails?",
        likes: 8,
        time: "30m",
      },
    ],
  },
  {
    id: "2",
    user: {
      id: "user2",
      name: "Mike Peters",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    content: "New gadget day! Cant wait to try this out. What do you think?",
    image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2",
    likes: 189,
    comments: 32,
    timestamp: "1h",
    commentsList: [
      {
        id: "c1",
        user: {
          username: "tech_enthusiast",
          avatar: "https://randomuser.me/api/portraits/men/36.jpg",
        },
        text: "That's a great model! I got mine last week and the battery life is amazing.",
        likes: 42,
        time: "45m",
      },
      {
        id: "c2",
        user: {
          username: "gadget_guru",
          avatar: "https://randomuser.me/api/portraits/women/50.jpg",
        },
        text: "Let me know how it performs. I'm thinking of getting one too.",
        likes: 15,
        time: "50m",
      },
    ],
  },
  {
    id: "3",
    user: {
      id: "user3",
      name: "Emma Wilson",
      avatar: "https://randomuser.me/api/portraits/women/63.jpg",
    },
    content:
      "Just got these beautiful flowers from my garden! Spring is finally here.",
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946",
    likes: 421,
    comments: 28,
    timestamp: "2h",
    commentsList: [
      {
        id: "c1",
        user: {
          username: "flower_lover",
          avatar: "https://randomuser.me/api/portraits/women/67.jpg",
        },
        text: "These are gorgeous! What varieties are you growing this year?",
        likes: 35,
        time: "1h",
      },
      {
        id: "c2",
        user: {
          username: "gardening_hobbyist",
          avatar: "https://randomuser.me/api/portraits/men/55.jpg",
        },
        text: "Your garden always looks amazing. Any tips for keeping pests away?",
        likes: 18,
        time: "1.5h",
      },
    ],
  },
  {
    id: "4",
    user: {
      id: "user4",
      name: "David Chen",
      avatar: "https://randomuser.me/api/portraits/men/86.jpg",
    },
    content:
      "Spent the weekend working on this coding project. Pretty happy with how it turned out!",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    likes: 132,
    comments: 9,
    timestamp: "3h",
    commentsList: [
      {
        id: "c1",
        user: {
          username: "fellow_coder",
          avatar: "https://randomuser.me/api/portraits/men/18.jpg",
        },
        text: "Looks great! What tech stack did you use?",
        likes: 15,
        time: "2h",
      },
      {
        id: "c2",
        user: {
          username: "dev_jane",
          avatar: "https://randomuser.me/api/portraits/women/33.jpg",
        },
        text: "Clean UI! Is the repository public? Would love to check it out.",
        likes: 12,
        time: "2.5h",
      },
    ],
  },
  {
    id: "5",
    user: {
      id: "user5",
      name: "Jessica Miller",
      avatar: "https://randomuser.me/api/portraits/women/17.jpg",
    },
    content:
      "Best coffee shop in town! If youre in the area, you have to check it out. ☕",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
    likes: 287,
    comments: 24,
    timestamp: "5h",
    commentsList: [
      {
        id: "c1",
        user: {
          username: "coffee_addict",
          avatar: "https://randomuser.me/api/portraits/women/19.jpg",
        },
        text: "I love their lattes! Did you try the new seasonal blend?",
        likes: 22,
        time: "3h",
      },
      {
        id: "c2",
        user: {
          username: "cafe_hopper",
          avatar: "https://randomuser.me/api/portraits/men/23.jpg",
        },
        text: "What's the name of this place? I need to add it to my list!",
        likes: 17,
        time: "4h",
      },
    ],
  },
];

// Stories data
const STORIES = [
  {
    id: "your-story",
    name: "Your Story",
    avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
    isYourStory: true,
    hasUnseenStory: false,
  },
  {
    id: "story1",
    name: "Emily",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    hasUnseenStory: true,
  },
  {
    id: "story2",
    name: "James",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    hasUnseenStory: true,
  },
  {
    id: "story3",
    name: "Olivia",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    hasUnseenStory: true,
  },
  {
    id: "story4",
    name: "William",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
    hasUnseenStory: false,
  },
  {
    id: "story5",
    name: "Sophia",
    avatar: "https://randomuser.me/api/portraits/women/5.jpg",
    hasUnseenStory: true,
  },
  {
    id: "story6",
    name: "Benjamin",
    avatar: "https://randomuser.me/api/portraits/men/6.jpg",
    hasUnseenStory: false,
  },
];

export default function HomeScreen() {
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);

  // State for comments modal
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [commentLiked, setCommentLiked] = useState<string[]>([]);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate a network request
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const toggleLike = (postId: string) => {
    if (likedPosts.includes(postId)) {
      setLikedPosts(likedPosts.filter((id) => id !== postId));
    } else {
      setLikedPosts([...likedPosts, postId]);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const toggleSave = (postId: string) => {
    if (savedPosts.includes(postId)) {
      setSavedPosts(savedPosts.filter((id) => id !== postId));
    } else {
      setSavedPosts([...savedPosts, postId]);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  // Comments modal functions
  const openComments = (post) => {
    setCurrentPost(post);
    setIsCommentsVisible(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const closeComments = () => {
    setIsCommentsVisible(false);
  };

  const handleCommentLike = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (commentLiked.includes(id)) {
      setCommentLiked(commentLiked.filter((itemId) => itemId !== id));
    } else {
      setCommentLiked([...commentLiked, id]);
    }
  };

  const handleReplyComment = (commentId: string) => {
    console.log(`Replying to comment ${commentId}`);
    // Implementation for replying to comments
  };

  const handlePostComment = (text: string) => {
    console.log(`New comment on post ${currentPost?.id}: ${text}`);
    // Here you would typically add the comment to your backend
  };

  const renderStoryItem = ({ item }) => (
    <TouchableOpacity style={styles.storyContainer}>
      <View
        style={[
          styles.storyAvatarBorder,
          { borderColor: item.hasUnseenStory ? colors.primary : "transparent" },
        ]}
      >
        <Image source={{ uri: item.avatar }} style={styles.storyAvatar} />
        {item.isYourStory && (
          <View
            style={[styles.addStoryButton, { backgroundColor: colors.primary }]}
          >
            <Feather name="plus" size={16} color="#FFFFFF" />
          </View>
        )}
      </View>
      <Text
        style={[styles.storyName, { color: colors.text }]}
        numberOfLines={1}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View>
      <FlatList
        data={STORIES}
        renderItem={renderStoryItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.storiesContainer}
      />
      <View style={[styles.divider, { backgroundColor: colors.divider }]} />
    </View>
  );

  const renderPost = ({ item }) => {
    const isLiked = likedPosts.includes(item.id);
    const isSaved = savedPosts.includes(item.id);

    return (
      <View style={[styles.postContainer, { backgroundColor: colors.card }]}>
        {/* Post Header */}
        <View style={styles.postHeader}>
          <View style={styles.postHeaderLeft}>
            <Image
              source={{ uri: item.user.avatar }}
              style={styles.avatarImage}
            />
            <View>
              <Text style={[styles.userName, { color: colors.text }]}>
                {item.user.name}
              </Text>
              <Text style={[styles.postTime, { color: colors.textMuted }]}>
                {item.timestamp}
              </Text>
            </View>
          </View>
          <TouchableOpacity>
            <Feather name="more-horizontal" size={20} color={colors.icon} />
          </TouchableOpacity>
        </View>

        {/* Post Content */}
        <Text style={[styles.postText, { color: colors.text }]}>
          {item.content}
        </Text>

        {/* Post Image */}
        <Image source={{ uri: item.image }} style={styles.postImage} />

        {/* Post Actions */}
        <View style={styles.postActions}>
          <View style={styles.leftActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => toggleLike(item.id)}
            >
              <Feather
                name={isLiked ? "heart" : "heart"}
                size={22}
                color={isLiked ? colors.primary : colors.icon}
                style={{ opacity: isLiked ? 1 : 0.9 }}
              />
              <Text
                style={[styles.actionText, { color: colors.textSecondary }]}
              >
                {isLiked ? item.likes + 1 : item.likes}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => openComments(item)}
            >
              <Feather
                name="message-circle"
                size={22}
                color={colors.icon}
                style={{ opacity: 0.9 }}
              />
              <Text
                style={[styles.actionText, { color: colors.textSecondary }]}
              >
                {item.comments}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Feather
                name="share-2"
                size={20}
                color={colors.icon}
                style={{ opacity: 0.9 }}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => toggleSave(item.id)}>
            <Feather
              name={isSaved ? "bookmark" : "bookmark"}
              size={22}
              color={isSaved ? colors.primary : colors.icon}
              style={{ opacity: isSaved ? 1 : 0.9 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* App Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Mafral</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="heart" size={24} color={colors.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="send" size={24} color={colors.icon} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={POSTS}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      />

      {/* Comment Modal */}
      {currentPost && (
        <CommentModal
          isVisible={isCommentsVisible}
          onClose={closeComments}
          comments={currentPost.commentsList as CommentType[]}
          onLikeComment={handleCommentLike}
          onReplyComment={handleReplyComment}
          onPostComment={handlePostComment}
          likedComments={commentLiked}
          title={`${currentPost.comments} Comments`}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 1,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginLeft: 16,
    padding: 4,
  },
  storiesContainer: {
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  storyContainer: {
    alignItems: "center",
    marginHorizontal: 8,
    width: 72,
  },
  storyAvatarBorder: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  storyAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  addStoryButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  storyName: {
    fontSize: 12,
    marginTop: 4,
    width: 70,
    textAlign: "center",
  },
  divider: {
    height: 1,
    width: "100%",
  },
  postContainer: {
    marginBottom: 16,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
  },
  postHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 15,
    fontWeight: "600",
  },
  postTime: {
    fontSize: 12,
  },
  postText: {
    paddingHorizontal: 12,
    paddingBottom: 10,
    fontSize: 14,
    lineHeight: 20,
  },
  postImage: {
    width: "100%",
    height: 300,
  },
  postActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
  },
  leftActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  actionText: {
    fontSize: 14,
    marginLeft: 6,
  },
});
