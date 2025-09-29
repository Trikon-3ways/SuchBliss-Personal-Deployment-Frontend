import React, { useState } from 'react';
import { Copy, Share2, Gift, Users, TrendingUp, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Referrals: React.FC = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  if (!user) return null;

  const referralLink = `https://suchbliss.com/register?ref=${user.referralCode}`;
  const referralMessage = `🧘‍♀️ Join me on SuchBliss for amazing live yoga sessions! Use my referral code ${user.referralCode} and we both earn rewards! ${referralLink}`;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(user.referralCode);
      setCopied(true);
      toast.success('Referral code copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy code');
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      toast.success('Referral link copied!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleShareWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(referralMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleShareTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(referralMessage)}`;
    window.open(twitterUrl, '_blank');
  };

  // Mock referral data
  const referralStats = {
    totalReferrals: 8,
    successfulReferrals: 5,
    pendingReferrals: 3,
    thisMonthEarnings: 2500,
    totalEarnings: user.earnings,
    nextPayout: new Date('2025-02-01')
  };

  const recentReferrals = [
    { name: 'Amit Kumar', email: 'amit@example.com', status: 'completed', earnings: 500, date: new Date('2025-01-15') },
    { name: 'Priya Sharma', email: 'priya@example.com', status: 'completed', earnings: 500, date: new Date('2025-01-12') },
    { name: 'Rahul Verma', email: 'rahul@example.com', status: 'pending', earnings: 0, date: new Date('2025-01-18') }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Refer & Earn
          </h1>
          <p className="text-xl text-gray-600">
            Earn ₹500 for every friend who joins SuchBliss through your referral
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">{referralStats.totalReferrals}</h3>
                <p className="text-gray-600 text-sm">Total Referrals</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">{referralStats.successfulReferrals}</h3>
                <p className="text-gray-600 text-sm">Successful</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">₹{referralStats.thisMonthEarnings}</h3>
                <p className="text-gray-600 text-sm">This Month</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Gift className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">₹{referralStats.totalEarnings}</h3>
                <p className="text-gray-600 text-sm">Total Earned</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Share Section */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Share Your Referral</h2>
              
              {/* Referral Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Referral Code
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={user.referralCode}
                    readOnly
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg bg-gray-50"
                  />
                  <button
                    onClick={handleCopyCode}
                    className={`px-4 py-3 rounded-r-lg font-medium transition-all duration-300 ${
                      copied
                        ? 'bg-green-600 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {copied ? <CheckCircle className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Referral Link */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Referral Link
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={referralLink}
                    readOnly
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg bg-gray-50 text-sm"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-r-lg font-medium transition-colors"
                  >
                    <Copy className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">Share Via</h3>
                
                <button
                  onClick={handleShareWhatsApp}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center"
                >
                  <Share2 className="h-5 w-5 mr-2" />
                  Share on WhatsApp
                </button>
                
                <button
                  onClick={handleShareTwitter}
                  className="w-full bg-blue-400 hover:bg-blue-500 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center"
                >
                  <Share2 className="h-5 w-5 mr-2" />
                  Share on Twitter
                </button>
              </div>
            </motion.div>
          </div>

          {/* Referral History */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Referral History</h2>
              
              <div className="space-y-4 mb-8">
                {recentReferrals.map((referral, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{referral.name}</h4>
                      <p className="text-sm text-gray-500">{referral.email}</p>
                      <p className="text-xs text-gray-400">
                        {referral.date.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        referral.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {referral.status}
                      </span>
                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        ₹{referral.earnings}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Payout Info */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-2">Next Payout</h3>
                <p className="text-sm text-blue-700 mb-3">
                  Your earnings will be transferred on the 1st of every month
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-600">Next payout date:</span>
                  <span className="font-medium text-blue-900">
                    {referralStats.nextPayout.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            How Referrals Work
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Share2 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">1. Share Your Code</h3>
              <p className="text-gray-600 text-sm">
                Share your unique referral code or link with friends and family
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">2. Friend Joins</h3>
              <p className="text-gray-600 text-sm">
                When they sign up and purchase a plan using your code, you both benefit
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">3. Earn Rewards</h3>
              <p className="text-gray-600 text-sm">
                Receive ₹500 for each successful referral, paid monthly to your account
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Referrals;