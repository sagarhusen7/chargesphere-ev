const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');
const Booking = require('../models/Booking');

// @route   POST /api/bookings
// @desc    Create new booking
// @access  Private
router.post('/', protect, [
  body('station.name').notEmpty().withMessage('Station name is required'),
  body('vehicle.type').notEmpty().withMessage('Vehicle type is required'),
  body('bookingDate').isISO8601().withMessage('Valid booking date is required'),
  body('startTime').notEmpty().withMessage('Start time is required'),
  body('duration').isInt({ min: 15, max: 525600 }).withMessage('Duration must be valid'), // Max 1 year in minutes for rentals
  body('chargerType').notEmpty().withMessage('Charger type is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const bookingData = {
      user: req.user._id,
      station: {
        id: req.body.station.id,
        name: req.body.station.name,
        address: req.body.station.address,
        lat: req.body.station.lat,
        lng: req.body.station.lng
      },
      vehicle: {
        type: req.body.vehicle.type,
        model: req.body.vehicle.model
      },
      bookingDate: req.body.bookingDate,
      startTime: req.body.startTime,
      duration: req.body.duration,
      chargerType: req.body.chargerType,
      estimatedCost: req.body.estimatedCost || 0,
      notes: req.body.notes,
      status: 'pending' // Changed from 'confirmed' - requires admin approval
    };

    const booking = await Booking.create(bookingData);

    res.status(201).json(booking);
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/bookings
// @desc    Get all bookings for logged-in user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = { user: req.user._id };

    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Booking.countDocuments(query);

    res.json({
      bookings,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get booking by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if booking belongs to user
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/bookings/:id
// @desc    Update booking
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if booking belongs to user
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    // Update fields (only allow certain fields to be updated)
    if (req.body.bookingDate) booking.bookingDate = req.body.bookingDate;
    if (req.body.startTime) booking.startTime = req.body.startTime;
    if (req.body.duration) booking.duration = req.body.duration;
    if (req.body.notes) booking.notes = req.body.notes;
    if (req.body.status) booking.status = req.body.status;

    const updatedBooking = await booking.save();

    res.json(updatedBooking);
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/bookings/:id
// @desc    Cancel/Delete booking
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if booking belongs to user
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    // Update status to cancelled instead of deleting
    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/bookings/stats/summary
// @desc    Get booking statistics for user
// @access  Private
router.get('/stats/summary', protect, async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments({ user: req.user._id });
    const completedBookings = await Booking.countDocuments({
      user: req.user._id,
      status: 'completed'
    });
    const upcomingBookings = await Booking.countDocuments({
      user: req.user._id,
      status: 'confirmed',
      bookingDate: { $gte: new Date() }
    });

    res.json({
      total: totalBookings,
      completed: completedBookings,
      upcoming: upcomingBookings
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
