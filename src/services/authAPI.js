import { apiCall } from './api';

// Authentication API calls

/**
 * Register new user
 * @param {Object} userData - User registration data
 * @returns {Promise} User data with token
 */
export const register = async (userData) => {
  return await apiCall('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

/**
 * Login user
 * @param {Object} credentials - Email and password
 * @returns {Promise} User data with token
 */
export const login = async (credentials) => {
  return await apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

/**
 * Get current user
 * @returns {Promise} Current user data
 */
export const getCurrentUser = async () => {
  return await apiCall('/auth/me', {
    method: 'GET',
    auth: true,
  });
};

/**
 * Logout user (client-side only)
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
