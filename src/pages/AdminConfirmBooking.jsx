import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { holdRooms, confirmBooking } from '../services/adminApi';
import { signOut } from '../services/supabase';

const AdminConfirmBooking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [bookingResult, setBookingResult] = useState(null);
  const [createdHoldGroupId, setCreatedHoldGroupId] = useState(null);
  
  const [formData, setFormData] = useState({
    // Booking details
    checkIn: '',
    checkOut: '',
    roomRequests: [{ category: 'economy', count: 1 }],
    // Guest details
    guest_name: '',
    guest_email: '',
    guest_phone_number: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/adminLogin');
      return;
    }
  }, [navigate]);

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await signOut();
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      navigate('/adminLogin');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoomRequestChange = (index, field, value) => {
    const newRoomRequests = [...formData.roomRequests];
    newRoomRequests[index] = {
      ...newRoomRequests[index],
      [field]: field === 'count' ? parseInt(value) || 0 : value
    };
    setFormData(prev => ({
      ...prev,
      roomRequests: newRoomRequests
    }));
  };

  const addRoomRequest = () => {
    setFormData(prev => ({
      ...prev,
      roomRequests: [...prev.roomRequests, { category: 'economy', count: 1 }]
    }));
  };

  const removeRoomRequest = (index) => {
    if (formData.roomRequests.length > 1) {
      const newRoomRequests = formData.roomRequests.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        roomRequests: newRoomRequests
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setBookingResult(null);
    setCreatedHoldGroupId(null);
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.guest_name) {
        setError('Guest Name is required');
        setLoading(false);
        return;
      }

      // Validate dates
      if (new Date(formData.checkIn) >= new Date(formData.checkOut)) {
        setError('Check-out date must be after check-in date');
        setLoading(false);
        return;
      }

      // Step 1: Create a hold (without duration so it's for booking)
      const holdPayload = {
        roomRequests: formData.roomRequests,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        // No holdDurationMinutes - this is for immediate booking
      };

      const holdResult = await holdRooms(holdPayload);

      if (!holdResult.success) {
        setError(holdResult.message || 'Failed to reserve rooms');
        setLoading(false);
        return;
      }

      const holdGroupId = holdResult.data?.hold_group_id;
      if (!holdGroupId) {
        setError('Failed to get hold group ID from room reservation');
        setLoading(false);
        return;
      }

      setCreatedHoldGroupId(holdGroupId);

      // Step 2: Immediately confirm the booking
      const bookingPayload = {
        holdGroupId: holdGroupId.toString(),
        guest_name: formData.guest_name,
      };

      // Add optional fields if provided
      if (formData.guest_email) {
        bookingPayload.guest_email = formData.guest_email;
      }
      if (formData.guest_phone_number) {
        bookingPayload.guest_phone_number = formData.guest_phone_number;
      }

      const bookingConfirmResult = await confirmBooking(bookingPayload);

      if (bookingConfirmResult.success) {
        setSuccess('Booking confirmed successfully!');
        setBookingResult(bookingConfirmResult.data);
        // Reset form
        setFormData({
          checkIn: '',
          checkOut: '',
          roomRequests: [{ category: 'economy', count: 1 }],
          guest_name: '',
          guest_email: '',
          guest_phone_number: '',
        });
      } else {
        setError(bookingConfirmResult.message);
        if (bookingConfirmResult.message.includes('Session expired') || bookingConfirmResult.message.includes('Authentication')) {
          setTimeout(() => navigate('/adminLogin'), 2000);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Confirm booking error:', err);
    } finally {
      setLoading(false);
    }
  };

  const roomCategories = [
    { value: 'economy', label: 'Economy' },
    { value: 'primeDeluxe', label: 'Prime Deluxe' },
    { value: 'dormitory', label: 'Dormitory' },
    { value: 'fiveBedded', label: 'Five Bedded' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="w-full sm:w-auto">
              <button
                onClick={() => navigate('/adminLogin/dashboard')}
                className="text-green-600 hover:text-green-700 font-medium mb-2 flex items-center text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </button>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Create Booking</h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Select rooms and confirm booking with guest details (No payment required)
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Booking Form */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">Room & Guest Details</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm">
                {success}
              </div>
            )}

            {/* Date Range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 mb-2">
                  Check-in Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="checkIn"
                  name="checkIn"
                  value={formData.checkIn}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm sm:text-base"
                />
              </div>

              <div>
                <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 mb-2">
                  Check-out Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="checkOut"
                  name="checkOut"
                  value={formData.checkOut}
                  onChange={handleInputChange}
                  required
                  min={formData.checkIn || new Date().toISOString().split('T')[0]}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Room Requests */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Room Selection <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={addRoomRequest}
                  className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs sm:text-sm font-medium"
                >
                  + Add Room Type
                </button>
              </div>

              <div className="space-y-3">
                {formData.roomRequests.map((request, index) => (
                  <div key={index} className="flex gap-2 items-start p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Category
                        </label>
                        <select
                          value={request.category}
                          onChange={(e) => handleRoomRequestChange(index, 'category', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm"
                        >
                          {roomCategories.map(cat => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Count
                        </label>
                        <input
                          type="number"
                          value={request.count}
                          onChange={(e) => handleRoomRequestChange(index, 'count', e.target.value)}
                          min="1"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm"
                        />
                      </div>
                    </div>

                    {formData.roomRequests.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRoomRequest(index)}
                        className="mt-6 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-gray-300" />

            {/* Guest Name */}
            <div>
              <label htmlFor="guest_name" className="block text-sm font-medium text-gray-700 mb-2">
                Guest Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="guest_name"
                name="guest_name"
                value={formData.guest_name}
                onChange={handleInputChange}
                required
                placeholder="Enter guest full name"
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm sm:text-base"
              />
            </div>

            {/* Guest Email */}
            <div>
              <label htmlFor="guest_email" className="block text-sm font-medium text-gray-700 mb-2">
                Guest Email
              </label>
              <input
                type="email"
                id="guest_email"
                name="guest_email"
                value={formData.guest_email}
                onChange={handleInputChange}
                placeholder="Enter guest email"
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm sm:text-base"
              />
            </div>

            {/* Guest Phone */}
            <div>
              <label htmlFor="guest_phone_number" className="block text-sm font-medium text-gray-700 mb-2">
                Guest Phone Number
              </label>
              <input
                type="tel"
                id="guest_phone_number"
                name="guest_phone_number"
                value={formData.guest_phone_number}
                onChange={handleInputChange}
                placeholder="Enter guest phone"
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm sm:text-base"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 py-2 sm:py-3 px-4 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-all duration-200 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 py-2 sm:py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 text-sm sm:text-base ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 active:bg-green-800'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Booking...
                  </span>
                ) : (
                  'Create Booking'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Booking Result */}
        {bookingResult && (
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex items-start mb-4">
              <div className="p-3 bg-green-100 rounded-full mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">Booking Confirmed</h2>
                <p className="text-sm text-gray-600 mt-1">Guest: {formData.guest_name}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {bookingResult.bookingIds && bookingResult.bookingIds.length > 0 && (
                  <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Booking IDs</p>
                    <div className="flex flex-wrap gap-2">
                      {bookingResult.bookingIds.map((id, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-semibold bg-blue-600 text-white">
                          #{id}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {bookingResult.amount !== undefined && (
                  <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Total Amount</p>
                    <p className="text-lg sm:text-xl font-bold text-green-600">₹{bookingResult.amount}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => navigate('/adminLogin/dashboard/bookings')}
                  className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                  View All Bookings
                </button>
                <button
                  onClick={() => {
                    setBookingResult(null);
                    setCreatedHoldGroupId(null);
                    setFormData({
                      checkIn: '',
                      checkOut: '',
                      roomRequests: [{ category: 'economy', count: 1 }],
                      guest_name: '',
                      guest_email: '',
                      guest_phone_number: '',
                    });
                  }}
                  className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                >
                  Create Another Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminConfirmBooking;
