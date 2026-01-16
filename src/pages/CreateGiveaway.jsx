import React, { useState } from 'react';
import { Plus, Image, Upload, Calendar, Users, Clock } from 'lucide-react';

function CreateGiveaway() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    prizeName: '',
    prizeValue: '',
    prizeType: '', // Added required field
    startDate: '',
    endDate: '',
    maxEntries: '',
    winnerCount: '1', // Default to 1 winner
    imageUrl: '',
    termsAndConditions: ''
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({
          ...prev,
          imageUrl: reader.result // In a real app, this would be a URL after upload to cloud storage
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!formData.title || !formData.description || !formData.prizeName || 
        !formData.prizeValue || !formData.prizeType || !formData.startDate || 
        !formData.endDate || !formData.maxEntries || !formData.winnerCount) {
      setError('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    try {
      // Get the organizer's token from localStorage
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/giveaways', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          ...formData,
          prizeValue: parseFloat(formData.prizeValue),
          maxEntries: parseInt(formData.maxEntries),
          winnerCount: parseInt(formData.winnerCount)
        })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        alert('Giveaway created successfully!');
        // Reset form
        setFormData({
          title: '',
          description: '',
          prizeName: '',
          prizeValue: '',
          prizeType: '',
          startDate: '',
          endDate: '',
          maxEntries: '',
          winnerCount: '1', // Default to 1 winner
          imageUrl: '',
          termsAndConditions: ''
        });
        setImagePreview(null);
      } else {
        setError(result.msg || 'Failed to create giveaway');
      }
    } catch (err) {
      setError('An error occurred while creating the giveaway');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-6">
            <Plus className="text-white" size={28} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Create New Giveaway</h1>
          <p className="text-gray-600">Create an exciting giveaway to engage your audience</p>
        </div>
        
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Giveaway Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors"
                placeholder="Enter giveaway title"
              />
            </div>
            
            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors"
                placeholder="Describe your giveaway and what participants will get"
              ></textarea>
            </div>
            
            {/* Prize Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="prizeName" className="block text-sm font-medium text-gray-700 mb-2">
                  Prize Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 font-bold text-lg">Rs</span>
                  </div>
                  <input
                    type="text"
                    id="prizeName"
                    name="prizeName"
                    value={formData.prizeName}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors"
                    placeholder="e.g., Mobile Phone"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="prizeValue" className="block text-sm font-medium text-gray-700 mb-2">
                  Prize Value (Rs) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 font-bold text-lg">Rs</span>
                  </div>
                  <input
                    type="number"
                    id="prizeValue"
                    name="prizeValue"
                    value={formData.prizeValue}
                    onChange={handleChange}
                    required
                    min="1"
                    step="1"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors"
                    placeholder="e.g., 100000"
                  />
                </div>
              </div>
            </div>
            
            {/* Prize Type */}
            <div>
              <label htmlFor="prizeType" className="block text-sm font-medium text-gray-700 mb-2">
                Prize Type *
              </label>
              <select
                id="prizeType"
                name="prizeType"
                value={formData.prizeType}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors"
              >
                <option value="">Select prize type</option>
                <option value="physical">Physical Item</option>
                <option value="digital">Digital Product</option>
                <option value="subscription">Subscription</option>
              </select>
            </div>
            
            {/* Dates */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="text-gray-400" size={20} />
                  </div>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                  End Date *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="text-gray-400" size={20} />
                  </div>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors"
                  />
                </div>
              </div>
            </div>
            
            {/* Max Entries */}
            <div>
              <label htmlFor="maxEntries" className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Entries *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users className="text-gray-400" size={20} />
                </div>
                <input
                  type="number"
                  id="maxEntries"
                  name="maxEntries"
                  value={formData.maxEntries}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors"
                  placeholder="Maximum number of entries allowed"
                />
              </div>
            </div>
            
            {/* Winner Count */}
            <div>
              <label htmlFor="winnerCount" className="block text-sm font-medium text-gray-700 mb-2">
                Number of Winners *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users className="text-gray-400" size={20} />
                </div>
                <input
                  type="number"
                  id="winnerCount"
                  name="winnerCount"
                  value={formData.winnerCount}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors"
                  placeholder="Number of winners to be selected"
                />
              </div>
            </div>
            
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prize Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label htmlFor="imageUpload" className="cursor-pointer">
                  {imagePreview ? (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="max-h-48 mx-auto rounded-lg object-contain"
                      />
                      <div className="mt-4 flex justify-center">
                        <span className="text-sm text-gray-600">Click to change image</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium text-purple-600 hover:text-purple-500">
                            Click to upload
                          </span>{' '}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </div>
                    </div>
                  )}
                </label>
              </div>
            </div>
            
            {/* Terms and Conditions */}
            <div>
              <label htmlFor="termsAndConditions" className="block text-sm font-medium text-gray-700 mb-2">
                Terms and Conditions
              </label>
              <textarea
                id="termsAndConditions"
                name="termsAndConditions"
                value={formData.termsAndConditions}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors"
                placeholder="Add specific terms and conditions for this giveaway"
              ></textarea>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Giveaway...
                </div>
              ) : (
                'Create Giveaway'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateGiveaway;