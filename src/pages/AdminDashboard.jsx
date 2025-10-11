import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from '../services/supabase';
import { getAllBookings, getAllHolds } from '../services/adminApi';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeReservations: 0,
    monthlyRevenue: 0,
    loading: true
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('admin_token');
    const userData = localStorage.getItem('admin_user');

    if (!token) {
      navigate('/adminLogin');
      return;
    }

    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    // Fetch dashboard statistics
    fetchDashboardStats();
  }, [navigate]);

  const fetchDashboardStats = async () => {
    try {
      // Fetch all bookings
      const bookingsResult = await getAllBookings();
      
      if (bookingsResult.success) {
        const bookings = bookingsResult.data || [];
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        // Total bookings
        const totalBookings = bookings.length;

        // Active reservations (check-out date is in the future)
        const activeReservations = bookings.filter(booking => {
          const checkOutDate = new Date(booking.check_out || booking.checkOut);
          return checkOutDate >= currentDate;
        }).length;

        // Monthly revenue (bookings created in current month)
        const monthlyRevenue = bookings
          .filter(booking => {
            const createdDate = new Date(booking.created_at || booking.createdAt);
            return createdDate.getMonth() === currentMonth && 
                   createdDate.getFullYear() === currentYear;
          })
          .reduce((sum, booking) => {
            // Use total_price field as shown in AdminBookings table
            const amount = parseFloat(booking.total_price || booking.totalPrice || booking.total_amount || booking.totalAmount || 0);
            return sum + amount;
          }, 0);

        setStats({
          totalBookings,
          activeReservations,
          monthlyRevenue,
          loading: false
        });
      } else {
        setStats(prev => ({ ...prev, loading: false }));
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setStats(prev => ({ ...prev, loading: false }));
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Admin Dashboard</h1>
              {user && (
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Welcome, {user.email}
                </p>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm sm:text-base"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* View All Bookings Card */}
          <div
            onClick={() => navigate('/adminLogin/dashboard/bookings')}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-5 sm:p-6 cursor-pointer border-2 border-transparent hover:border-green-500"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
              View All Bookings
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm">
              See all reservations, manage bookings, and track payment status
            </p>
          </div>

          {/* Hold/Lock Rooms Card */}
          <div
            onClick={() => navigate('/adminLogin/dashboard/hold-rooms')}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-5 sm:p-6 cursor-pointer border-2 border-transparent hover:border-green-500"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 sm:p-3 bg-orange-100 rounded-lg">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
              Hold/Lock Rooms
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm">
              Reserve or lock rooms for specific duration or before booking
            </p>
          </div>

          {/* Confirm Booking Card */}
          <div
            onClick={() => navigate('/adminLogin/dashboard/confirm-booking')}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-5 sm:p-6 cursor-pointer border-2 border-transparent hover:border-green-500"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
              Create Booking
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm">
              Select rooms and create bookings with offline payment
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-5 sm:p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs sm:text-sm font-medium opacity-90">Total Bookings</h4>
              <svg className="w-8 h-8 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-2xl sm:text-3xl font-bold">
              {stats.loading ? (
                <span className="animate-pulse">--</span>
              ) : (
                stats.totalBookings
              )}
            </p>
            <p className="text-xs opacity-75 mt-2">
              {stats.loading ? 'Loading...' : 'All time'}
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-5 sm:p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs sm:text-sm font-medium opacity-90">Active Reservations</h4>
              <svg className="w-8 h-8 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-2xl sm:text-3xl font-bold">
              {stats.loading ? (
                <span className="animate-pulse">--</span>
              ) : (
                stats.activeReservations
              )}
            </p>
            <p className="text-xs opacity-75 mt-2">
              {stats.loading ? 'Loading...' : 'Currently ongoing'}
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-5 sm:p-6 text-white sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs sm:text-sm font-medium opacity-90">Revenue (Month)</h4>
              <svg className="w-8 h-8 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-2xl sm:text-3xl font-bold">
              {stats.loading ? (
                <span className="animate-pulse">--</span>
              ) : (
                `₹${stats.monthlyRevenue.toLocaleString('en-IN')}`
              )}
            </p>
            <p className="text-xs opacity-75 mt-2">
              {stats.loading ? 'Loading...' : new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
