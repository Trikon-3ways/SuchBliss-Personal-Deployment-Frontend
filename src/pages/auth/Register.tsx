import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, User, Phone, Eye, EyeOff, Gift, ArrowLeft, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import OTPInput from '../../components/auth/OTPInput';
import PhoneInput from '../../components/auth/PhoneInput';
import toast from 'react-hot-toast';

type SignupMethod = 'phone';
type SignupStep = 'method' | 'credentials' | 'otp';

const Register: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [signupMethod, setSignupMethod] = useState<SignupMethod>('phone');
  const [currentStep, setCurrentStep] = useState<SignupStep>('credentials');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    otp: '',
    referralCode: searchParams.get('ref') || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  
  const { 
    sendPhoneOTP, 
    signupWithPhone 
  } = useAuth();
  const navigate = useNavigate();

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

  const handleMethodSelect = (method: SignupMethod) => {
    setSignupMethod(method);
    setCurrentStep('credentials');
    setFormData({ 
      ...formData, 
      phone: '', 
      otp: '' 
    });
    setOtpSent(false);
  };

  const handleSendOTP = async () => {
    setIsLoading(true);
    try {
      await sendPhoneOTP(formData.phone, 'signup');
      setOtpSent(true);
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
      await sendPhoneOTP(formData.phone, 'signup');
      startResendTimer();
      toast.success('OTP resent successfully', { duration: 1000 });
    } catch (error) {
      // Error handled in context
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep === 'credentials') {
      await handleSendOTP();
      return;
    }

    // OTP verification and signup
    setIsLoading(true);
    try {
      const signupData = {
        name: formData.name,
        otp: formData.otp,
        referralCode: formData.referralCode || undefined
      };

      await signupWithPhone({
        ...signupData,
        phone: formData.phone
      });
      
      navigate('/pricing');
    } catch (error) {
      // Error handled in context
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const isFormValid = () => {
    if (currentStep === 'credentials') {
      const hasName = formData.name.trim().length > 0;
      return hasName && formData.phone;
    } else if (currentStep === 'otp') {
      return formData.otp.length === 6;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-600">Start your yoga journey today</p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 'credentials' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
              }`}>
                1
              </div>
              <div className={`w-16 h-1 ${currentStep === 'otp' ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 'otp' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                2
              </div>
            </div>
          </div>

          {/* Step Labels */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600">
              {currentStep === 'credentials' ? 'Enter your details' : 'Verify your identity'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {currentStep === 'credentials' && (
              <>

                {/* Name Input */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                {/* Phone Input */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp Number *
                  </label>
                  <PhoneInput
                    value={formData.phone}
                    onChange={(value) => setFormData({ ...formData, phone: value })}
                    placeholder="98765 43210"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    OTP will be sent to both WhatsApp and SMS
                  </p>
                </div>

                {/* Referral Code */}
                <div>
                  <label htmlFor="referralCode" className="block text-sm font-medium text-gray-700 mb-2">
                    Referral Code (Optional)
                  </label>
                  <div className="relative">
                    <Gift className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="referralCode"
                      name="referralCode"
                      value={formData.referralCode}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter referral code to earn rewards"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Have a referral code? Enter it to earn bonus credits!
                  </p>
                </div>
              </>
            )}

            {/* OTP Verification Step */}
            {currentStep === 'otp' && (
              <>
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Enter Verification Code</h3>
                  <p className="text-gray-600 text-sm">
                    We've sent a 6-digit code to your WhatsApp and SMS{' '}
                    <span className="font-medium">
                      {formData.phone}
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
                  type="button"
                  onClick={() => {
                    setCurrentStep('credentials');
                    setOtpSent(false);
                    setFormData({ ...formData, otp: '' });
                  }}
                  className="flex items-center text-gray-600 hover:text-gray-800 text-sm mb-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Change details
                </button>
              </>
            )}

            {/* Terms Checkbox */}
            {currentStep === 'credentials' && (
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                  I agree to the{' '}
                  <Link to="/terms" className="text-blue-600 hover:text-blue-700">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-blue-600 hover:text-blue-700">
                    Privacy Policy
                  </Link>
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid() || isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 hover:scale-105 disabled:scale-100 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : currentStep === 'credentials' ? (
                'Send Verification Code'
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in here
              </Link>
            </p>
          </div>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start">
              <Shield className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-800 mb-1">Secure Registration</h4>
                <p className="text-xs text-blue-700">
                  Your information is protected with 2-step verification and encrypted storage.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;