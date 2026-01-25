import { apiCall } from './api';

// User API calls

/**
 * Get user profile
 * @returns {Promise} User profile data
 */
export const getUserProfile = async () => {
  return await apiCall('/users/profile', {
    method: 'GET',
    auth: true,
  });
};

/**
 * Update user profile
 * @param {Object} profileData - Updated profile data
 * @returns {Promise} Updated profile
 */
export const updateUserProfile = async (profileData) => {
  return await apiCall('/users/profile', {
    method: 'PUT',
    auth: true,
    body: JSON.stringify(profileData),
  });
};

/**
 * Change password
 * @param {Object} passwordData - Current and new password
 * @returns {Promise} Confirmation message
 */
export const changePassword = async (passwordData) => {
  return await apiCall('/users/password', {
    method: 'PUT',
    auth: true,
    body: JSON.stringify(passwordData),
  });
};

/**
 * Get user favorites
 * @returns {Promise} List of favorite stations
 */
export const getUserFavorites = async () => {
  return await apiCall('/users/favorites', {
    method: 'GET',
    auth: true,
  });
};

/**
 * Add station to favorites
 * @param {Object} stationData - Station ID and name
 * @returns {Promise} Updated favorites
 */
export const addFavorite = async (stationData) => {
  return await apiCall('/users/favorites', {
    method: 'POST',
    auth: true,
    body: JSON.stringify(stationData),
  });
};

/**
 * Remove station from favorites
 * @param {string} stationId - Station ID
 * @returns {Promise} Updated favorites
 */
export const removeFavorite = async (stationId) => {
  return await apiCall(`/users/favorites/${stationId}`, {
    method: 'DELETE',
    auth: true,
  });
};
