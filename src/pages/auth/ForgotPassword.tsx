import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, ArrowLeft, CheckCircle, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import OTPInput from '../../components/auth/OTPInput';
import toast from 'react-hot-toast';

type ResetMethod = 'email' | 'phone';
type ResetStep = 'method' | 'identifier' | 'otp' | 'password' | 'success';

const ForgotPassword: React.FC = () => {
  const [resetMethod, setResetMethod] = useState<ResetMethod>('email');
  const [currentStep, setCurrentStep] = useState<ResetStep>('method');
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  
  const { sendEmailOTP, sendPhoneOTP, resetPassword } = useAuth();

  // Start resend timer
  const startResendTimer = () => {
    setResendTimer(60);
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleMethodSelect = (method: ResetMethod) => {
    setResetMethod(method);
    setCurrentStep('identifier');
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (resetMethod === 'email') {
        await sendEmailOTP(formData.email, 'password_reset');
      } else {
        await sendPhoneOTP(formData.phone, 'password_reset');
      }
      setCurrentStep('otp');
      startResendTimer();
    } catch (error) {
      // Error handled in context
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    
    setIsLoading(true);
    try {
      if (resetMethod === 'email') {
        await sendEmailOTP(formData.email, 'password_reset');
      } else {
        await sendPhoneOTP(formData.phone, 'password_reset');
      }
      startResendTimer();
      toast.success('OTP resent successfully', { duration: 1000 });
    } catch (error) {
      // Error handled in context
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.otp.length === 6) {
      setCurrentStep('password');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match', { duration: 1500 });
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters', { duration: 1500 });
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword({
        identifier: resetMethod === 'email' ? formData.email : formData.phone,
        otp: formData.otp,
        newPassword: formData.newPassword,
        type: resetMethod
      });
      setCurrentStep('success');
    } catch (error) {
      // Error handled in context
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      // Remove any non-digit characters except +
      let cleanedValue = value.replace(/[^\d+]/g, '');
      
      // If user starts typing without +91, auto-add it
      if (cleanedValue.length > 0 && !cleanedValue.startsWith('+91')) {
        // If it starts with 91, add +
        if (cleanedValue.startsWith('91')) {
          cleanedValue = '+' + cleanedValue;
        } else {
          // If it's just digits, add +91
          cleanedValue = '+91' + cleanedValue;
        }
      }
      
      // Limit to 13 characters (+91 + 10 digits)
      if (cleanedValue.length > 13) {
        cleanedValue = cleanedValue.substring(0, 13);
      }
      
      setFormData({
        ...formData,
        [name]: cleanedValue
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  if (currentStep === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Password Reset Successful</h1>
          <p className="text-gray-600 mb-8">
            Your password has been successfully reset. You can now sign in with your new password.
          </p>
          
          <Link
            to="/login"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors inline-block"
          >
            Sign In Now
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
          <p className="text-gray-600">
            {currentStep === 'method' ? 'Choose your preferred reset method' :
             currentStep === 'identifier' ? 'Enter your account details' :
             currentStep === 'otp' ? 'Enter the verification code' :
             'Create your new password'}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-2">
            {['method', 'identifier', 'otp', 'password'].map((step, index) => (
              <React.Fragment key={step}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  ['method', 'identifier', 'otp', 'password'].indexOf(currentStep) >= index
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {index + 1}
                </div>
                {index < 3 && (
                  <div className={`w-8 h-1 ${
                    ['method', 'identifier', 'otp', 'password'].indexOf(currentStep) > index
                      ? 'bg-blue-600'
                      : 'bg-gray-200'
                  }`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Method Selection */}
        {currentStep === 'method' && (
          <div className="space-y-4">
            <button
              onClick={() => handleMethodSelect('email')}
              className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
            >
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <div className="font-medium text-gray-900">Reset via Email</div>
                  <div className="text-sm text-gray-500">Get OTP on your registered email</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleMethodSelect('phone')}
              className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
            >
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <div className="font-medium text-gray-900">Reset via Phone</div>
                  <div className="text-sm text-gray-500">Get OTP on your registered phone</div>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Identifier Input */}
        {currentStep === 'identifier' && (
          <form onSubmit={handleSendOTP} className="space-y-6">
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-2">
                {resetMethod === 'email' ? 'Email Address' : 'Phone Number'}
              </label>
              <div className="relative">
                {resetMethod === 'email' ? (
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                ) : (
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                )}
                <input
                  type={resetMethod === 'email' ? 'email' : 'tel'}
                  id="identifier"
                  name={resetMethod === 'email' ? 'email' : 'phone'}
                  required
                  value={resetMethod === 'email' ? formData.email : formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={resetMethod === 'email' ? 'your.email@example.com' : '+91 98765 43210'}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 hover:scale-105 disabled:scale-100 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Send Verification Code'
              )}
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep('method')}
              className="flex items-center text-gray-600 hover:text-gray-800 text-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Choose different method
            </button>
          </form>
        )}

        {/* OTP Verification */}
        {currentStep === 'otp' && (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div className="text-center mb-6">
              <p className="text-gray-600 text-sm">
                Enter the 6-digit code sent to{' '}
                <span className="font-medium">
                  {resetMethod === 'email' ? formData.email : formData.phone}
                </span>
              </p>
            </div>

            <div className="mb-6">
              <OTPInput
                length={6}
                value={formData.otp}
                onChange={(value) => setFormData({ ...formData, otp: value })}
                disabled={isLoading}
                autoFocus
              />
            </div>

            <div className="text-center mb-6">
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={resendTimer > 0 || isLoading}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
              </button>
            </div>

            <button
              type="submit"
              disabled={formData.otp.length !== 6 || isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 hover:scale-105 disabled:scale-100"
            >
              Verify Code
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep('identifier')}
              className="flex items-center text-gray-600 hover:text-gray-800 text-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Change {resetMethod === 'email' ? 'email' : 'phone number'}
            </button>
          </form>
        )}

        {/* New Password */}
        {currentStep === 'password' && (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                required
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Confirm new password"
              />
            </div>

            <button
              type="submit"
              disabled={!formData.newPassword || !formData.confirmPassword || isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 hover:scale-105 disabled:scale-100 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
        )}

        {/* Back to Login */}
        <div className="mt-8 text-center">
          <Link
            to="/login"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Link>
        </div>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start">
            <Shield className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-800 mb-1">Secure Reset Process</h4>
              <p className="text-xs text-blue-700">
                Your password reset is protected with 2-step verification for maximum security.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;