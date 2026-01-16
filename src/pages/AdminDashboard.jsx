import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, Trophy, Gift, Eye, CheckCircle, XCircle, BarChart3, Calendar, LogOut } from 'lucide-react';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrganizers: 0,
    pendingOrganizers: 0,
    totalGiveaways: 0,
    totalParticipants: 0,
    totalWinners: 0
  });
  
  const [organizers, setOrganizers] = useState([]);
  const [giveaways, setGiveaways] = useState([]);
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Check if user is logged in as admin
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      // Redirect to admin login
      window.location.href = '/admin-login';
    }
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const statsResponse = await api.get('/admin/stats');
        const statsData = statsResponse.data;
        setStats(statsData);
        
        const orgResponse = await api.get('/organizers');
        const orgData = orgResponse.data;
        setOrganizers(orgData);
        
        const giveawayResponse = await api.get('/giveaways');
        const giveawayData = giveawayResponse.data;
        setGiveaways(giveawayData);
        
        const winnersResponse = await api.get('/admin/winners');
        const winnersData = winnersResponse.data;
        setWinners(winnersData);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchStats();
  }, []);

  const handleSelectWinners = async (giveawayId) => {
    try {
      const response = await api.post(`/winners/select/${giveawayId}`, { giveawayId });

      if (response.data) {
        alert(`Selected ${response.data.winners.length} winners!`);
        // Refresh the data
        const giveawayResponse = await api.get('/giveaways');
        setGiveaways(giveawayResponse.data);
      }
    } catch (error) {
      alert(error.response?.data?.msg || 'Error selecting winners');
    }
  };

  const handleCompleteGiveaway = async (giveawayId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`https://backend-giveaway.vercel.app/api/winners/complete/${giveawayId}`, {
      method: 'POST',
      headers: {
        'x-auth-token': token,
      },
    });

    if (response.ok) {
      alert('Giveaway completed successfully!');
      // Refresh the data
      const giveawayResponse = await fetch('https://backend-giveaway.vercel.app/api/giveaways', {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      });

      if (giveawayResponse.ok) {
        const giveawayData = await giveawayResponse.json();
        setGiveaways(giveawayData);
      }
    } else {
      const error = await response.json();
      alert(error.msg || 'Error completing giveaway');
    }
  };

  const handleApproveOrganizer = async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`https://backend-giveaway.vercel.app/api/organizers/${id}/approve`, {
      method: 'PUT',
      headers: {
        'x-auth-token': token,
      },
    });

    if (response.ok) {
      alert('Organizer approved successfully!');
      // Refresh the data
      const orgResponse = await fetch('https://backend-giveaway.vercel.app/api/organizers', {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      });

      if (orgResponse.ok) {
        const orgData = await orgResponse.json();
        setOrganizers(orgData);
      }
    } else {
      const error = await response.json();
      alert(error.msg || 'Error approving organizer');
    }
  };

  const handleRejectOrganizer = async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`https://backend-giveaway.vercel.app/api/organizers/${id}/reject`, {
      method: 'PUT',
      headers: {
        'x-auth-token': token,
      },
    });

    if (response.ok) {
      alert('Organizer rejected successfully!');
      // Refresh the data
      const orgResponse = await fetch('https://backend-giveaway.vercel.app/api/organizers', {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      });

      if (orgResponse.ok) {
        const orgData = await orgResponse.json();
        setOrganizers(orgData);
      }
    } else {
      const error = await response.json();
      alert(error.msg || 'Error rejecting organizer');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Admin Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-5">
            <div className="flex items-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-red-600 to-red-700 rounded-xl shadow-lg mr-4">
                <BarChart3 className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Manage your platform with ease</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">
                  {JSON.parse(localStorage.getItem('adminUser') || {}).name || 'Admin User'}
                </p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <button 
                onClick={() => {
                  localStorage.removeItem('adminToken');
                  localStorage.removeItem('adminUser');
                  window.location.href = '/admin-login';
                }}
                className="px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-lg hover:from-gray-800 hover:to-gray-900 transition-all duration-200 shadow-sm hover:shadow-md font-medium flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <nav className="flex flex-wrap">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
              { id: 'organizers', name: 'Organizers', icon: Users },
              { id: 'giveaways', name: 'Giveaways', icon: Gift },
              { id: 'participants', name: 'Participants', icon: Users },
              { id: 'winners', name: 'Winners', icon: Trophy }
            ].map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium text-sm transition-all duration-200 border-b-2 ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-600 bg-red-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                } ${index === 0 ? 'rounded-tl-xl' : ''} ${index === 4 ? 'rounded-tr-xl' : ''}`}
              >
                <tab.icon size={18} />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700 mb-1">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                  </div>
                  <div className="p-4 bg-blue-500 rounded-lg shadow-inner">
                    <Users className="text-white" size={28} />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700 mb-1">Total Organizers</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalOrganizers}</p>
                  </div>
                  <div className="p-4 bg-green-500 rounded-lg shadow-inner">
                    <Users className="text-white" size={28} />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-700 mb-1">Pending Approval</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.pendingOrganizers}</p>
                  </div>
                  <div className="p-4 bg-yellow-500 rounded-lg shadow-inner">
                    <Eye className="text-white" size={28} />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-700 mb-1">Total Giveaways</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalGiveaways}</p>
                  </div>
                  <div className="p-4 bg-purple-500 rounded-lg shadow-inner">
                    <Gift className="text-white" size={28} />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl p-6 border border-indigo-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-indigo-700 mb-1">Total Entries</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalParticipants}</p>
                  </div>
                  <div className="p-4 bg-indigo-500 rounded-lg shadow-inner">
                    <Users className="text-white" size={28} />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-emerald-700 mb-1">Total Winners</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalWinners}</p>
                  </div>
                  <div className="p-4 bg-emerald-500 rounded-lg shadow-inner">
                    <Trophy className="text-white" size={28} />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Users className="text-gray-600" size={20} />
                    Recent Organizers
                  </h3>
                  <span className="text-sm text-gray-500">Last 5</span>
                </div>
                <div className="space-y-3">
                  {organizers.slice(0, 5).map((organizer) => (
                    <div key={organizer._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors duration-150">
                      <div>
                        <p className="font-medium text-gray-900">{organizer.name}</p>
                        <p className="text-sm text-gray-600 truncate max-w-[200px]">{organizer.email}</p>
                      </div>
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                        organizer.isApproved 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                      }`}>
                        {organizer.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Gift className="text-gray-600" size={20} />
                    Recent Giveaways
                  </h3>
                  <span className="text-sm text-gray-500">Last 5</span>
                </div>
                <div className="space-y-3">
                  {giveaways.slice(0, 5).map((giveaway) => (
                    <div key={giveaway._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors duration-150">
                      <div>
                        <p className="font-medium text-gray-900 truncate max-w-[200px]">{giveaway.title}</p>
                        <p className="text-sm text-gray-600 truncate max-w-[200px]">{giveaway.prizeName}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-gray-500 block">
                          {new Date(giveaway.createdAt).toLocaleDateString()}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          giveaway.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {giveaway.isActive ? 'Active' : 'Ended'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'organizers' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="text-gray-600" size={20} />
                  Manage Organizers
                </h3>
                <span className="text-sm text-gray-500">{organizers.length} total</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {organizers.map((organizer) => (
                    <tr key={organizer._id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{organizer.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 truncate max-w-xs">{organizer.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          organizer.isApproved 
                            ? 'bg-green-100 text-green-800 border border-green-200' 
                            : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                        }`}>
                          {organizer.isApproved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(organizer.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {!organizer.isApproved ? (
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleApproveOrganizer(organizer._id)}
                              className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors duration-200"
                              title="Approve"
                            >
                              <CheckCircle size={20} />
                            </button>
                            <button
                              onClick={() => handleRejectOrganizer(organizer._id)}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
                              title="Reject"
                            >
                              <XCircle size={20} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'giveaways' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Gift className="text-gray-600" size={20} />
                  Manage Giveaways
                </h3>
                <span className="text-sm text-gray-500">{giveaways.length} total</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prize</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entries</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {giveaways.map((giveaway) => (
                    <tr key={giveaway._id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{giveaway.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {giveaway.prizeName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {giveaway.totalEntries || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          giveaway.isActive 
                            ? 'bg-green-100 text-green-800 border border-green-200' 
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                          {giveaway.isActive ? 'Active' : 'Completed'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleSelectWinners(giveaway._id)}
                          className="px-3 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200 mr-2"
                          disabled={!giveaway.isActive || giveaway.hasWinner}
                          title="Select Winner"
                        >
                          Select Winner
                        </button>
                        <button
                          onClick={() => handleCompleteGiveaway(giveaway._id)}
                          className="px-3 py-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors duration-200"
                          disabled={!giveaway.isActive}
                          title="Complete Giveaway"
                        >
                          Complete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'participants' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="text-gray-600" size={20} />
                  Manage Participants
                </h3>
                <span className="text-sm text-gray-500">0 total</span>
              </div>
            </div>
            <div className="p-8 text-center">
              <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                <Users className="text-gray-500" size={40} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Participant Management</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                Participant management interface coming soon...
              </p>
              <div className="inline-flex gap-3">
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                  View Entries
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                  Export Data
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'winners' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Trophy className="text-gray-600" size={20} />
                  Manage Winners
                </h3>
                <span className="text-sm text-gray-500">{winners.length} total</span>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-6 bg-gray-50 rounded-lg p-5 border border-gray-200">
                <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Trophy className="text-yellow-500" size={18} />
                  Select Winner for Giveaway
                </h4>
                <div className="flex flex-col sm:flex-row gap-4">
                  <select className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                    <option value="">Select a giveaway...</option>
                    {giveaways.map(giveaway => (
                      <option key={giveaway._id} value={giveaway._id}>{giveaway.title}</option>
                    ))}
                  </select>
                  <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm flex items-center justify-center gap-2">
                    <Trophy size={16} />
                    Select Single Winner
                  </button>
                  <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-sm flex items-center justify-center gap-2">
                    <Users size={16} />
                    Select Multiple Winners
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Winner</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giveaway</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prize</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {winners.map((winner) => (
                      <tr key={winner._id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{winner.userId?.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{winner.userId?.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 truncate max-w-xs">{winner.giveawayId?.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {winner.giveawayId?.prizeName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(winner.wonAt || winner.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            winner.isClaimed 
                              ? 'bg-green-100 text-green-800 border border-green-200' 
                              : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                          }`}>
                            {winner.isClaimed ? 'Claimed' : 'Unclaimed'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;