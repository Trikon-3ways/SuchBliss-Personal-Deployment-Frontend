import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface OTPRequest {
  phone?: string;
  purpose: 'signup' | 'signin' | 'password_reset';
}

export interface SignupData {
  name: string;
  phone?: string;
  otp: string;
  referralCode?: string;
}

export interface SigninData {
  phone?: string;
  email?: string;
  password?: string;
  otp?: string;
}

export interface ResetPasswordData {
  identifier: string;
  otp: string;
  newPassword: string;
  type: 'email' | 'phone';
}

export interface VideoScheduleData {
  title: string;
  description: string;
  youtubeUrl: string;
  scheduleDate: string; // ISO string
  scheduleTime: string; // ISO string
  duration?: number;
  category?: string;
}

class AuthAPI {
  // Send OTP to phone
  async sendPhoneOTP(data: OTPRequest) {
    const response = await api.post('/auth/send-phone-otp', data);
    return response.data;
  }

  // Signup with phone
  async signupWithPhone(data: SignupData) {
    const response = await api.post('/auth/signup/phone', data);
    return response.data;
  }

  // Signin with phone OTP
  async signinWithPhone(data: SigninData) {
    const response = await api.post('/auth/signin/phone', data);
    return response.data;
  }

  // Admin login
  async signinAsAdmin(data: SigninData) {
    const response = await api.post('/auth/signin/admin', data);
    return response.data;
  }

  // Reset password
  async resetPassword(data: ResetPasswordData) {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  }

  // Get user profile
  async getProfile() {
    const response = await api.get('/auth/profile');
    return response.data;
  }
}

class VideoAPI {
  // Schedule a video
  async scheduleVideo(data: VideoScheduleData) {
    // Use test endpoint for now (no authentication required)
    const response = await api.post('/test-videos/schedule', data);
    return response.data;
  }

  // Get all scheduled videos
  async getScheduledVideos() {
    // Use test endpoint to avoid auth redirect when admin uses local admin token
    const response = await api.get('/test-videos/scheduled');
    return response.data;
  }

  // Update a scheduled video
  async updateScheduledVideo(id: string, data: Partial<VideoScheduleData>) {
    const response = await api.put(`/videos/scheduled/${id}`, data);
    return response.data;
  }

  // Delete a scheduled video
  async deleteScheduledVideo(id: string) {
    const response = await api.delete(`/videos/scheduled/${id}`);
    return response.data;
  }

  // Get video by ID
  async getVideoById(id: string) {
    const response = await api.get(`/videos/${id}`);
    return response.data;
  }
}

export const authAPI = new AuthAPI();
export const videoAPI = new VideoAPI();

// Blog API
export interface BlogData {
  title: string;
  content: string; 
  tags?: string[];
  category: string;
  featuredImage?: string;
}

class BlogAPI {
  // Create a new blog post
  async createBlog(data: BlogData) {
    // Use test endpoint for now (no authentication required)
    const response = await api.post('/test-blogs', data);
    return response.data;
  }

  // Get blogs by author
  async getMyBlogs(page = 1, limit = 10, status?: string) {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (status) params.append('status', status);
    
    const response = await api.get(`/blogs/author/my-blogs?${params}`);
    return response.data;
  }

  // Get published blogs
  async getPublishedBlogs(page = 1, limit = 10, category?: string, tag?: string) {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (category) params.append('category', category);
    if (tag) params.append('tag', tag);
    
    // Use test endpoint for now (no authentication required)
    const response = await api.get(`/test-blogs/published?${params}`);
    return response.data;
  }

  // Get blog by ID
  async getBlogById(id: string) {
    const response = await api.get(`/blogs/${id}`);
    return response.data;
  }

  // Update blog
  async updateBlog(id: string, data: Partial<BlogData>) {
    const response = await api.put(`/blogs/${id}`, data);
    return response.data;
  }

  // Delete blog
  async deleteBlog(id: string) {
    const response = await api.delete(`/blogs/${id}`);
    return response.data;
  }
}

export const blogAPI = new BlogAPI();

// Payment API
export interface PaymentOrderData {
  amount: number;
  currency?: string;
  plan_id: string;
}

export interface PaymentVerificationData {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  plan_id: string;
  amount: number;
}

export interface PaymentVerificationResponse {
  success: boolean;
  message: string;
  payment?: {
    id: string;
    amount: number;
    currency: string;
    status: string;
  };
  user?: {
    plan: string;
    status: string;
  };
}

class PaymentAPI {
  // Create payment order
  async createOrder(data: PaymentOrderData) {
    const response = await api.post('/payments/create-order', data);
    return response.data;
  }

  // Verify payment
  async verifyPayment(data: PaymentVerificationData) {
    const response = await api.post('/payments/verify', data);
    return response.data;
  }

  // Get payment history
  async getPaymentHistory() {
    const response = await api.get('/payments/history');
    return response.data;
  }

  // Cancel subscription
  async cancelSubscription() {
    const response = await api.post('/payments/cancel');
    return response.data;
  }
}

export const paymentAPI = new PaymentAPI();

// Admin API interfaces
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  trialUsers: number;
  recentUsers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  activeLiveClasses: number;
  totalReferrals: number;
  planDistribution: Record<string, number>;
  monthlyRevenueData: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
}

export interface AdminUser {
  id: string;
  name: string;
  phone: string;
  plan: string;
  status: string;
  referralCode: string;
  earnings: number;
  phoneVerified: boolean;
  joinedAt: string;
  lastPayment: string | null;
  totalSpent: number;
}

export interface AdminOrder {
  id: string;
  customer: string;
  phone: string;
  plan: string;
  amount: number;
  currency: string;
  status: string;
  paymentId: string;
  paidAt: string;
  verifiedAt: string;
}

export interface ContentAnalytics {
  videos: {
    total: number;
    scheduled: number;
    completed: number;
  };
  blogs: {
    total: number;
    published: number;
  };
  recentVideos: Array<{
    id: string;
    title: string;
    instructor: string;
    scheduledAt: string;
    status: string;
  }>;
  recentBlogs: Array<{
    id: string;
    title: string;
    author: string;
    publishedAt: string;
    status: string;
  }>;
}

class AdminAPI {
  // Dashboard statistics
  async getDashboardStats() {
    const response = await api.get('/admin/stats');
    return response.data;
  }
  
  // User management
  async getUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    plan?: string;
  }) {
    const response = await api.get('/admin/users', { params });
    return response.data;
  }
  
  async updateUserStatus(userId: string, status: string) {
    const response = await api.patch(`/admin/users/${userId}/status`, { status });
    return response.data;
  }
  
  async exportUsers() {
    const response = await api.get('/admin/users/export', { responseType: 'blob' });
    return response.data;
  }
  
  // Order management
  async getOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
    plan?: string;
  }) {
    const response = await api.get('/admin/orders', { params });
    return response.data;
  }
  
  async getRazorpayPayments(params?: {
    page?: number;
    limit?: number;
    from?: string;
    to?: string;
  }) {
    const response = await api.get('/admin/razorpay-payments', { params });
    return response.data;
  }
  
  // Content analytics
  async getContentAnalytics() {
    const response = await api.get('/admin/content-analytics');
    return response.data;
  }
}

export const adminAPI = new AdminAPI();
export default api;