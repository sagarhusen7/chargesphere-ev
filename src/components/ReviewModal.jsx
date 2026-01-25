import React, { useState } from 'react';
import { X, Star, Camera, AlertTriangle, Send } from 'lucide-react';
import * as reviewAPI from '../services/reviewAPI';

const ReviewModal = ({ station, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    rating: 0,
    reviewText: '',
    issues: [],
    photos: []
  });
  const [hoveredStar, setHoveredStar] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const issueTypes = [
    'Charger not working',
    'Wrong location',
    'Price incorrect',
    'Poor maintenance',
    'Access issues',
    'Other'
  ];

  const handleStarClick = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleIssueToggle = (issue) => {
    setFormData(prev => ({
      ...prev,
      issues: prev.issues.includes(issue)
        ? prev.issues.filter(i => i !== issue)
        : [...prev.issues, issue]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.rating === 0) {
      setError('Please select a rating');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const reviewData = {
        station: {
          id: station.id,
          name: station.name
        },
        rating: formData.rating,
        reviewText: formData.reviewText.trim(),
        issues: formData.issues,
        photos: formData.photos
      };

      await reviewAPI.createReview(reviewData);
      
      // Notify parent component
      if (onSubmit) {
        onSubmit({
          ...formData,
          stationId: station.id,
          stationName: station.name,
          date: new Date().toISOString()
        });
      }
      
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit review. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-white dark:text-white">Review Station</h2>
            <p className="text-white/60 dark:text-gray-400 text-sm mt-1">{station.name}</p>
          </div>
          <button onClick={onClose} className="btn-icon text-white dark:text-gray-300">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium text-white/80 dark:text-gray-300 mb-3">
              Your Rating *
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredStar || formData.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-white/30 dark:text-gray-600'
                    }`}
                  />
                </button>
              ))}
              {formData.rating > 0 && (
                <span className="ml-3 text-white dark:text-white font-medium">
                  {formData.rating === 5 ? 'Excellent!' : 
                   formData.rating === 4 ? 'Great!' :
                   formData.rating === 3 ? 'Good' :
                   formData.rating === 2 ? 'Fair' : 'Poor'}
                </span>
              )}
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-sm font-medium text-white/80 dark:text-gray-300 mb-2">
              Your Review
            </label>
            <textarea
              value={formData.reviewText}
              onChange={(e) => setFormData(prev => ({ ...prev, reviewText: e.target.value }))}
              placeholder="Share your experience with this charging station..."
              className="input-field min-h-[120px] resize-none"
              maxLength={500}
            />
            <p className="text-xs text-white/40 dark:text-gray-500 mt-1">
              {formData.reviewText.length}/500 characters
            </p>
          </div>

          {/* Report Issues */}
          <div>
            <label className="block text-sm font-medium text-white/80 dark:text-gray-300 mb-3">
              <AlertTriangle className="w-4 h-4 inline mr-1" />
              Report Issues (Optional)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {issueTypes.map((issue) => (
                <button
                  key={issue}
                  type="button"
                  onClick={() => handleIssueToggle(issue)}
                  className={`p-3 rounded-lg text-sm font-medium transition-all ${
                    formData.issues.includes(issue)
                      ? 'bg-red-500/20 border-2 border-red-500 text-red-300'
                      : 'bg-white/5 border-2 border-white/10 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {issue}
                </button>
              ))}
            </div>
          </div>

          {/* Photo Upload Placeholder */}
          <div>
            <label className="block text-sm font-medium text-white/80 dark:text-gray-300 mb-2">
              <Camera className="w-4 h-4 inline mr-1" />
              Add Photos (Coming Soon)
            </label>
            <div className="border-2 border-dashed border-white/20 dark:border-gray-700 rounded-lg p-8 text-center">
              <Camera className="w-12 h-12 text-white/30 dark:text-gray-600 mx-auto mb-2" />
              <p className="text-white/40 dark:text-gray-500 text-sm">
                Photo upload will be available soon
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex items-center space-x-3 pt-4">
            <button 
              type="submit" 
              className="btn-primary flex-1"
              disabled={loading}
            >
              <Send className="w-5 h-5 mr-2" />
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
