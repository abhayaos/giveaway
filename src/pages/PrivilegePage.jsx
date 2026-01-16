import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { User, Phone, MapPin, MessageSquare, Gift, CheckCircle, ArrowLeft, Share2, Calendar, ChevronRight, Award } from 'lucide-react';
import { WhatsappLogo } from 'phosphor-react';

function PrivilegePage() {
  const { id } = useParams(); // Will be undefined when showing all entries, will have value when showing specific entry
  const navigate = useNavigate();
  
  const [allEntries, setAllEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAllEntries, setShowAllEntries] = useState(!id); // Show all entries if no specific ID provided

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        // Check if user is authenticated
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        
        if (!token) {
          setError('You must be logged in to view entries');
          setLoading(false);
          return;
        }

        console.log("Fetching entries for user with token:", token.substring(0, 10) + "..."); // Debug log
        console.log("Current user from localStorage:", userStr); // Debug log
        
        if (id) {
          // If id is provided, try to fetch the specific entry first
          console.log("Fetching specific entry with ID:", id); // Debug log
          try {
            // Attempt to fetch the specific entry by ID
            const entryResponse = await api.get(`/participants/entry/${id}`);
            const entry = entryResponse.data;
            console.log("Fetched specific entry:", entry); // Debug log
            setSelectedEntry(entry);
            setShowAllEntries(false);
            
            // Also fetch all entries for the "View All Entries" functionality
            const allEntriesResponse = await api.get('/participants/user');
            const allParticipants = allEntriesResponse.data;
            console.log("Fetched all entries for allEntriesResponse:", allParticipants); // Debug log
            const sortedEntries = allParticipants.sort((a, b) => new Date(b.enteredAt) - new Date(a.enteredAt));
            setAllEntries(sortedEntries);
          } catch (error) {
            console.log("Specific entry not found, fetching all entries to search for giveaway ID:", id); // Debug log
            // If specific entry not found, fetch all entries and look for matching giveaway
            try {
              const participantsResponse = await api.get('/participants/user');
              const participants = participantsResponse.data;
              console.log("Fetched all entries for participantsResponse:", participants); // Debug log
              
              // Sort entries by date (newest first)
              const sortedEntries = participants.sort((a, b) => new Date(b.enteredAt) - new Date(a.enteredAt));
              setAllEntries(sortedEntries);
              
              // Look for entries with the specific giveaway ID
              const matchingEntries = sortedEntries.filter(p => p.giveawayId?._id === id);
              if (matchingEntries.length > 0) {
                setSelectedEntry(matchingEntries[0]); // Select the first entry for this giveaway
                setShowAllEntries(false);
              } else {
                setError('Entry not found');
              }
            } catch (error) {
              setError(error.response?.data?.msg || 'Failed to load entries');
            }
          }
        } else {
          // If no specific ID provided, fetch all entries
          console.log("Fetching all entries for user"); // Debug log
          
          // Let's also try to fetch all participants to see if there's a mismatch
          try {
            const allParticipantsResponse = await api.get('/participants');
            const allParticipants = allParticipantsResponse.data;
            console.log("All participants in system:", allParticipants);
            
            // Get current user ID from localStorage
            let currentUserId = null;
            if (userStr) {
              try {
                const userObj = JSON.parse(userStr);
                currentUserId = userObj._id;
                console.log("Current user ID from localStorage:", currentUserId);
              } catch (e) {
                console.error("Error parsing user data:", e);
              }
            }
            
            // Filter for current user's entries
            const userEntries = allParticipants.filter(entry => entry.userId?._id === currentUserId);
            console.log("Entries for current user from all participants:", userEntries);
          } catch (error) {
            console.error('Error fetching all participants:', error);
          }
          
          // Fetch user's specific entries
          try {
            const participantsResponse = await api.get('/participants/user');
            const participants = participantsResponse.data;
            
            // Sort entries by date (newest first)
            const sortedEntries = participants.sort((a, b) => new Date(b.enteredAt) - new Date(a.enteredAt));
            setAllEntries(sortedEntries);
            
            // Show all entries
            setShowAllEntries(true);
            
            // DEBUG: Log the response to see what's happening
            console.log("Fetched entries:", participants);
            console.log("Number of entries:", participants.length);
          } catch (error) {
            setError(error.response?.data?.msg || 'Failed to load entries');
          }
        }
      } catch (err) {
        console.error('Error fetching entries:', err);
        setError('Network error occurred: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEntries();
  }, [id]);

  const handleWhatsAppShare = () => {
    const entry = selectedEntry || allEntries[0]; // Use selected entry or first entry if available
    const phoneNumber = '+97798XXXXXXXX'; // Replace with actual admin number
    const message = encodeURIComponent(`Hello! I just entered the giveaway "${entry?.giveawayId?.title}" and wanted to confirm my participation. Here are my details:

Name: ${entry?.userId?.name}
Phone: ${entry?.phone}
Address: ${entry?.address}
Reason: ${entry?.reason}

Entry ID: ${entry?._id}`);
    
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const handleCopyInfo = () => {
    const entry = selectedEntry || allEntries[0]; // Use selected entry or first entry if available
    const infoText = `Giveaway Entry Details:
Name: ${entry?.userId?.name}
Phone: ${entry?.phone}
Address: ${entry?.address}
Reason: ${entry?.reason}
Giveaway: ${entry?.giveawayId?.title}
Entry ID: ${entry?._id}`;
    navigator.clipboard.writeText(infoText);
    alert('Entry details copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your entries...</p>
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

  // Show all entries view if no specific entry is selected
  if (showAllEntries) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
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
              <Award className="text-white" size={32} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">My Entries</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              View all your giveaway entries and participation details
            </p>
          </div>

          {/* Entries List */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-700">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Gift size={24} />
                My Entries ({allEntries.length})
              </h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {allEntries.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <Gift className="text-gray-400" size={24} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No entries yet</h3>
                  <p className="text-gray-600 mb-4">You haven't entered any giveaways yet.</p>
                  <button
                    onClick={() => navigate('/participants')}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-lg hover:from-purple-700 hover:to-indigo-800 transition-all duration-300 font-semibold"
                  >
                    Browse Giveaways
                  </button>
                </div>
              ) : (
                allEntries.map((entry) => (
                  <div 
                    key={entry._id} 
                    className="p-6 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                    onClick={() => {
                      // Navigate to the specific entry detail page
                      navigate(`/abhaya/privilege/${entry._id}`);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg">{entry.giveawayId?.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">{entry.giveawayId?.prizeName}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span>Entry ID: #{entry._id?.slice(-8)}</span>
                          <span>•</span>
                          <span>{new Date(entry.enteredAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <ChevronRight className="text-gray-400" size={20} />
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

  // Show individual entry details if a specific entry is selected
  const entryToShow = selectedEntry;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <button 
            onClick={() => {
              // Go back to the list of all entries
              navigate('/abhaya/privilege');
            }}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to My Entries
          </button>
          
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg mb-6">
            <CheckCircle className="text-white" size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Entry Confirmed!</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Congratulations! You've successfully entered the giveaway. Here's your confirmation details.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* User Information Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-700 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <User size={24} />
                Your Entry Details
              </h2>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-lg flex-shrink-0">
                  <User className="text-purple-600" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">Full Name</h3>
                  <p className="text-gray-600">{entryToShow?.userId?.name}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-lg flex-shrink-0">
                  <Phone className="text-green-600" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">Phone Number</h3>
                  <p className="text-gray-600">{entryToShow?.phone}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
                  <MapPin className="text-blue-600" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                  <p className="text-gray-600">{entryToShow?.address}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-yellow-100 p-3 rounded-lg flex-shrink-0">
                  <MessageSquare className="text-yellow-600" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">Participation Reason</h3>
                  <p className="text-gray-600">{entryToShow?.reason}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Entry ID:</span>
                  <span className="font-mono font-semibold">#{entryToShow?._id?.slice(-8)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500 mt-1">
                  <span>Date:</span>
                  <span>{new Date(entryToShow?.enteredAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Giveaway Information Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Gift size={24} />
                Giveaway Details
              </h2>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">{entryToShow?.giveawayId?.title}</h3>
                <p className="text-gray-600">{entryToShow?.giveawayId?.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Prize</div>
                  <div className="font-semibold text-gray-900">{entryToShow?.giveawayId?.prizeName}</div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Value</div>
                  <div className="font-semibold text-green-600">
                    Rs {entryToShow?.giveawayId?.prizeValue?.toLocaleString()}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="bg-orange-100 p-3 rounded-lg flex-shrink-0">
                  <Calendar className="text-orange-600" size={24} />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Ends on</div>
                  <div className="font-semibold text-gray-900">
                    {new Date(entryToShow?.giveawayId?.endDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  <CheckCircle size={16} />
                  Successfully Entered
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Next Steps</h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            <button
              onClick={handleWhatsAppShare}
              className="flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <WhatsappLogo size={24} weight="fill" />
              Message on WhatsApp
            </button>
            
            <button
              onClick={handleCopyInfo}
              className="flex items-center justify-center gap-3 bg-gray-600 hover:bg-gray-700 text-white py-4 px-6 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Share2 size={24} />
              Copy Entry Details
            </button>
            
            <button
              onClick={() => navigate('/abhaya/privilege')}
              className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <User size={24} />
              View All Entries
            </button>
          </div>
          
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>We'll contact you if you're selected as a winner. Good luck!</p>
          </div>
        </div>

        {/* Success Message */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-6 py-3 rounded-full">
            <CheckCircle size={20} />
            <span className="font-semibold">Your entry has been successfully recorded!</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivilegePage;