import { apiCall } from './api';

// Review API calls

/**
 * Create new review
 * @param {Object} reviewData - Review details
 * @returns {Promise} Created review
 */
export const createReview = async (reviewData) => {
  return await apiCall('/reviews', {
    method: 'POST',
    auth: true,
    body: JSON.stringify(reviewData),
  });
};

/**
 * Get reviews for a station
 * @param {string} stationId - Station ID
 * @param {Object} params - Query parameters (sort, page, limit)
 * @returns {Promise} Reviews with stats
 */
export const getStationReviews = async (stationId, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return await apiCall(`/reviews/station/${stationId}?${queryString}`, {
    method: 'GET',
  });
};

/**
 * Get user's reviews
 * @returns {Promise} User's reviews
 */
export const getUserReviews = async () => {
  return await apiCall('/reviews/user', {
    method: 'GET',
    auth: true,
  });
};

/**
 * Update review
 * @param {string} reviewId - Review ID
 * @param {Object} updateData - Updated review data
 * @returns {Promise} Updated review
 */
export const updateReview = async (reviewId, updateData) => {
  return await apiCall(`/reviews/${reviewId}`, {
    method: 'PUT',
    auth: true,
    body: JSON.stringify(updateData),
  });
};

/**
 * Delete review
 * @param {string} reviewId - Review ID
 * @returns {Promise} Deletion confirmation
 */
export const deleteReview = async (reviewId) => {
  return await apiCall(`/reviews/${reviewId}`, {
    method: 'DELETE',
    auth: true,
  });
};

/**
 * Mark review as helpful
 * @param {string} reviewId - Review ID
 * @returns {Promise} Updated helpful count
 */
export const markReviewHelpful = async (reviewId) => {
  return await apiCall(`/reviews/${reviewId}/helpful`, {
    method: 'POST',
    auth: true,
  });
};
