import { MediaPost, Story, Reel } from "@/types/media";

// Stories data
export const STORIES: Story[] = [
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

// Dummy data for posts
export const POSTS: MediaPost[] = [
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

// Dummy data for reels
export const REELS: Reel[] = [
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
