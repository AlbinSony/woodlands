import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllHolds, cancelHold } from '../services/adminApi';
import { signOut } from '../services/supabase';

const AdminViewHolds = () => {
  const [holds, setHolds] = useState([]);
  const [filteredHolds, setFilteredHolds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, active, expired
  const [cancellingHoldId, setCancellingHoldId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/adminLogin');
      return;
    }

    fetchHolds();
  }, [navigate]);

  useEffect(() => {
    // Filter holds based on search term and status
    let filtered = [...holds];

    // Filter by status
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

    // Filter by search term
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
        // Refresh holds list
        await fetchHolds();
        // Clear success message after 3 seconds
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
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">View All Holds</h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Manage and monitor all room holds
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
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

            {/* Filter */}
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

            {/* Refresh Button */}
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
          <div className="hidden lg:block bg-white rounded-lg shadow-md overflow-hidden">
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
                  {/* Header */}
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

                  {/* Details */}
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
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Created At:</span>
                      <span className="font-medium text-gray-900">{formatDateTime(hold.created_at)}</span>
                    </div>
                  </div>

                  {/* Action */}
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
      </main>
    </div>
  );
};

export default AdminViewHolds;
