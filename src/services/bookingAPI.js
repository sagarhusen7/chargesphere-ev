import { apiCall } from './api';

// Booking API calls

/**
 * Create new booking
 * @param {Object} bookingData - Booking details
 * @returns {Promise} Created booking
 */
export const createBooking = async (bookingData) => {
  return await apiCall('/bookings', {
    method: 'POST',
    auth: true,
    body: JSON.stringify(bookingData),
  });
};

/**
 * Get user's bookings
 * @param {Object} params - Query parameters (status, page, limit)
 * @returns {Promise} List of bookings
 */
export const getUserBookings = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return await apiCall(`/bookings?${queryString}`, {
    method: 'GET',
    auth: true,
  });
};

/**
 * Get booking by ID
 * @param {string} bookingId - Booking ID
 * @returns {Promise} Booking details
 */
export const getBookingById = async (bookingId) => {
  return await apiCall(`/bookings/${bookingId}`, {
    method: 'GET',
    auth: true,
  });
};

/**
 * Update booking
 * @param {string} bookingId - Booking ID
 * @param {Object} updateData - Updated booking data
 * @returns {Promise} Updated booking
 */
export const updateBooking = async (bookingId, updateData) => {
  return await apiCall(`/bookings/${bookingId}`, {
    method: 'PUT',
    auth: true,
    body: JSON.stringify(updateData),
  });
};

/**
 * Cancel booking
 * @param {string} bookingId - Booking ID
 * @returns {Promise} Cancellation confirmation
 */
export const cancelBooking = async (bookingId) => {
  return await apiCall(`/bookings/${bookingId}`, {
    method: 'DELETE',
    auth: true,
  });
};

/**
 * Get booking statistics
 * @returns {Promise} Booking stats
 */
export const getBookingStats = async () => {
  return await apiCall('/bookings/stats/summary', {
    method: 'GET',
    auth: true,
  });
};
