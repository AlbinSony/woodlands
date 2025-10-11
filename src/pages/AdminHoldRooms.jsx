import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { holdRooms, cancelHold } from '../services/adminApi';
import { signOut } from '../services/supabase';

const AdminHoldRooms = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [holdResult, setHoldResult] = useState(null);
  
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    holdDurationMinutes: '',
    roomRequests: [{ category: 'economy', count: 1 }]
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
    setHoldResult(null);
    setLoading(true);

    try {
      // Validate dates
      if (new Date(formData.checkIn) >= new Date(formData.checkOut)) {
        setError('Check-out date must be after check-in date');
        setLoading(false);
        return;
      }

      // Prepare API payload
      const payload = {
        roomRequests: formData.roomRequests,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
      };

      // Add holdDurationMinutes only if provided
      if (formData.holdDurationMinutes && formData.holdDurationMinutes > 0) {
        payload.holdDurationMinutes = parseInt(formData.holdDurationMinutes);
      }

      const result = await holdRooms(payload);

      if (result.success) {
        setSuccess(result.message);
        setHoldResult(result.data);
        // Reset form
        setFormData({
          checkIn: '',
          checkOut: '',
          holdDurationMinutes: '',
          roomRequests: [{ category: 'economy', count: 1 }]
        });
      } else {
        setError(result.message);
        if (result.message.includes('Session expired') || result.message.includes('Authentication')) {
          setTimeout(() => navigate('/adminLogin'), 2000);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Hold rooms error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelHold = async (holdGroupId) => {
    if (!window.confirm('Are you sure you want to cancel this hold?')) {
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const result = await cancelHold(holdGroupId);

      if (result.success) {
        setSuccess(result.message);
        setHoldResult(null); // Clear the hold result after cancelling
      } else {
        setError(result.message);
        if (result.message.includes('Session expired') || result.message.includes('Authentication')) {
          setTimeout(() => navigate('/adminLogin'), 2000);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred while cancelling hold.');
      console.error('Cancel hold error:', err);
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

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Hold/Lock Rooms</h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Reserve rooms for specific duration or lock them temporarily
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
        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">How it works:</p>
              <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                <li><strong>With duration:</strong> Lock rooms for specific minutes/hours/days (useful for maintenance or events)</li>
                <li><strong>Without duration:</strong> Hold rooms temporarily before booking (useful when creating bookings)</li>
                <li>Duration must be specified in <strong>minutes</strong> (e.g., 60 = 1 hour, 1440 = 1 day)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Hold Rooms Form */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">Hold Room Configuration</h2>
          
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

            {/* Hold Duration */}
            <div>
              <label htmlFor="holdDurationMinutes" className="block text-sm font-medium text-gray-700 mb-2">
                Hold Duration (in minutes)
                <span className="text-gray-500 font-normal ml-2">- Optional, leave empty for booking holds</span>
              </label>
              <input
                type="number"
                id="holdDurationMinutes"
                name="holdDurationMinutes"
                value={formData.holdDurationMinutes}
                onChange={handleInputChange}
                min="0"
                placeholder="e.g., 60 for 1 hour, 1440 for 1 day"
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm sm:text-base"
              />
              <p className="text-xs text-gray-500 mt-1">
                Common durations: 30 mins, 60 mins (1 hr), 1440 mins (1 day), 10080 mins (1 week)
              </p>
            </div>

            {/* Room Requests */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Room Requests <span className="text-red-500">*</span>
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

            {/* Submit Button */}
            <div className="flex gap-3">
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
                    Holding Rooms...
                  </span>
                ) : (
                  'Hold Rooms'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Hold Result */}
        {holdResult && (
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">Hold Created Successfully</h2>
              <button
                onClick={() => handleCancelHold(holdResult.hold_group_id)}
                disabled={loading}
                className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-xs sm:text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Cancel Hold
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Hold Group ID</p>
                  <p className="text-lg sm:text-xl font-bold text-blue-600">#{holdResult.hold_group_id}</p>
                </div>

                {holdResult.expires_at && (
                  <div className="bg-orange-50 p-3 sm:p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Expires At</p>
                    <p className="text-sm sm:text-base font-semibold text-orange-600">
                      {formatDateTime(holdResult.expires_at)}
                    </p>
                  </div>
                )}
              </div>

              {holdResult.holds && holdResult.holds.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Held Rooms:</h3>
                  <div className="space-y-2">
                    {holdResult.holds.map((hold, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <div className="grid grid-cols-2 sm:flex sm:gap-6 gap-2 text-sm">
                          <div>
                            <span className="text-gray-500">Hold ID:</span>
                            <span className="font-semibold ml-1">#{hold.hold_id}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Room ID:</span>
                            <span className="font-semibold ml-1">{hold.room_id}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Category:</span>
                            <span className="font-semibold ml-1 capitalize">{hold.category}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Capacity:</span>
                            <span className="font-semibold ml-1">{hold.capacity_count || 1}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {holdResult.message && (
                <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                  <p className="text-sm text-green-800">{holdResult.message}</p>
                </div>
              )}

              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-xs sm:text-sm text-yellow-800">
                    <strong>Important:</strong> Save the Hold Group ID (#{holdResult.hold_group_id}) if you need to cancel this hold later. You can cancel this hold before it expires using the "Cancel Hold" button above.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminHoldRooms;
