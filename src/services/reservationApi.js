import { API_BASE_URL, API_ENDPOINTS } from './apiConfig';

// Generic API request handler
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const config = {
    ...defaultOptions,
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Fetch all room categories
export const fetchRoomCategories = async () => {
  try {
    const response = await apiRequest(API_ENDPOINTS.CATEGORIES);
    return response;
  } catch (error) {
    console.error('Failed to fetch room categories:', error);
    throw error;
  }
};

// Check room availability
export const checkRoomAvailability = async (checkIn, checkOut, type = null) => {
  try {
    let endpoint = `${API_ENDPOINTS.AVAILABILITY}?checkIn=${checkIn}&checkOut=${checkOut}`;
    
    if (type) {
      endpoint += `&type=${type}`;
    }
    
    const response = await apiRequest(endpoint);
    return response;
  } catch (error) {
    console.error('Failed to check room availability:', error);
    throw error;
  }
};

// Hold rooms before payment
export const holdRooms = async (roomRequests, checkIn, checkOut, userId = null) => {
  try {
    const body = {
      roomRequests,
      checkIn,
      checkOut,
    };
    
    if (userId) {
      body.userId = userId;
    }
    
    const response = await apiRequest(API_ENDPOINTS.HOLD_ROOM, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    
    return response;
  } catch (error) {
    console.error('Failed to hold rooms:', error);
    throw error;
  }
};

// Cancel hold
export const cancelHold = async (holdGroupId) => {
  try {
    const response = await apiRequest(API_ENDPOINTS.CANCEL_HOLD, {
      method: 'DELETE',
      body: JSON.stringify({ holdGroupId }),
    });
    
    return response;
  } catch (error) {
    console.error('Failed to cancel hold:', error);
    throw error;
  }
};

// Create payment order
export const createPaymentOrder = async (holdGroupId, guestName, guestEmail, guestPhoneNumber) => {
  try {
    const response = await apiRequest(API_ENDPOINTS.CREATE_ORDER, {
      method: 'POST',
      body: JSON.stringify({
        holdGroupId: holdGroupId.toString(),
        guest_name: guestName,
        guest_email: guestEmail,
        guest_phone_number: guestPhoneNumber,
      }),
    });
    
    return response;
  } catch (error) {
    console.error('Failed to create payment order:', error);
    throw error;
  }
};

// Confirm booking after successful payment
export const confirmBooking = async (holdGroupId, razorpayPaymentId) => {
  try {
    const response = await apiRequest(API_ENDPOINTS.CONFIRM_BOOKING, {
      method: 'POST',
      body: JSON.stringify({
        holdGroupId: holdGroupId.toString(),
        razorpayPaymentId,
      }),
    });
    
    return response;
  } catch (error) {
    console.error('Failed to confirm booking:', error);
    throw error;
  }
};