import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Gift, ArrowRight, CheckCircle, Trophy, Users, Star, Calendar, Tag, Image as ImageIcon, Clock } from 'lucide-react';

function Participants() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [giveaways, setGiveaways] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchGiveaways = async () => {
      try {
        const response = await fetch('https://backend-giveaway.vercel.app/api/giveaways/active');
        if (response.ok) {
          const data = await response.json();
          setGiveaways(data);
        }
      } catch (err) {
        console.error('Error fetching giveaways:', err);
      }
    };

    fetchGiveaways();
  }, []);
  
  const enterGiveaway = (giveawayId) => {
    if (!currentUser) {
      alert('Please log in to enter giveaways');
      return;
    }
    
    // Navigate to the entry form
    navigate(`/enter-giveaway/${giveawayId}`);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading giveaways...</p>
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
          <p className="text-gray-600 mb-6">
            {error}
          </p>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Professional Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl shadow-xl mb-6">
            <Gift className="text-white" size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Active Giveaways</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Enter our featured giveaways for a chance to win incredible digital products and exclusive rewards
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium">
              <CheckCircle size={16} />
              <span>Real Prizes</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
              <Trophy size={16} />
              <span>Fair Selection</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
              <Star size={16} />
              <span>Instant Delivery</span>
            </div>
          </div>
        </div>
        
        {/* Stats Banner */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{giveaways.length}</div>
              <div className="text-sm text-gray-600">Active Giveaways</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {giveaways.reduce((sum, g) => sum + (g.prizeValue || 0), 0).toLocaleString()} Rs
              </div>
              <div className="text-sm text-gray-600">Total Prize Value</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {giveaways.reduce((sum, g) => sum + (g.totalEntries || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Total Entries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {giveaways.filter(g => new Date(g.endDate) > new Date()).length}
              </div>
              <div className="text-sm text-gray-600">Ending Soon</div>
            </div>
          </div>
        </div>
        
        {/* Giveaways Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {giveaways.map((giveaway) => (
            <div key={giveaway._id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group">
              {/* Image Section */}
              <div className="relative h-48 bg-gradient-to-r from-gray-100 to-gray-200">
                {giveaway.imageUrl ? (
                  <img 
                    src={giveaway.imageUrl} 
                    alt={giveaway.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`absolute inset-0 flex items-center justify-center ${giveaway.imageUrl ? 'hidden' : 'flex'}`}>
                  <div className="text-center">
                    <ImageIcon className="text-gray-400 mx-auto mb-2" size={32} />
                    <p className="text-gray-500 text-sm">No image available</p>
                  </div>
                </div>
                
                {/* Prize Badge */}
                <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                  {giveaway.prizeValue ? `Rs ${giveaway.prizeValue.toLocaleString()}` : 'Prize' }
                </div>
                
                {/* Status Indicator */}
                <div className="absolute top-4 left-4">
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    new Date(giveaway.endDate) < new Date() 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      new Date(giveaway.endDate) < new Date() ? 'bg-red-500' : 'bg-green-500'
                    }`}></div>
                    {new Date(giveaway.endDate) < new Date() ? 'Ended' : 'Active'}
                  </div>
                </div>
              </div>
              
              {/* Content Section */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors line-clamp-2">
                    {giveaway.title}
                  </h2>
                  <Trophy className="text-yellow-500 flex-shrink-0 ml-2" size={20} />
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {giveaway.description}
                </p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Tag size={16} />
                      <span className="text-sm">Prize:</span>
                    </div>
                    <span className="font-semibold text-gray-900">{giveaway.prizeName}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users size={16} />
                      <span className="text-sm">Entries:</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {giveaway.totalEntries || 0}/{giveaway.maxEntries || '∞'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={16} />
                      <span className="text-sm">Ends:</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {new Date(giveaway.endDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock size={16} />
                      <span className="text-sm">Type:</span>
                    </div>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                      {giveaway.prizeType || 'digital'}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => enterGiveaway(giveaway._id)}
                  disabled={!currentUser || new Date(giveaway.endDate) < new Date()}
                  className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                    currentUser && new Date(giveaway.endDate) >= new Date()
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-700 text-white hover:from-purple-700 hover:to-indigo-800 shadow-md hover:shadow-lg transform hover:-translate-y-0.5' 
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Users size={20} />
                  {new Date(giveaway.endDate) < new Date() ? 'Giveaway Ended' : 'Enter Giveaway'}
                </button>
                
                {!currentUser && (
                  <p className="text-sm text-gray-500 text-center mt-3">
                    Please log in to participate
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* No Giveaways Message */}
        {giveaways.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-2xl mb-8">
              <Star className="text-purple-600" size={40} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">No Active Giveaways</h2>
            <p className="text-xl text-gray-600 max-w-lg mx-auto mb-8">
              We're preparing exciting new giveaways for you. Check back soon for amazing opportunities!
            </p>
            <div className="inline-flex gap-4">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <Gift className="text-purple-600 mx-auto mb-3" size={28} />
                <h3 className="font-semibold text-gray-900 mb-2">Premium Prizes</h3>
                <p className="text-sm text-gray-600">High-value digital products and services</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <Trophy className="text-yellow-600 mx-auto mb-3" size={28} />
                <h3 className="font-semibold text-gray-900 mb-2">Fair Selection</h3>
                <p className="text-sm text-gray-600">Random winner selection process</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <Clock className="text-blue-600 mx-auto mb-3" size={28} />
                <h3 className="font-semibold text-gray-900 mb-2">Regular Updates</h3>
                <p className="text-sm text-gray-600">New giveaways added weekly</p>
              </div>
            </div>
                    
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              {currentUser && (
                <button
                  onClick={() => navigate('/abhaya/privilege')}
                  className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-3 px-6 rounded-lg hover:from-purple-700 hover:to-indigo-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                >
                  View My Entries
                </button>
              )}
              {currentUser && (currentUser.role === 'admin' || currentUser.role === 'organizer') && (
                <button
                  onClick={() => navigate('/abhaya/privilege')}
                  className="bg-gradient-to-r from-blue-600 to-teal-700 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-teal-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                >
                  View All User Entries
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Participants