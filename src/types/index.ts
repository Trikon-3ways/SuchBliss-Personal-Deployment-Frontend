export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  plan: 'quarterly' | 'half-yearly' | 'annually';
  status: 'active' | 'inactive' | 'trial';
  role: 'user' | 'admin';
  joinedAt: Date;
  referralCode: string;
  referredBy?: string;
  earnings: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  instructor: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  features: string[];
}

export interface LiveClass {
  id: string;
  title: string;
  description: string;
  instructor: string;
  scheduledAt: Date;
  duration: number;
  youtubeUrl: string;
  maxParticipants: number;
  currentParticipants: number;
  status: 'scheduled' | 'live' | 'completed';
  plan: 'quarterly' | 'half-yearly' | 'annually';
}

export interface BlogPost {
  id: string;
  title: string; 
  content: string;
  author: string;
  publishedAt: Date;
  category: string;
  image: string;
  readTime: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  type: 'workshop' | 'webinar' | 'conference';
  image: string;
  registrationUrl?: string;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingCycle: 'quarterly' | 'half-yearly' | 'annually';
  features: string[];
  popular?: boolean;
  maxLiveClasses: number;
  supportLevel: string;
}

export interface Order {
  id: string;
  userId: string;
  planId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentId?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  activeLiveClasses: number;
  totalReferrals: number;
}