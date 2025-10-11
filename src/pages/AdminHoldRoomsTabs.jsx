import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { holdRooms, cancelHold, getAllHolds } from '../services/adminApi';
import { signOut } from '../services/supabase';

const AdminHoldRoomsTabs = () => {
  const [activeTab, setActiveTab] = useState('create'); // 'create' or 'view'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [holdResult, setHoldResult] = useState(null);
  
  // Create Hold State
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    holdDurationMinutes: '',
    roomRequests: [{ category: 'economy', count: 1 }]
  });

  // View Holds State
  const [holds, setHolds] = useState([]);
  const [filteredHolds, setFilteredHolds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [cancellingHoldId, setCancellingHoldId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/adminLogin');
      return;
    }

    // Fetch holds when switching to view tab
    if (activeTab === 'view') {
      fetchHolds();
    }
  }, [navigate, activeTab]);

  useEffect(() => {
    // Filter holds
    let filtered = [...holds];

    if (filterStatus !== 'all') {
      const now = new Date();
      filtered = filtered.filter(hold => {
        const expiresAt = new Date(hold.expires_at);
        if (filterStatus === 'active') {
          return expiresAt > now;
        } else if (filterStatus === 'expired') {
          return expiresAt <= now;
        }
        return true;
      });
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(hold => 
        hold.id?.toString().includes(term) ||
        hold.room_id?.toString().includes(term) ||
        hold.category?.toLowerCase().includes(term)
      );
    }

    setFilteredHolds(filtered);
  }, [holds, searchTerm, filterStatus]);

  const fetchHolds = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await getAllHolds();
      
      if (result.success) {
        setHolds(result.data || []);
      } else {
        setError(result.message);
        if (result.message.includes('Session expired') || result.message.includes('Authentication')) {
          setTimeout(() => navigate('/adminLogin'), 2000);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred while fetching holds.');
      console.error('Fetch holds error:', err);
    } finally {
      setLoading(false);
    }
  };

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
      if (new Date(formData.checkIn) >= new Date(formData.checkOut)) {
        setError('Check-out date must be after check-in date');
        setLoading(false);
        return;
      }

      const payload = {
        roomRequests: formData.roomRequests,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
      };

      if (formData.holdDurationMinutes && formData.holdDurationMinutes > 0) {
        payload.holdDurationMinutes = parseInt(formData.holdDurationMinutes);
      }

      const result = await holdRooms(payload);

      if (result.success) {
        setSuccess(result.message);
        setHoldResult(result.data);
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

  const handleCancelHold = async (holdId) => {
    if (!window.confirm(`Are you sure you want to cancel hold #${holdId}?`)) {
      return;
    }

    setCancellingHoldId(holdId);
    setError('');
    setSuccess('');

    try {
      const result = await cancelHold(holdId);

      if (result.success) {
        setSuccess(`Hold #${holdId} cancelled successfully`);
        await fetchHolds();
        setTimeout(() => setSuccess(''), 3000);
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
      setCancellingHoldId(null);
    }
  };

  const handleCancelHoldFromResult = async (holdGroupId) => {
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
        setHoldResult(null);
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

  const handleConfirmBooking = (holdGroupId) => {
    // Navigate to confirm booking page with holdGroupId
    navigate(`/adminLogin/dashboard/confirm-booking?holdGroupId=${holdGroupId}`);
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isExpired = (expiresAt) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) <= new Date();
  };

  const getTimeRemaining = (expiresAt) => {
    if (!expiresAt) return 'No expiry';
    
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires - now;

    if (diff <= 0) return 'Expired';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    
    return `${hours}h ${minutes}m`;
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
                Reserve or lock rooms for specific duration or before booking
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

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('create')}
                className={`flex-1 py-3 sm:py-4 px-4 text-center text-sm sm:text-base font-medium border-b-2 transition-colors ${
                  activeTab === 'create'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <svg className="w-5 h-5 inline-block mr-2 -mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Hold
              </button>
              <button
                onClick={() => setActiveTab('view')}
                className={`flex-1 py-3 sm:py-4 px-4 text-center text-sm sm:text-base font-medium border-b-2 transition-colors ${
                  activeTab === 'view'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <svg className="w-5 h-5 inline-block mr-2 -mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                View All Holds
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {success}
          </div>
        )}

        {/* Create Hold Tab */}
        {activeTab === 'create' && (
          <>
            {/* Hold Rooms Form */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">Hold Room Configuration</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
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
                    Hold Duration (minutes)
                  </label>
                  <input
                    type="number"
                    id="holdDurationMinutes"
                    name="holdDurationMinutes"
                    value={formData.holdDurationMinutes}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="Enter duration in minutes"
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm sm:text-base"
                  />
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
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleConfirmBooking(holdResult.hold_group_id)}
                      className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-xs sm:text-sm"
                    >
                      Confirm Booking
                    </button>
                    <button
                      onClick={() => handleCancelHoldFromResult(holdResult.hold_group_id)}
                      disabled={loading}
                      className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-xs sm:text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Cancel Hold
                    </button>
                  </div>
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

                  <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                    <p className="text-xs sm:text-sm text-blue-800">
                      Hold Group ID: <strong>#{holdResult.hold_group_id}</strong>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* View Holds Tab */}
        {activeTab === 'view' && (
          <>
            {/* Search and Filter */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                    Search Holds
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="search"
                      placeholder="Search by Hold ID, Room ID, or Category..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm"
                    />
                    <svg
                      className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>

                <div className="sm:w-48">
                  <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Status
                  </label>
                  <select
                    id="filter"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm"
                  >
                    <option value="all">All Holds</option>
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>

                <div className="sm:w-auto flex items-end">
                  <button
                    onClick={fetchHolds}
                    disabled={loading}
                    className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm disabled:bg-gray-400"
                  >
                    <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600">Total Holds</p>
                  <p className="text-xl font-bold text-blue-600">{holds.length}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600">Active Holds</p>
                  <p className="text-xl font-bold text-green-600">
                    {holds.filter(h => !isExpired(h.expires_at)).length}
                  </p>
                </div>
                <div className="bg-red-50 p-3 rounded-lg col-span-2 sm:col-span-1">
                  <p className="text-xs text-gray-600">Expired Holds</p>
                  <p className="text-xl font-bold text-red-600">
                    {holds.filter(h => isExpired(h.expires_at)).length}
                  </p>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                <p className="mt-4 text-gray-600">Loading holds...</p>
              </div>
            )}

            {/* No Holds */}
            {!loading && filteredHolds.length === 0 && (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No Holds Found</h3>
                <p className="text-gray-600">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'Try adjusting your search or filter criteria.' 
                    : 'No holds have been created yet.'}
                </p>
              </div>
            )}

            {/* Desktop Table View */}
            {!loading && filteredHolds.length > 0 && (
              <div className="hidden lg:block bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Hold ID</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Room ID</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Category</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Capacity</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Check-in</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Check-out</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Expires At</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Time Left</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredHolds.map((hold) => {
                        const expired = isExpired(hold.expires_at);
                        return (
                          <tr key={hold.id} className={`hover:bg-gray-50 ${expired ? 'opacity-60' : ''}`}>
                            <td className="px-4 py-3 text-sm font-semibold text-gray-900">#{hold.id}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{hold.room_id}</td>
                            <td className="px-4 py-3 text-sm text-gray-600 capitalize">{hold.category}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{hold.capacity_count || 1}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{formatDate(hold.check_in)}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{formatDate(hold.check_out)}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{formatDateTime(hold.expires_at)}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`font-medium ${expired ? 'text-red-600' : 'text-green-600'}`}>
                                {getTimeRemaining(hold.expires_at)}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                expired 
                                  ? 'bg-red-100 text-red-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {expired ? 'Expired' : 'Active'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => handleCancelHold(hold.id)}
                                disabled={expired || cancellingHoldId === hold.id}
                                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                                  expired 
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                    : cancellingHoldId === hold.id
                                    ? 'bg-gray-400 text-white cursor-not-allowed'
                                    : 'bg-red-600 text-white hover:bg-red-700'
                                }`}
                              >
                                {cancellingHoldId === hold.id ? 'Cancelling...' : 'Cancel'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Mobile Card View */}
            {!loading && filteredHolds.length > 0 && (
              <div className="lg:hidden space-y-4">
                {filteredHolds.map((hold) => {
                  const expired = isExpired(hold.expires_at);
                  return (
                    <div key={hold.id} className={`bg-white rounded-lg shadow-md p-4 ${expired ? 'opacity-60' : ''}`}>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">Hold #{hold.id}</h3>
                          <p className="text-sm text-gray-600 capitalize">Room {hold.room_id} • {hold.category}</p>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          expired 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {expired ? 'Expired' : 'Active'}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Capacity:</span>
                          <span className="font-medium text-gray-900">{hold.capacity_count || 1} person(s)</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Check-in:</span>
                          <span className="font-medium text-gray-900">{formatDate(hold.check_in)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Check-out:</span>
                          <span className="font-medium text-gray-900">{formatDate(hold.check_out)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Expires At:</span>
                          <span className="font-medium text-gray-900">{formatDateTime(hold.expires_at)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Time Remaining:</span>
                          <span className={`font-medium ${expired ? 'text-red-600' : 'text-green-600'}`}>
                            {getTimeRemaining(hold.expires_at)}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleCancelHold(hold.id)}
                        disabled={expired || cancellingHoldId === hold.id}
                        className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                          expired 
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                            : cancellingHoldId === hold.id
                            ? 'bg-gray-400 text-white cursor-not-allowed'
                            : 'bg-red-600 text-white hover:bg-red-700'
                        }`}
                      >
                        {cancellingHoldId === hold.id ? 'Cancelling Hold...' : 'Cancel Hold'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default AdminHoldRoomsTabs;
