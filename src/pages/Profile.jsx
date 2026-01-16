import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, DollarSign, Copy, Share2, Trophy, Users, Star } from 'lucide-react';

function Profile() {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (currentUser) {
        try {
          const response = await fetch(`https://backend-giveaway.vercel.app/api/users/${currentUser.id}`, {
            headers: {
              'x-auth-token': localStorage.getItem('token'),
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUserProfile(userData);
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      }
    };

    fetchUserProfile();
  }, [currentUser]);

  const copyReferralCode = () => {
    navigator.clipboard.writeText(userData?.referralCode || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareReferral = () => {
    if (navigator.share && userData?.referralCode) {
      navigator.share({
        title: 'Join Our Giveaway!',
        text: 'Join this amazing giveaway platform and earn rewards!',
        url: `${window.location.origin}?ref=${userData.referralCode}`
      }).catch(console.error);
    } else {
      copyReferralCode();
      alert('Referral link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-red-100 rounded-xl p-8 text-center border border-red-200">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-200 rounded-full mb-6">
            <span className="text-red-600 text-2xl font-bold">!</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-black transition-all duration-300 font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 rounded-full mb-6">
            <User className="text-white" size={28} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Profile</h1>
          <p className="text-xl text-gray-600">Manage your account and track your earnings</p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Personal Info Card */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="flex items-center gap-3">
                    <User className="text-gray-400" size={20} />
                    <span className="text-gray-900">{userData?.name || currentUser?.name || 'N/A'}</span>
                  </div>
                </div>
                            
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="flex items-center gap-3">
                    <Mail className="text-gray-400" size={20} />
                    <span className="text-gray-900">{userData?.email || currentUser?.email || 'N/A'}</span>
                  </div>
                </div>
                            
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="flex items-center gap-3">
                    <Phone className="text-gray-400" size={20} />
                    <span className="text-gray-900">{userData?.phone || currentUser?.phone || 'N/A'}</span>
                  </div>
                </div>
                            
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Type
                  </label>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      (userData?.role === 'organizer' && userData?.isApproved) || userData?.role === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : userData?.role === 'organizer' && !userData?.isApproved
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {userData?.role === 'admin' && 'Administrator'}
                      {userData?.role === 'organizer' && userData?.isApproved && 'Organizer'}
                      {userData?.role === 'organizer' && !userData?.isApproved && 'Organizer (Pending Approval)'}
                      {userData?.role === 'user' && 'Customer'}
                      {!userData?.role && 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Referral Program Card */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Referral Program</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Referral Code
                  </label>
                  <div className="flex gap-3">
                    <div className="flex-1 flex items-center bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
                      <span className="text-gray-900 font-mono">{userData?.referralCode || 'N/A'}</span>
                    </div>
                    <button
                      onClick={copyReferralCode}
                      className="px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-black transition-all duration-300 flex items-center gap-2"
                    >
                      <Copy size={20} />
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Share Your Referral Link
                  </label>
                  <div className="flex gap-3">
                    <div className="flex-1 flex items-center bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
                      <span className="text-gray-900 text-sm truncate">
                        {userData?.referralCode ? `${window.location.origin}?ref=${userData.referralCode}` : 'N/A'}
                      </span>
                    </div>
                    <button
                      onClick={shareReferral}
                      className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center gap-2"
                    >
                      <Share2 size={20} />
                      Share
                    </button>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-2">How It Works</h3>
                  <p className="text-blue-800 text-sm">
                    Earn ${userData?.referralEarnings?.toFixed(2) || '0.00'} for each successful referral! 
                    When someone joins using your referral code and enters a giveaway, you earn money.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats Sidebar */}
          <div className="space-y-8">
            
            {/* Earnings Card */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Total Earnings</h3>
                <DollarSign size={24} />
              </div>
              <div className="text-3xl font-bold mb-2">${userData?.referralEarnings?.toFixed(2) || '0.00'}</div>
              <p className="text-green-100 text-sm">Earned through referrals</p>
            </div>
            
            {/* Stats Cards */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Stats</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Users className="text-gray-400" size={18} />
                    <span className="text-gray-600">Referred Users</span>
                  </div>
                  <span className="font-semibold">{userData?.referralsCount || 0}</span>
                </div>
                
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Trophy className="text-gray-400" size={18} />
                    <span className="text-gray-600">Giveaways Entered</span>
                  </div>
                  <span className="font-semibold">{userData?.entriesCount || 0}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Star className="text-gray-400" size={18} />
                    <span className="text-gray-600">Completed Actions</span>
                  </div>
                  <span className="font-semibold">{userData?.completedActions || 0}</span>
                </div>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  {userData?.recentActivity?.length > 0 
                    ? userData.recentActivity.slice(0, 3).map((activity, index) => (
                        <div key={index} className="py-2 border-b border-gray-100 last:border-b-0">
                          <div className="font-medium">{activity.action}</div>
                          <div className="text-xs text-gray-500">{new Date(activity.date).toLocaleDateString()}</div>
                        </div>
                      ))
                    : 'No recent activity'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;