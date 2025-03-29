
export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  regionofInterest?: string;
  imageUrl?: string;
  viewsCount: number;
  commentsCount: number;
  categories?: string;
  createdAt: string;
  updatedAt: string;
  topic?: string;
  subTopic?: string;
  trendScore?: number;
  tagline?: string;
  isFlagged: boolean;
  storyDate?: string;
  decayed_trend_score?: number;
}

export interface Comment {
  id: number;
  userId: number;
  postId: number;
  replyCount: number;
  parentId?: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  isFlagged: boolean;
  authorName?: string; // Added for display purposes
  postTitle?: string; // Added for display purposes
}

export interface Report {
  id: number;
  reason: string;
  postId: number;
  postTitle: string;
  reporterId: number;
  reporterName: string;
  createdAt: string;
}

export interface Session {
  id: number;
  userId: number;
  userName: string;
  startTime: string;
  endTime?: string;
  ipAddress: string;
  device: string;
  active: boolean;
}

export interface DashboardStats {
  totalUsers: number;
  totalPosts: number;
  totalComments: number;
}
