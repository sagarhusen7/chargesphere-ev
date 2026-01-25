const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  station: {
    id: String,
    name: {
      type: String,
      required: [true, 'Station name is required']
    },
    address: String,
    lat: Number,
    lng: Number
  },
  vehicle: {
    type: {
      type: String,
      required: true
    },
    model: String
  },
  bookingDate: {
    type: Date,
    required: [true, 'Booking date is required']
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required']
  },
  duration: {
    type: Number, // in minutes
    required: [true, 'Duration is required'],
    min: [15, 'Minimum duration is 15 minutes']
    // No max - allows vehicle rentals up to months
  },
  chargerType: {
    type: String,
    required: true
  },
  estimatedCost: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending' // Changed from confirmed - requires admin approval
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  notes: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Indexes for faster queries
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ 'station.id': 1, bookingDate: 1 });
bookingSchema.index({ status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
