import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Shield, CheckCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { plans } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { paymentAPI, PaymentOrderData, PaymentVerificationData, PaymentVerificationResponse } from '../services/api';
import { loadRazorpayScript, RAZORPAY_CONFIG } from '../config/razorpay';
import toast from 'react-hot-toast';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Payment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  
  const planId = location.state?.planId || 'quarterly';
  const selectedPlan = plans.find(p => p.id === planId) || plans[0];
  
  // Use plan price directly
  const amount = selectedPlan.price;

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpay = async () => {
      const loaded = await loadRazorpayScript();
      setRazorpayLoaded(loaded);
      if (!loaded) {
        toast.error('Failed to load payment system. Please refresh the page.');
      }
    };
    loadRazorpay();
  }, []);

  const handlePayment = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!razorpayLoaded) {
      toast.error('Payment system is not ready. Please wait a moment.');
      return;
    }

    setIsLoading(true);

    try {
      // Create order on backend
      const orderData: PaymentOrderData = {
        amount,
        currency: 'INR',
        plan_id: planId
      };

      console.log('🔄 Creating payment order...', orderData);
      const orderResponse = await paymentAPI.createOrder(orderData);
      
      console.log('📋 Order response:', orderResponse);
      
      if (!orderResponse.success) {
        console.error('❌ Order creation failed:', orderResponse.message);
        throw new Error(orderResponse.message);
      }

      const order = orderResponse.order;
      const razorpayKeyId = orderResponse.razorpay_key_id;

      // Check if we got the Razorpay key from backend
      if (!razorpayKeyId) {
        throw new Error('Razorpay key not provided by server');
      }

      // Razorpay options
      const options = {
        key: razorpayKeyId,
        amount: order.amount,
        currency: order.currency,
        name: RAZORPAY_CONFIG.name,
        description: `${selectedPlan.name} Plan Subscription`,
        image: RAZORPAY_CONFIG.image,
        order_id: order.id,
        handler: async function (response: any) {
          try {
            console.log('💳 Payment response received:', response);
            
            // Verify payment on backend
            const verificationData: PaymentVerificationData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan_id: planId,
              amount: amount
            };

            console.log('🔍 Sending verification data:', verificationData);
            const verificationResponse: PaymentVerificationResponse = await paymentAPI.verifyPayment(verificationData);
            console.log('✅ Verification response:', verificationResponse);
            
            if (verificationResponse.success) {
              // Enhanced success message with payment details
              const paymentDetails = verificationResponse.payment;
              const userDetails = verificationResponse.user;
              
              toast.success(`Payment successful! ${userDetails.plan} plan activated. You can now access live classes!`);
              
              // Refresh user profile to get updated plan and status
              await refreshProfile();
              
              // Show additional success info
              setTimeout(() => {
                toast.success(`Amount: ₹${(paymentDetails.amount / 100).toLocaleString()} ${paymentDetails.currency}`);
              }, 1000);
              
              // Navigate to live classes page after successful payment
              navigate('/live-classes');
            } else {
              throw new Error(verificationResponse.message);
            }
          } catch (error: any) {
            console.error('❌ Payment verification error:', error);
            
            // Enhanced error handling
            if (error.message.includes('signature')) {
              toast.error('Payment verification failed: Invalid signature. Please contact support.');
            } else if (error.message.includes('amount')) {
              toast.error('Payment verification failed: Amount mismatch. Please contact support.');
            } else if (error.message.includes('status')) {
              toast.error('Payment verification failed: Payment not captured. Please try again.');
            } else {
              toast.error(`Payment verification failed: ${error.message}`);
            }
          } finally {
            setIsLoading(false);
          }
        },
        prefill: {
          name: user.name,
          email: user.email || '',
          contact: user.phone || ''
        },
        notes: {
          plan_id: planId,
          user_id: user.id
        },
        theme: RAZORPAY_CONFIG.theme,
        modal: {
          ondismiss: function() {
            setIsLoading(false);
            toast.error('Payment cancelled');
          }
        }
      };

      console.log('🚀 Opening Razorpay modal with options:', options);
      
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <button
            onClick={() => navigate('/pricing')}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Pricing
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Complete Your Purchase</h1>
          <p className="text-xl text-gray-600">Secure payment powered by Razorpay</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Order Summary */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="border-b pb-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedPlan.name} Plan
                    </h3>
                    <p className="text-gray-600">{selectedPlan.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      ₹{amount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      per {selectedPlan.billingCycle}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <h4 className="font-semibold text-gray-900">Included Features:</h4>
                {selectedPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-6">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Amount:</span>
                  <span className="text-blue-600">₹{amount.toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Billed {selectedPlan.billingCycle} • Cancel anytime
                </p>
              </div>
            </motion.div>
          </div>

          {/* Payment Form */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Details</h2>

              {/* Security Notice */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-green-800">
                      Secure Payment
                    </h3>
                    <p className="text-sm text-green-700 mt-1">
                      Your payment is processed securely through Razorpay with 256-bit SSL encryption.
                    </p>
                  </div>
                </div>
              </div>

              {/* Razorpay Payment Button */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Pay with Razorpay
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Supports Credit Card, Debit Card, UPI, Net Banking, and Wallets
                  </p>
                  
                  <button
                    onClick={handlePayment}
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-4 px-6 rounded-lg font-semibold transition-all duration-300 hover:scale-105 disabled:scale-100 flex items-center justify-center"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        Pay ₹{amount.toLocaleString()}
                        <CreditCard className="h-5 w-5 ml-2" />
                      </>
                    )}
                  </button>
                </div>

                {/* Payment Methods */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Accepted Payment Methods:</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                    <div>• Credit Cards (Visa, MasterCard)</div>
                    <div>• Debit Cards</div>
                    <div>• UPI (GPay, PhonePe, Paytm)</div>
                    <div>• Net Banking</div>
                    <div>• Digital Wallets</div>
                    <div>• EMI Options Available</div>
                  </div>
                </div>

                {/* Terms */}
                <div className="text-xs text-gray-500">
                  <p>
                    By completing this purchase, you agree to our{' '}
                    <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>{' '}
                    and{' '}
                    <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
                    You can cancel your subscription at any time.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Money Back Guarantee */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-green-50 rounded-2xl p-6 mt-6"
            >
              <div className="text-center">
                <Shield className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-green-800 mb-2">
                  30-Day Money-Back Guarantee
                </h3>
                <p className="text-green-700 text-sm">
                  Not satisfied? Get a full refund within 30 days, no questions asked.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;