import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, SignupData, SigninData, ResetPasswordData } from '../services/api';
import toast from 'react-hot-toast';

interface User {
  id: string;
  phone?: string;
  name: string;
  plan: 'quarterly' | 'half-yearly' | 'annually';
  status: 'active' | 'inactive' | 'trial';
  role: 'user' | 'admin';
  referralCode: string;
  earnings: number;
  phoneVerified: boolean;
  joinedAt: Date;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  
  // OTP methods
  sendPhoneOTP: (phone: string, purpose: 'signup' | 'signin' | 'password_reset') => Promise<void>;
  
  // Signup methods
  signupWithPhone: (data: SignupData) => Promise<void>;
  
  // Signin methods
  signinWithPhone: (data: SigninData) => Promise<void>;
  signinAsAdmin: (data: SigninData) => Promise<void>;
  
  // Password reset
  resetPassword: (data: ResetPasswordData) => Promise<void>;
  
  // General methods
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        const response = await authAPI.getProfile();
        if (response.success) {
          setUser({
            ...response.user,
            joinedAt: new Date(response.user.joinedAt)
          });
        } else {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  };

  const sendPhoneOTP = async (phone: string, purpose: 'signup' | 'signin' | 'password_reset') => {
    try {
      const response = await authAPI.sendPhoneOTP({ phone, purpose });
      if (response.success) {
        toast.success(response.message, { duration: 1000 });
      } else {
        toast.error(response.message, { duration: 1500 });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to send OTP';
      toast.error(message, { duration: 1500 });
      throw new Error(message);
    }
  };

  const signupWithPhone = async (data: SignupData) => {
    try {
      const response = await authAPI.signupWithPhone(data);
      if (response.success) {
        localStorage.setItem('authToken', response.token);
        setUser({
          ...response.user,
          joinedAt: new Date()
        });
        toast.success(response.message, { duration: 1000 });
      } else {
        toast.error(response.message, { duration: 1500 });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Signup failed';
      toast.error(message, { duration: 1500 });
      throw new Error(message);
    }
  };

  const signinWithPhone = async (data: SigninData) => {
    try {
      const response = await authAPI.signinWithPhone(data);
      if (response.success) {
        localStorage.setItem('authToken', response.token);
        setUser({
          ...response.user,
          joinedAt: new Date(response.user.joinedAt)
        });
        toast.success(response.message, { duration: 1000 });
      } else {
        toast.error(response.message, { duration: 1500 });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Signin failed';
      toast.error(message, { duration: 1500 });
      throw new Error(message);
    }
  };

  const signinAsAdmin = async (data: SigninData) => {
    try {
      const response = await authAPI.signinAsAdmin(data);
      
      if (response.success) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
        toast.success('Admin login successful!', { duration: 1000 });
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Admin login failed';
      toast.error(message, { duration: 1500 });
      throw new Error(message);
    }
  };

  const resetPassword = async (data: ResetPasswordData) => {
    try {
      const response = await authAPI.resetPassword(data);
      if (response.success) {
        toast.success(response.message, { duration: 1000 });
      } else {
        toast.error(response.message, { duration: 1500 });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Password reset failed';
      toast.error(message, { duration: 1500 });
      throw new Error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully', { duration: 1000 });
  };

  const refreshProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      if (response.success) {
        setUser({
          ...response.user,
          joinedAt: new Date(response.user.joinedAt)
        });
      }
    } catch (error) {
      console.error('Profile refresh error:', error);
    }
  };

  const value = {
    user,
    isLoading,
    sendPhoneOTP,
    signupWithPhone,
    signinWithPhone,
    signinAsAdmin,
    resetPassword,
    logout,
    refreshProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};