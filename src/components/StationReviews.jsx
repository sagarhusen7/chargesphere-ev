import React, { useState } from 'react';
import { Star, User, ThumbsUp, AlertTriangle } from 'lucide-react';

const StationReviews = ({ stationId, reviews = [] }) => {
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'highest', 'lowest'

  // Calculate average rating
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  // Rating distribution
  const ratingCounts = [0, 0, 0, 0, 0];
  reviews.forEach(r => ratingCounts[r.rating - 1]++);

  // Sort reviews
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'recent') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'highest') return b.rating - a.rating;
    return a.rating - b.rating;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <Star className="w-12 h-12 text-white/20 dark:text-gray-600 mx-auto mb-3" />
        <p className="text-white/60 dark:text-gray-400">No reviews yet</p>
        <p className="text-white/40 dark:text-gray-500 text-sm mt-1">
          Be the first to review this station!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Average Rating */}
        <div className="bg-white/5 dark:bg-gray-800/50 rounded-lg p-6 border border-white/10 dark:border-gray-700">
          <div className="text-center">
            <div className="text-5xl font-bold text-white dark:text-white mb-2">
              {avgRating}
            </div>
            <div className="flex items-center justify-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(avgRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-white/30 dark:text-gray-600'
                  }`}
                />
              ))}
            </div>
            <p className="text-white/60 dark:text-gray-400 text-sm">
              Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="bg-white/5 dark:bg-gray-800/50 rounded-lg p-6 border border-white/10 dark:border-gray-700">
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 w-12">
                  <span className="text-sm text-white/80 dark:text-gray-300">{rating}</span>
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 h-2 bg-white/10 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400"
                    style={{
                      width: `${reviews.length > 0 ? (ratingCounts[rating - 1] / reviews.length) * 100 : 0}%`
                    }}
                  />
                </div>
                <span className="text-sm text-white/60 dark:text-gray-400 w-8 text-right">
                  {ratingCounts[rating - 1]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white dark:text-white">Reviews</h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="input-field py-2 px-3 text-sm"
        >
          <option value="recent">Most Recent</option>
          <option value="highest">Highest Rating</option>
          <option value="lowest">Lowest Rating</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {sortedReviews.map((review, index) => (
          <div
            key={index}
            className="bg-white/5 dark:bg-gray-800/50 rounded-lg p-4 border border-white/10 dark:border-gray-700"
          >
            {/* Review Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="bg-primary-500/20 p-2 rounded-full">
                  <User className="w-4 h-4 text-primary-400" />
                </div>
                <div>
                  <p className="font-medium text-white dark:text-white">
                    {review.userName || 'Anonymous User'}
                  </p>
                  <p className="text-xs text-white/60 dark:text-gray-400">
                    {formatDate(review.date)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= review.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-white/30 dark:text-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Review Text */}
            {review.reviewText && (
              <p className="text-white/80 dark:text-gray-300 mb-3 leading-relaxed">
                {review.reviewText}
              </p>
            )}

            {/* Issues Reported */}
            {review.issues && review.issues.length > 0 && (
              <div className="mb-3">
                <div className="flex flex-wrap gap-2">
                  {review.issues.map((issue, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2 py-1 rounded bg-red-500/10 border border-red-500/30 text-red-300 text-xs"
                    >
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      {issue}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Helpful Button */}
            <button className="flex items-center space-x-2 text-sm text-white/60 dark:text-gray-400 hover:text-white dark:hover:text-white transition-colors">
              <ThumbsUp className="w-4 h-4" />
              <span>Helpful ({review.helpfulCount || 0})</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StationReviews;
