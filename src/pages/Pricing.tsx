import React, { useState } from 'react';
import { Check, Star, Crown, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { plans } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Pricing: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleChoosePlan = (planId: string) => {
    if (!user) {
      navigate('/register');
      return;
    }
    
    // Redirect to payment with plan selection
    navigate('/payment', { state: { planId } });
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'quarterly':
        return <Star className="h-8 w-8 text-blue-600" />;
      case 'half-yearly':
        return <Crown className="h-8 w-8 text-purple-600" />;
      case 'annually':
        return <Zap className="h-8 w-8 text-orange-600" />;
      default:
        return <Star className="h-8 w-8 text-blue-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Start Your Yoga Journey
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Join our comprehensive yoga program with expert guidance
          </p>

          {/* Plan Description */}
          <div className="text-center mb-8">
            <p className="text-lg text-gray-600">
              Choose your preferred payment duration
            </p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              whileHover={{ scale: 1.02 }}
              className={`bg-white rounded-2xl shadow-xl overflow-hidden ${
                plan.popular ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
              }`}
            >
              {plan.popular && (
                <div className="bg-blue-600 text-white text-center py-2 text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <div className="p-8">
                <div className="flex items-center justify-center mb-4">
                  {getPlanIcon(plan.id)}
                </div>
                
                <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 text-center mb-6">{plan.description}</p>

                <div className="text-center mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    ₹{plan.price}
                  </span>
                  <span className="text-gray-600">/{plan.billingCycle}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                  
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">
                      {plan.maxLiveClasses === -1 ? 'Unlimited' : plan.maxLiveClasses} live classes
                    </span>
                  </li>
                  
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{plan.supportLevel}</span>
                  </li>
                </ul>

                <button
                  onClick={() => handleChoosePlan(plan.id)}
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-center transition-all duration-300 ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900 hover:scale-105'
                  }`}
                >
                  {user?.plan === plan.id ? 'Current Plan' : 'Choose Plan'}
                </button>
              </div>
            </motion.div>
          ))}
        </div> 

        {/* FAQ Section */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: 'Can I switch plans anytime?',
                answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.'
              },
              {
                question: 'Is there a free trial?',
                answer: 'Yes, all new users get a 7-day free trial to explore our platform and courses.'
              },
              {
                question: 'What payment methods do you accept?',
                answer: 'We accept all major credit cards, debit cards, UPI, and net banking through Razorpay.'
              },
              {
                question: 'Do you offer refunds?',
                answer: 'Yes, we offer a 30-day money-back guarantee if you\'re not satisfied with our courses.'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
                <h4 className="font-semibold text-gray-900 mb-2">{faq.question}</h4>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;