import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Phone, MapPin, MessageSquare, ArrowLeft, Send } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

function GiveawayEntryForm() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { giveawayId } = useParams();
  
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    address: '',
    reason: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!formData.name || !formData.phone || !formData.address || !formData.reason) {
      setError('Please fill in all required fields');
      return;
    }
    
    // Phone validation (Nepali format)
    const phoneRegex = /^(98|97|96)\d{8}$/;
    if (!phoneRegex.test(formData.phone.replace(/[-\s]/g, ''))) {
      setError('Please enter a valid Nepali phone number (e.g., 98XXXXXXXX)');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('https://backend-giveaway.vercel.app/api/participants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token'),
        },
        body: JSON.stringify({
          giveawayId,
          ...formData,
          phone: formData.phone.replace(/[-\s]/g, '') // Clean phone number
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess(true);
        // Redirect to privilege page after 2 seconds
        setTimeout(() => {
          // Redirect to the general privilege page to see all entries
          navigate('/abhaya/privilege/');
        }, 2000);
      } else {
        setError(data.msg || 'Failed to enter giveaway');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error submitting form:', err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 text-center shadow-xl border border-green-200">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <Send className="text-green-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Entry Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for entering the giveaway. You'll be redirected to your privilege page shortly.
          </p>
          <div className="inline-flex items-center gap-2 text-green-600">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
            Redirecting...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Giveaways
          </button>
          
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl shadow-lg mb-6">
            <MessageSquare className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Enter Giveaway</h1>
          <p className="text-gray-600 max-w-lg mx-auto">
            Please fill out this form to participate in the giveaway. All information will be kept confidential.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-700">
                  <span className="font-medium">Error:</span>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <User className="text-purple-600" size={16} />
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Phone className="text-purple-600" size={16} />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors"
                  placeholder="98XXXXXXXX"
                />
                <p className="mt-1 text-sm text-gray-500">Enter 10-digit Nepali mobile number</p>
              </div>

              {/* Address Field */}
              <div>
                <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin className="text-purple-600" size={16} />
                  Address *
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors resize-none"
                  placeholder="Enter your complete address"
                ></textarea>
              </div>

              {/* Reason Field */}
              <div>
                <label htmlFor="reason" className="block text-sm font-semibold text-gray-700 mb-2">
                  Why do you want to participate in this giveaway? *
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors resize-none"
                  placeholder="Tell us why you're interested in participating..."
                ></textarea>
                <p className="mt-1 text-sm text-gray-500">This helps us understand your motivation</p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-4 px-6 rounded-lg hover:from-purple-700 hover:to-indigo-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing Entry...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Submit Entry
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer Info */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Your information is secure and will only be used for giveaway purposes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GiveawayEntryForm;