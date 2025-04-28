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
import CommentModal from "@/components/models/CommentModal";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { POSTS, STORIES } from "@/constants/mediaMockData";
import { MediaPost } from "@/types/media";

export default function MediaScreen() {
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);

  // State for comments modal
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);
  const [currentPost, setCurrentPost] = useState<MediaPost | null>(null);
  const [commentLiked, setCommentLiked] = useState<string[]>([]);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate a network request
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const navigateToReels = (post: MediaPost) => {
    // Navigate to reels screen and pass the post id to display related content
    router.push({
      pathname: "/media/reels",
      params: { postId: post.id }
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
  const openComments = (post: MediaPost) => {
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

  const renderStoryItem = ({ item }: { item: { id: string; avatar: string; name: string; hasUnseenStory: boolean; isYourStory: boolean } }) => (
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

  const renderPost = ({ item }: { item: MediaPost }) => {
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

        {/* Post Image - Make it touchable to navigate to reels */}
        <TouchableOpacity onPress={() => navigateToReels(item)} activeOpacity={0.9}>
          <Image source={{ uri: item.image }} style={styles.postImage} />
          <View style={styles.reelsIndicator}>
            <Feather name="film" size={14} color="#FFFFFF" />
            <Text style={styles.reelsText}>Tap to view</Text>
          </View>
        </TouchableOpacity>

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
          comments={currentPost.commentsList}
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
  reelsIndicator: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 6,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  reelsText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginLeft: 4,
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
