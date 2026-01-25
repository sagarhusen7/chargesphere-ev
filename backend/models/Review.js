const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  station: {
    id: {
      type: String,
      required: [true, 'Station ID is required']
    },
    name: {
      type: String,
      required: [true, 'Station name is required']
    }
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviewText: {
    type: String,
    maxlength: [500, 'Review cannot exceed 500 characters'],
    trim: true
  },
  issues: [{
    type: String,
    enum: [
      'Charger not working',
      'Wrong location',
      'Price incorrect',
      'Poor maintenance',
      'Access issues',
      'Other'
    ]
  }],
  photos: [{
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  helpfulCount: {
    type: Number,
    default: 0
  },
  helpfulBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isVerified: {
    type: Boolean,
    default: false // Can be set to true if user actually booked this station
  }
}, {
  timestamps: true
});

// Indexes
reviewSchema.index({ 'station.id': 1, createdAt: -1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ rating: -1 });

// Prevent duplicate reviews from same user for same station
reviewSchema.index({ user: 1, 'station.id': 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
