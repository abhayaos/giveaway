import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { User, Phone, MapPin, MessageSquare, Gift, CheckCircle, ArrowLeft, Calendar, Users, Eye, Trophy } from 'lucide-react';

function AllUserEntries() {
  const navigate = useNavigate();
  const { userId } = useParams();
  
  const [allEntries, setAllEntries] = useState([]);
  const [selectedUserEntries, setSelectedUserEntries] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState('');

  // Fetch all entries when component mounts
  useEffect(() => {
    const fetchAllEntries = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token missing');
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:5000/api/participants/all', {
          headers: {
            'x-auth-token': token
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.msg || 'Failed to fetch entries');
        }

        const data = await response.json();
        setAllEntries(data);

        // If userId is provided in the URL, show entries for that specific user
        if (userId) {
          const userEntries = data.filter(entry => entry.userId._id === userId);
          if (userEntries.length > 0) {
            setSelectedUser(userEntries[0].userId); // Set the user info
            setSelectedUserEntries(userEntries);
          }
        }
      } catch (err) {
        console.error('Error fetching entries:', err);
        setError(err.message || 'An error occurred while fetching entries');
      } finally {
        setLoading(false);
      }
    };

    fetchAllEntries();
  }, [userId]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    const userEntries = allEntries.filter(entry => entry.userId._id === user._id);
    setSelectedUserEntries(userEntries);
    navigate(`/abhaya/privilege/user/${user._id}`);
  };

  const handleBackToAllUsers = () => {
    setSelectedUser(null);
    setSelectedUserEntries([]);
    navigate('/abhaya/privilege');
  };

  const handleViewEntry = (entry) => {
    // Navigate to the specific entry details page using the participant entry ID
    navigate(`/abhaya/privilege/${entry._id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading all entries...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 text-center shadow-xl border border-red-200">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
            <span className="text-red-600 text-2xl font-bold">!</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => navigate('/participants')}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-black transition-all duration-300 font-semibold"
          >
            Back to Giveaways
          </button>
        </div>
      </div>
    );
  }

  // If viewing specific user's entries
  if (selectedUser && selectedUserEntries.length > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <button 
              onClick={handleBackToAllUsers}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to All Users
            </button>
            
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg mb-6">
              <User className="text-white" size={32} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{selectedUser.name}'s Entries</h1>
            <p className="text-xl text-gray-600">
              Showing {selectedUserEntries.length} entry{selectedUserEntries.length !== 1 ? 's' : ''} by {selectedUser.name}
            </p>
          </div>

          {/* User Info Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <User size={24} />
                User Information
              </h2>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
                    <User className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Full Name</h3>
                    <p className="text-gray-600">{selectedUser.name}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-lg flex-shrink-0">
                    <Phone className="text-green-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">{selectedUser.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Entries List */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-700 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Gift size={24} />
                User Entries ({selectedUserEntries.length})
              </h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {selectedUserEntries.map((entry) => (
                <div key={entry._id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg">{entry.giveawayId?.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{entry.giveawayId?.prizeName}</p>
                      
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>Giveaway ID: {entry.giveawayId?._id}</span>
                        <span>•</span>
                        <span>Entry ID: {entry._id}</span>
                        <span>•</span>
                        <span>{new Date(entry.enteredAt).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="mt-2 text-sm text-gray-600">
                        <strong>Address:</strong> {entry.address}
                      </div>
                      <div className="mt-1 text-sm text-gray-600">
                        <strong>Reason:</strong> {entry.reason}
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleViewEntry(entry)}
                      className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
                    >
                      <Eye size={16} />
                      View Entry
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show all users and their entries
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <button 
            onClick={() => navigate('/participants')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Giveaways
          </button>
          
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl shadow-lg mb-6">
            <Users className="text-white" size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">All User Entries</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            View all users who have participated in giveaways and their entries
          </p>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{allEntries.length}</div>
              <div className="text-sm text-gray-600">Total Entries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {[...new Set(allEntries.map(e => e.userId._id))].length}
              </div>
              <div className="text-sm text-gray-600">Unique Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {[...new Set(allEntries.map(e => e.giveawayId._id))].length}
              </div>
              <div className="text-sm text-gray-600">Active Giveaways</div>
            </div>
          </div>
        </div>

        {/* Entries List */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-700">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Gift size={24} />
              All Entries ({allEntries.length})
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {allEntries.length === 0 ? (
              <div className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <Gift className="text-gray-400" size={24} />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No entries found</h3>
                <p className="text-gray-600">No users have entered giveaways yet.</p>
              </div>
            ) : (
              allEntries.map((entry) => (
                <div 
                  key={entry._id} 
                  className="p-6 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                  onClick={() => handleUserClick(entry.userId)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-purple-100 p-3 rounded-full">
                        <User className="text-purple-600" size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{entry.userId.name}</h3>
                        <p className="text-gray-600 text-sm">{entry.userId.email}</p>
                        
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Gift className="text-purple-500" size={14} />
                            {entry.giveawayId?.title}
                          </span>
                          <span>•</span>
                          <span>{new Date(entry.enteredAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewEntry(entry);
                        }}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-xs flex items-center gap-1"
                      >
                        <Eye size={12} />
                        View
                      </button>
                      <Trophy className="text-yellow-500" size={20} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllUserEntries;