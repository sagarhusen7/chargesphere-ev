const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');
const Review = require('../models/Review');

// @route   POST /api/reviews
// @desc    Create new review
// @access  Private
router.post('/', protect, [
  body('station.id').notEmpty().withMessage('Station ID is required'),
  body('station.name').notEmpty().withMessage('Station name is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1-5'),
  body('reviewText').optional().isLength({ max: 500 }).withMessage('Review cannot exceed 500 characters'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user already reviewed this station
    const existingReview = await Review.findOne({
      user: req.user._id,
      'station.id': req.body.station.id
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this station' });
    }

    const reviewData = {
      user: req.user._id,
      station: {
        id: req.body.station.id,
        name: req.body.station.name
      },
      rating: req.body.rating,
      reviewText: req.body.reviewText || '',
      issues: req.body.issues || [],
      photos: req.body.photos || []
    };

    const review = await Review.create(reviewData);

    // Populate user data
    await review.populate('user', 'name');

    res.status(201).json(review);
  } catch (error) {
    console.error('Create review error:', error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already reviewed this station' });
    }

    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/reviews/station/:stationId
// @desc    Get all reviews for a station
// @access  Public
router.get('/station/:stationId', async (req, res) => {
  try {
    const { sort = 'recent', page = 1, limit = 10 } = req.query;

    const query = { 'station.id': req.params.stationId };

    let sortOption = { createdAt: -1 }; // default: recent

    if (sort === 'highest') {
      sortOption = { rating: -1, createdAt: -1 };
    } else if (sort === 'lowest') {
      sortOption = { rating: 1, createdAt: -1 };
    }

    const reviews = await Review.find(query)
      .populate('user', 'name')
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Review.countDocuments(query);

    // Calculate average rating
    const stats = await Review.aggregate([
      { $match: { 'station.id': req.params.stationId } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          ratings: {
            $push: '$rating'
          }
        }
      }
    ]);

    // Calculate rating distribution
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    if (stats.length > 0 && stats[0].ratings) {
      stats[0].ratings.forEach(rating => {
        distribution[rating] = (distribution[rating] || 0) + 1;
      });
    }

    res.json({
      reviews,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
      stats: stats.length > 0 ? {
        averageRating: stats[0].averageRating.toFixed(1),
        totalReviews: stats[0].totalReviews,
        distribution
      } : {
        averageRating: 0,
        totalReviews: 0,
        distribution
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/reviews/user
// @desc    Get all reviews by logged-in user
// @access  Private
router.get('/user', protect, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/reviews/:id
// @desc    Update review
// @access  Private
router.put('/:id', protect, [
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1-5'),
  body('reviewText').optional().isLength({ max: 500 }).withMessage('Review cannot exceed 500 characters'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if review belongs to user
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    // Update fields
    if (req.body.rating) review.rating = req.body.rating;
    if (req.body.reviewText !== undefined) review.reviewText = req.body.reviewText;
    if (req.body.issues) review.issues = req.body.issues;

    const updatedReview = await review.save();
    await updatedReview.populate('user', 'name');

    res.json(updatedReview);
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete review
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if review belongs to user
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await review.deleteOne();

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/reviews/:id/helpful
// @desc    Mark review as helpful
// @access  Private
router.post('/:id/helpful', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user already marked as helpful
    if (review.helpfulBy.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already marked as helpful' });
    }

    review.helpfulBy.push(req.user._id);
    review.helpfulCount = review.helpfulBy.length;

    await review.save();

    res.json({ message: 'Marked as helpful', helpfulCount: review.helpfulCount });
  } catch (error) {
    console.error('Mark helpful error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
