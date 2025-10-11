const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('admin_token');
};

// Fetch all bookings (Admin only)
export const getAllBookings = async () => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('Authentication token not found. Please login again.');
    }

    const response = await fetch(`${API_BASE_URL}/admin/bookings`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('admin_token');
      throw new Error('Session expired. Please login again.');
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch bookings: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: data.bookings || data.data || data,
      message: 'Bookings fetched successfully'
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to fetch bookings',
      error
    };
  }
};

// Hold rooms for a specific duration (Admin only)
export const holdRooms = async (holdData) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('Authentication token not found. Please login again.');
    }

    const response = await fetch(`${API_BASE_URL}/admin/hold-rooms`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(holdData),
    });

    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('admin_token');
      throw new Error('Session expired. Please login again.');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to hold rooms: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: data.data || data,
      message: data.data?.message || 'Rooms held successfully'
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to hold rooms',
      error
    };
  }
};

// Cancel a hold/lock on rooms (Admin only)
export const cancelHold = async (holdGroupId) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('Authentication token not found. Please login again.');
    }

    const response = await fetch(`${API_BASE_URL}/admin/cancel-hold`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ holdGroupId }),
    });

    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('admin_token');
      throw new Error('Session expired. Please login again.');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to cancel hold: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      message: data.message || 'Hold cancelled successfully'
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to cancel hold',
      error
    };
  }
};

// Get all admin holds (Admin only)
export const getAllHolds = async () => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('Authentication token not found. Please login again.');
    }

    const response = await fetch(`${API_BASE_URL}/admin/holds`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('admin_token');
      throw new Error('Session expired. Please login again.');
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch holds: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: data.data || data,
      message: 'Holds fetched successfully'
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to fetch holds',
      error
    };
  }
};

// Confirm booking with hold (Admin only)
export const confirmBooking = async (bookingData) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('Authentication token not found. Please login again.');
    }

    const response = await fetch(`${API_BASE_URL}/admin/admin-confirm-booking`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });

    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('admin_token');
      throw new Error('Session expired. Please login again.');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to confirm booking: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: data.bookingIds || data,
      message: 'Booking confirmed successfully'
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to confirm booking',
      error
    };
  }
};

// Additional admin API helpers can be added here
export const adminApi = {
  getAllBookings,
  holdRooms,
  cancelHold,
  getAllHolds,
  confirmBooking,
};
