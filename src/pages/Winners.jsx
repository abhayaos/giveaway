import React, { useState, useEffect } from 'react';
import { Trophy, Crown, Calendar, Gift, Users, Star, Award } from 'lucide-react';

function Winners() {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');

  useEffect(() => {
    const fetchWinners = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/winners/recent');
        if (response.ok) {
          const data = await response.json();
          // Transform the data to match our UI expectations
          const transformedWinners = data.map((winner, index) => ({
            id: winner._id || index,
            name: winner.userId?.name || 'Anonymous Winner',
            prize: winner.giveawayId?.prizeName || 'Special Prize',
            date: winner.createdAt || new Date().toISOString().split('T')[0],
            avatar: `https://randomuser.me/api/portraits/${index % 2 === 0 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`,
            giveaway: winner.giveawayId?.title || 'Unknown Giveaway'
          }));
          setWinners(transformedWinners);
        } else {
          throw new Error('Failed to fetch winners');
        }
      } catch (err) {
        setError('Failed to load winners. Please try again later.');
        console.error('Error fetching winners:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWinners();
  }, []);

  const filteredWinners = winners.filter(winner => {
    if (timeFilter === 'all') return true;
    const winnerDate = new Date(winner.date);
    const now = new Date();
    const daysDiff = Math.floor((now - winnerDate) / (1000 * 60 * 60 * 24));
    
    if (timeFilter === 'week') return daysDiff <= 7;
    if (timeFilter === 'month') return daysDiff <= 30;
    return true;
  });

  const stats = {
    totalWinners: winners.length,
    totalPrizes: winners.reduce((sum, winner) => {
      const prizeValue = parseInt(winner.prize.match(/\$(\d+)/)?.[1]) || 0;
      return sum + prizeValue;
    }, 0),
    avgPrizeValue: winners.length > 0 
      ? Math.round(winners.reduce((sum, winner) => {
          const prizeValue = parseInt(winner.prize.match(/\$(\d+)/)?.[1]) || 0;
          return sum + prizeValue;
        }, 0) / winners.length)
      : 0
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading winners...</p>
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
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500 rounded-full mb-6">
            <Trophy className="text-white" size={28} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Recent Winners</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Celebrating our lucky community members who won amazing prizes
          </p>
        </div>
        
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mb-4">
              <Crown className="text-yellow-600" size={24} />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.totalWinners}</div>
            <div className="text-gray-600">Total Winners</div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
              <Gift className="text-green-600" size={24} />
            </div>
            <div className="text-3xl font-bold text-gray-900">${stats.totalPrizes}+</div>
            <div className="text-gray-600">Prizes Given</div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
              <Award className="text-blue-600" size={24} />
            </div>
            <div className="text-3xl font-bold text-gray-900">${stats.avgPrizeValue}</div>
            <div className="text-gray-600">Average Value</div>
          </div>
        </div>
        
        {/* Filter Controls */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white rounded-lg p-1 border border-gray-200">
            {[
              { value: 'all', label: 'All Time' },
              { value: 'week', label: 'Last Week' },
              { value: 'month', label: 'Last Month' }
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setTimeFilter(filter.value)}
                className={`px-6 py-2 rounded-md font-medium transition-all duration-300 ${
                  timeFilter === filter.value
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Winners Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWinners.map((winner) => (
            <div key={winner.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src={winner.avatar} 
                  alt={winner.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{winner.name}</h3>
                  <p className="text-sm text-gray-600">{winner.giveaway}</p>
                </div>
                <div className="inline-flex items-center justify-center w-8 h-8 bg-yellow-100 rounded-full">
                  <Trophy className="text-yellow-600" size={16} />
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Prize:</span>
                  <span className="font-semibold text-green-600">{winner.prize}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-semibold">{new Date(winner.date).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star size={16} />
                  <Star size={16} />
                  <Star size={16} />
                  <Star size={16} />
                  <Star size={16} />
                </div>
                <div className="text-sm text-gray-500">
                  Verified Winner
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* No Winners Message */}
        {filteredWinners.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6">
              <Trophy className="text-gray-400" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No Winners Yet</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Be the first to win! Enter our current giveaways for a chance to win amazing prizes.
            </p>
            <button className="mt-6 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-black transition-all duration-300 font-semibold">
              Enter Giveaways
            </button>
          </div>
        )}
        
        {/* How It Works */}
        <div className="mt-16 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-8 border border-yellow-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How Winners Are Selected</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                <Users className="text-yellow-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fair Selection</h3>
              <p className="text-gray-600 text-sm">
                Winners are selected through a completely random and transparent process using cryptographic algorithms.
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Star className="text-green-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Verified Results</h3>
              <p className="text-gray-600 text-sm">
                All winning selections are recorded and verified by our team to ensure complete fairness.
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Calendar className="text-blue-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Timely Notification</h3>
              <p className="text-gray-600 text-sm">
                Winners are notified within 24 hours and prizes are delivered promptly after confirmation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Winners;