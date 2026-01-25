import { apiCall } from './api';

// Admin API calls

/**
 * Get all bookings (admin only)
 * @param {Object} params - Query parameters (status, page, limit)
 * @returns {Promise} All bookings
 */
export const getAllBookings = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return await apiCall(`/admin/bookings?${queryString}`, {
    method: 'GET',
    auth: true,
  });
};

/**
 * Approve booking
 * @param {string} bookingId - Booking ID
 * @returns {Promise} Approved booking
 */
export const approveBooking = async (bookingId) => {
  return await apiCall(`/admin/bookings/${bookingId}/approve`, {
    method: 'PUT',
    auth: true,
  });
};

/**
 * Reject booking
 * @param {string} bookingId - Booking ID
 * @returns {Promise} Rejected booking
 */
export const rejectBooking = async (bookingId) => {
  return await apiCall(`/admin/bookings/${bookingId}/reject`, {
    method: 'PUT',
    auth: true,
  });
};

/**
 * Get admin statistics
 * @returns {Promise} Dashboard stats
 */
export const getAdminStats = async () => {
  return await apiCall('/admin/stats', {
    method: 'GET',
    auth: true,
  });
};

/**
 * Get all users (admin only)
 * @returns {Promise} All users
 */
export const getAllUsers = async () => {
  return await apiCall('/admin/users', {
    method: 'GET',
    auth: true,
  });
};
