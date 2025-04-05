// components/CommentModal.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  TextInput,
  Platform,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/context/ThemeContext";

const { width, height } = Dimensions.get("window");

// Types for the comments modal
export type CommentType = {
  id: string;
  user: {
    username: string;
    avatar: string;
  };
  text: string;
  likes: number;
  time: string;
};

interface CommentModalProps {
  isVisible: boolean;
  onClose: () => void;
  comments: CommentType[];
  onLikeComment?: (id: string) => void;
  onReplyComment?: (id: string) => void;
  onPostComment?: (text: string) => void;
  title?: string;
  likedComments?: string[];
  currentUserAvatar?: string;
}

const CommentModal: React.FC<CommentModalProps> = ({
  isVisible,
  onClose,
  comments,
  onLikeComment,
  onReplyComment,
  onPostComment,
  title = "Comments",
  likedComments = [],
  currentUserAvatar = "https://randomuser.me/api/portraits/lego/1.jpg",
}) => {
  const { colors } = useTheme();
  const [commentText, setCommentText] = useState("");
  const commentsSheetY = useRef(new Animated.Value(height)).current;
  const commentsModalBgOpacity = useRef(new Animated.Value(0)).current;

  // Handle animation when visibility changes
  useEffect(() => {
    if (isVisible) {
      openModal();
    } else {
      closeModal();
    }
  }, [isVisible]);

  // Open the modal with animation
  const openModal = () => {
    Animated.parallel([
      Animated.timing(commentsSheetY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(commentsModalBgOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  // Close the modal with animation
  const closeModal = () => {
    Animated.parallel([
      Animated.timing(commentsSheetY, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(commentsModalBgOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // The parent component controls visibility, so we call onClose
      onClose();
    });
  };

  // Pan responder for draggable comments modal
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          // Only allow dragging down
          commentsSheetY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          // If dragged more than 100 pixels, close the modal
          closeModal();
        } else {
          // Otherwise, snap back to the open position
          Animated.spring(commentsSheetY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 5,
          }).start();
        }
      },
    })
  ).current;

  // Handle comment submission
  const handleSubmitComment = () => {
    if (!commentText.trim()) return;

    if (onPostComment) {
      onPostComment(commentText);
    }

    setCommentText("");
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  // Render a comment item
  const renderCommentItem = ({ item }: { item: CommentType }) => {
    const isLiked = likedComments.includes(item.id);

    return (
      <View style={styles.commentItem}>
        <Image
          source={{ uri: item.user.avatar }}
          style={styles.commentAvatar}
        />
        <View style={styles.commentContent}>
          <View style={styles.commentHeader}>
            <Text style={[styles.commentUsername, { color: colors.text }]}>
              {item.user.username}
            </Text>
            <Text style={[styles.commentTime, { color: colors.textMuted }]}>
              {item.time}
            </Text>
          </View>
          <Text style={[styles.commentText, { color: colors.text }]}>
            {item.text}
          </Text>
          <View style={styles.commentActions}>
            <TouchableOpacity
              onPress={() => onLikeComment && onLikeComment(item.id)}
              activeOpacity={0.7}
              style={styles.likeButton}
            >
              <Text
                style={[
                  styles.commentLikeText,
                  { color: colors.textSecondary },
                  isLiked && { color: colors.primary },
                ]}
              >
                Like
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.replyButton}
              onPress={() => onReplyComment && onReplyComment(item.id)}
            >
              <Text
                style={[
                  styles.commentReplyText,
                  { color: colors.textSecondary },
                ]}
              >
                Reply
              </Text>
            </TouchableOpacity>
            <View style={styles.commentLikeCount}>
              <Feather
                name="heart"
                size={12}
                color={colors.primary}
                style={{ marginRight: 4 }}
              />
              <Text
                style={[
                  styles.commentLikesNumber,
                  { color: colors.textSecondary },
                ]}
              >
                {isLiked ? item.likes + 1 : item.likes}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  if (!isVisible) return null;

  return (
    <View style={styles.modalContainer}>
      {/* Backdrop */}
      <Animated.View
        style={[styles.modalBackdrop, { opacity: commentsModalBgOpacity }]}
        onTouchStart={closeModal}
      />

      {/* Comments Sheet */}
      <Animated.View
        style={[
          styles.commentsSheet,
          {
            transform: [{ translateY: commentsSheetY }],
            backgroundColor: colors.card,
          },
        ]}
      >
        {/* Draggable Handle */}
        <View {...panResponder.panHandlers} style={styles.draggableHandle}>
          <View style={[styles.handle, { backgroundColor: colors.border }]} />
        </View>

        {/* Comments Header */}
        <View
          style={[styles.commentsHeader, { borderBottomColor: colors.border }]}
        >
          <Text style={[styles.commentsTitle, { color: colors.text }]}>
            {title}
          </Text>
          <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
            <Feather name="x" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Comments List */}
        <FlatList
          data={comments}
          renderItem={renderCommentItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.commentsList}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />

        {/* Comment Input */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={10}
          style={[
            styles.commentInputContainer,
            {
              backgroundColor: colors.card,
              borderTopColor: colors.border,
            },
          ]}
        >
          <Image
            source={{ uri: currentUserAvatar }}
            style={styles.commentInputAvatar}
          />
          <TextInput
            style={[
              styles.commentInput,
              {
                color: colors.text,
                backgroundColor: colors.surfaceVariant,
              },
            ]}
            placeholder="Add a comment..."
            placeholderTextColor={colors.textMuted}
            value={commentText}
            onChangeText={setCommentText}
            multiline
          />
          <TouchableOpacity
            style={[styles.postButton, !commentText.trim() && { opacity: 0.5 }]}
            disabled={!commentText.trim()}
            onPress={handleSubmitComment}
          >
            <Text style={[styles.postButtonText, { color: colors.primary }]}>
              Post
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    zIndex: 1000,
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  commentsSheet: {
    height: height * 0.7,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  draggableHandle: {
    width: "100%",
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    opacity: 0.7,
  },
  commentsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  closeButton: {
    padding: 5,
  },
  commentsList: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 100,
  },
  commentItem: {
    flexDirection: "row",
    marginVertical: 12,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  commentUsername: {
    fontWeight: "600",
    fontSize: 14,
    marginRight: 6,
  },
  commentTime: {
    fontSize: 12,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
  },
  commentActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  likeButton: {
    marginRight: 16,
  },
  replyButton: {
    marginRight: 16,
  },
  commentLikeText: {
    fontSize: 12,
    fontWeight: "500",
  },
  commentReplyText: {
    fontSize: 12,
    fontWeight: "500",
  },
  commentLikeCount: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentLikesNumber: {
    fontSize: 12,
  },
  commentInputContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  commentInputAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  commentInput: {
    flex: 1,
    minHeight: 36,
    maxHeight: 100,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    paddingRight: 40,
  },
  postButton: {
    position: "absolute",
    right: 20,
    bottom: 23,
  },
  postButtonText: {
    fontWeight: "600",
  },
});

export default CommentModal;
