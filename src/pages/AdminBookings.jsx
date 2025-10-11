import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllBookings } from '../services/adminApi';
import { signOut } from '../services/supabase';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const itemsPerPage = 10;

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/adminLogin');
      return;
    }

    fetchBookings();
  }, [navigate]);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await getAllBookings();

      if (result.success) {
        setBookings(result.data || []);
      } else {
        setError(result.message);
        if (result.message.includes('Session expired') || result.message.includes('Authentication')) {
          setTimeout(() => navigate('/adminLogin'), 2000);
        }
      }
    } catch (err) {
      setError('Failed to load bookings. Please try again.');
      console.error('Error fetching bookings:', err);
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

  // Filter bookings based on search
  const filteredBookings = bookings.filter((booking) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      (booking.guest_name?.toLowerCase().includes(search)) ||
      (booking.guestName?.toLowerCase().includes(search)) ||
      (booking.guest_email?.toLowerCase().includes(search)) ||
      (booking.email?.toLowerCase().includes(search)) ||
      (booking.guest_phone_number?.includes(search)) ||
      (booking.phone?.includes(search)) ||
      (booking.category?.toLowerCase().includes(search)) ||
      (booking.roomCategory?.toLowerCase().includes(search)) ||
      (booking.status?.toLowerCase().includes(search))
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBookings = filteredBookings.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
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
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">All Bookings</h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Total: {filteredBookings.length} bookings
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={fetchBookings}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center text-sm"
                disabled={loading}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Search Bar */}
        <div className="mb-4 sm:mb-6">
          <input
            type="text"
            placeholder="Search by name, email, phone, category, or status..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm sm:text-base"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg mb-4 sm:mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <svg className="animate-spin h-8 w-8 sm:h-10 sm:w-10 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : currentBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 sm:p-8 text-center">
            <p className="text-gray-600 text-sm sm:text-base">
              {searchTerm ? 'No bookings found matching your search.' : 'No bookings available.'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guest</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check-in</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check-out</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentBookings.map((booking, index) => (
                      <tr key={booking.id || index} className="hover:bg-gray-50">
                        <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-900">
                          #{booking.id || '-'}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-700">
                          {booking.room_id || '-'}
                        </td>
                        <td className="px-3 py-3 text-xs font-medium text-gray-900">
                          <div className="max-w-[120px] truncate">
                            {booking.guest_name || booking.guestName || '-'}
                          </div>
                        </td>
                        <td className="px-3 py-3 text-xs text-gray-600">
                          <div className="max-w-[140px]">
                            <div className="truncate">{booking.guest_email || '-'}</div>
                            <div className="text-gray-500 truncate">{booking.guest_phone_number || '-'}</div>
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-xs capitalize text-gray-600">
                          {booking.category || '-'}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-600">
                          {formatDate(booking.check_in)}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-600">
                          {formatDate(booking.check_out)}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-xs capitalize text-gray-600">
                          {booking.mode_of_payment || '-'}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-xs font-semibold text-gray-900">
                          ₹{booking.total_price?.toLocaleString('en-IN') || '0'}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(booking.status)}`}>
                            {booking.status || 'N/A'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden space-y-4">
              {currentBookings.map((booking, index) => (
                <div key={booking.id || index} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">
                        {booking.guest_name || booking.guestName || 'N/A'}
                      </h3>
                      <p className="text-xs text-gray-500">ID: #{booking.id || '-'} | Room: {booking.room_id || '-'}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(booking.status)}`}>
                      {booking.status || 'N/A'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-gray-500 font-medium">Category</p>
                      <p className="text-gray-900 capitalize">{booking.category || '-'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">Total Price</p>
                      <p className="text-gray-900 font-bold">₹{booking.total_price?.toLocaleString('en-IN') || '0'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">Check-in</p>
                      <p className="text-gray-900">{formatDate(booking.check_in)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">Check-out</p>
                      <p className="text-gray-900">{formatDate(booking.check_out)}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-500 font-medium">Email</p>
                      <p className="text-gray-900 truncate">{booking.guest_email || '-'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">Phone</p>
                      <p className="text-gray-900">{booking.guest_phone_number || '-'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">Payment</p>
                      <p className="text-gray-900 capitalize">{booking.mode_of_payment || '-'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`w-full sm:w-auto px-4 py-2 rounded-lg font-medium text-sm ${
                    currentPage === 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  Previous
                </button>
                
                <div className="flex gap-1 flex-wrap justify-center">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNum = index + 1;
                    // Show first, last, current, and neighbors
                    const showPage = pageNum === 1 || pageNum === totalPages || 
                                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);
                    
                    if (!showPage && pageNum === 2) {
                      return <span key={index + 1} className="px-2 py-2 text-gray-400">...</span>;
                    }
                    if (!showPage && pageNum === totalPages - 1) {
                      return <span key={index + 1} className="px-2 py-2 text-gray-400">...</span>;
                    }
                    if (!showPage) return null;
                    
                    return (
                      <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm ${
                          currentPage === index + 1
                            ? 'bg-green-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                        }`}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`w-full sm:w-auto px-4 py-2 rounded-lg font-medium text-sm ${
                    currentPage === totalPages
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default AdminBookings;
