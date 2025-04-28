export interface User {
  id: string;
  name: string;
  username?: string;
  avatar: string;
}

export interface Comment {
  id: string;
  user: {
    username: string;
    avatar: string;
  };
  text: string;
  likes: number;
  time: string;
}

export interface MediaPost {
  id: string;
  user: User;
  content: string;
  image: string;
  likes: number;
  comments: number;
  timestamp: string;
  commentsList: Comment[];
}

export interface Story {
  id: string;
  name: string;
  avatar: string;
  isYourStory?: boolean;
  hasUnseenStory: boolean;
}

export interface Reel {
  id: string;
  video: string;
  user: {
    id: string;
    username: string;
    avatar: string;
  };
  caption: string;
  likes: string;
  comments: string;
  shares: string;
  commentsList: Comment[];
}
