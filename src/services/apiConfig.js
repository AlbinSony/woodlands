// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://reservation-booking-backend.vercel.app/api';

// API Endpoints
export const API_ENDPOINTS = {
  CATEGORIES: '/categories',
  AVAILABILITY: '/reservations/availability',
  HOLD_ROOM: '/reservations/hold',
  CANCEL_HOLD: '/reservations/cancel-hold',
  CREATE_ORDER: '/reservations/payment/order',
  CONFIRM_BOOKING: '/reservations/booking/confirm'
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};