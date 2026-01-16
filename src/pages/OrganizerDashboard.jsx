import React, { useState, useEffect } from 'react';
import { Gift, Plus, Users, Eye, Edit, Trash2, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function OrganizerDashboard() {
  const [giveaways, setGiveaways] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [approvalStatusChecked, setApprovalStatusChecked] = useState(false);
  
  const { updateUserProfile } = useAuth();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isApproved = user.isApproved;

  useEffect(() => {
    const fetchGiveaways = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://backend-giveaway.vercel.app/api/giveaways', {
          headers: {
            'x-auth-token': token,
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Filter giveaways to show only those created by the current organizer
          const user = JSON.parse(localStorage.getItem('user'));
          const userGiveaways = data.filter(giveaway => giveaway.createdBy._id === user._id);
          setGiveaways(userGiveaways);
        }
      } catch (err) {
        console.error('Error fetching giveaways:', err);
      }
    };

    fetchGiveaways();
  }, []);

  const handleEdit = async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`https://backend-giveaway.vercel.app/api/giveaways/${id}`, {
      method: 'PUT',
      headers: {
        'x-auth-token': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'draft' }), // Example update
    });

    if (response.ok) {
      const updatedGiveaway = await response.json();
      // Update local state
      setGiveaways(prev => prev.map(g => g._id === id ? updatedGiveaway : g));
    }
  };

  useEffect(() => {
    fetchOrganizerGiveaways();
    
    // Set up interval to check for approval status changes if not approved
    if (!isApproved && !approvalStatusChecked) {
      const approvalCheckInterval = setInterval(async () => {
        try {
          const updatedUserData = await updateUserProfile();
          if (updatedUserData && updatedUserData.isApproved && !user.isApproved) {
            // Approval status changed, refresh the page
            window.location.reload();
          }
        } catch (err) {
          console.error('Error checking approval status:', err);
        }
      }, 5000); // Check every 5 seconds
      
      setApprovalStatusChecked(true);
      
      // Cleanup interval on component unmount
      return () => {
        clearInterval(approvalCheckInterval);
      };
    }
  }, [isApproved, approvalStatusChecked]);

  const fetchOrganizerGiveaways = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://backend-giveaway.vercel.app/api/giveaways', {
        headers: {
          'x-auth-token': token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Filter giveaways created by this user
        const userGiveaways = data.filter(giveaway => 
          giveaway.createdBy._id === JSON.parse(localStorage.getItem('user')).id
        );
        setGiveaways(userGiveaways);
      } else {
        throw new Error('Failed to fetch giveaways');
      }
    } catch (err) {
      setError('Failed to load your giveaways. Please try again.');
      console.error('Error fetching giveaways:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteGiveaway = async (id) => {
    if (!window.confirm('Are you sure you want to delete this giveaway? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://backend-giveaway.vercel.app/api/giveaways/${id}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token,
        },
      });

      if (response.ok) {
        fetchOrganizerGiveaways(); // Refresh the list
      } else {
        throw new Error('Failed to delete giveaway');
      }
    } catch (err) {
      alert('Failed to delete giveaway. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your giveaways...</p>
        </div>
      </div>
    );
  }
    
  if (!isApproved) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-6">
            <svg className="text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" size="28">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Account Pending Approval</h1>
          <p className="text-xl text-gray-600 mb-6">
            Your organizer account is currently under review. Please wait for admin approval.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <p className="text-gray-700">
              Once approved, you'll be able to create and manage giveaways. We're automatically checking for approval status changes.
            </p>
          </div>
          <div className="space-y-4">
            <p className="text-gray-600">
              You'll be automatically redirected once your account is approved!
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-semibold"
            >
              Refresh Status
            </button>
          </div>
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-6">
            <BarChart3 className="text-white" size={28} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Organizer Dashboard</h1>
          <p className="text-xl text-gray-600">Manage your giveaways and track participation</p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Your Giveaways</h2>
          <Link 
            to="/create-giveaway"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300 font-semibold"
          >
            <Plus size={20} />
            Create New Giveaway
          </Link>
        </div>
        
        {/* Giveaways Grid */}
        {giveaways.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6">
              <Gift className="text-gray-400" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No Giveaways Yet</h2>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              You haven't created any giveaways yet. Start by creating your first exciting giveaway!
            </p>
            <Link 
              to="/create-giveaway"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300 font-semibold"
            >
              <Plus size={20} />
              Create Your First Giveaway
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {giveaways.map((giveaway) => (
              <div key={giveaway._id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                {giveaway.imageUrl && (
                  <div className="mb-4">
                    <img 
                      src={giveaway.imageUrl} 
                      alt={giveaway.title} 
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </div>
                )}
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{giveaway.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{giveaway.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Prize:</span>
                    <span className="font-semibold">{giveaway.prizeName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Value:</span>
                    <span className="font-semibold text-green-600">${giveaway.prizeValue}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Entries:</span>
                    <span className="font-semibold">{giveaway.totalEntries}/{giveaway.maxEntries}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ends:</span>
                    <span className="font-semibold">{new Date(giveaway.endDate).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    giveaway.isActive && new Date(giveaway.endDate) >= new Date()
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {giveaway.isActive && new Date(giveaway.endDate) >= new Date() ? 'Active' : 'Ended'}
                  </span>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(giveaway._id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Giveaway"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => deleteGiveaway(giveaway._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Giveaway"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrganizerDashboard;