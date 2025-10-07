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