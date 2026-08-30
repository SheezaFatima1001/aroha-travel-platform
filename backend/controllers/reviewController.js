import mongoose from 'mongoose';
import Review from '../models/Review.js';
import Destination from '../models/Destination.js';
import Service from '../models/Service.js';

const TARGET_MODELS = { Destination, Service };

const validTarget = (targetType) => Object.prototype.hasOwnProperty.call(TARGET_MODELS, targetType);

const ensureTargetExists = async (targetType, targetId) => {
  if (!validTarget(targetType)) return null;
  if (!mongoose.Types.ObjectId.isValid(targetId)) return null;
  return TARGET_MODELS[targetType].findById(targetId);
};

// POST /api/reviews
export const createReview = async (req, res, next) => {
  try {
    const { targetType, targetId, rating, reviewText, image } = req.body;

    if (!targetType || !targetId) {
      return res.status(400).json({ success: false, message: 'targetType and targetId are required' });
    }
    if (!validTarget(targetType)) {
      return res.status(400).json({ success: false, message: 'targetType must be Destination or Service' });
    }
    if (rating === undefined || rating === null) {
      return res.status(400).json({ success: false, message: 'Rating is required' });
    }
    if (Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }
    if (!reviewText || !reviewText.trim()) {
      return res.status(400).json({ success: false, message: 'Review text is required' });
    }

    const target = await ensureTargetExists(targetType, targetId);
    if (!target) {
      return res.status(404).json({ success: false, message: `${targetType} not found` });
    }

    const existing = await Review.findOne({ user: req.user._id, targetType, targetId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this. Edit your existing review instead.' });
    }

    const review = await Review.create({
      user: req.user._id,
      targetType,
      targetId,
      rating,
      reviewText: reviewText.trim(),
      image: image || '',
    });

    const populated = await review.populate('user', 'name profileImage');
    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this.' });
    }
    next(err);
  }
};

// GET /api/reviews?targetType=Destination&targetId=...&rating=4&sort=helpful
export const getReviews = async (req, res, next) => {
  try {
    const { targetType, targetId, rating, sort } = req.query;

    if (!targetType || !targetId) {
      return res.status(400).json({ success: false, message: 'targetType and targetId are required' });
    }
    if (!validTarget(targetType)) {
      return res.status(400).json({ success: false, message: 'targetType must be Destination or Service' });
    }

    const filter = { targetType, targetId };
    if (rating) filter.rating = Number(rating);

    let sortOption = { createdAt: -1 }; // newest first (default)
    if (sort === 'helpful') sortOption = { helpfulCount: -1, createdAt: -1 };
    else if (sort === 'highest') sortOption = { rating: -1, createdAt: -1 };
    else if (sort === 'lowest') sortOption = { rating: 1, createdAt: -1 };
    else if (sort === 'oldest') sortOption = { createdAt: 1 };

    const reviews = await Review.find(filter).populate('user', 'name profileImage').sort(sortOption);

    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (err) {
    next(err);
  }
};

// GET /api/reviews/summary?targetType=Destination&targetId=...
export const getReviewSummary = async (req, res, next) => {
  try {
    const { targetType, targetId } = req.query;

    if (!targetType || !targetId || !validTarget(targetType)) {
      return res.status(400).json({ success: false, message: 'Valid targetType and targetId are required' });
    }

    const targetObjectId = new mongoose.Types.ObjectId(targetId);

    const [agg] = await Review.aggregate([
      { $match: { targetType, targetId: targetObjectId } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          fiveStar: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
          fourStar: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
          threeStar: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
          twoStar: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
          oneStar: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } },
        },
      },
    ]);

    if (!agg) {
      return res.json({
        success: true,
        data: {
          averageRating: 0,
          totalReviews: 0,
          distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        },
      });
    }

    res.json({
      success: true,
      data: {
        averageRating: Math.round(agg.averageRating * 10) / 10,
        totalReviews: agg.totalReviews,
        distribution: {
          5: agg.fiveStar,
          4: agg.fourStar,
          3: agg.threeStar,
          2: agg.twoStar,
          1: agg.oneStar,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/reviews/mine  (protected)
export const getMyReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate('user', 'name profileImage')
      .populate('targetId')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (err) {
    next(err);
  }
};

// GET /api/reviews/:id
export const getReviewById = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id).populate('user', 'name profileImage');
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    res.json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
};

// PUT /api/reviews/:id  (protected, owner only)
export const updateReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this review' });
    }

    const { rating, reviewText, image } = req.body;

    if (rating !== undefined) {
      if (Number(rating) < 1 || Number(rating) > 5) {
        return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
      }
      review.rating = rating;
    }
    if (reviewText !== undefined) {
      if (!reviewText.trim()) {
        return res.status(400).json({ success: false, message: 'Review text is required' });
      }
      review.reviewText = reviewText.trim();
    }
    if (image !== undefined) review.image = image;

    await review.save();
    const populated = await review.populate('user', 'name profileImage');
    res.json({ success: true, data: populated });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/reviews/:id  (protected, owner only)
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
    }
    await review.deleteOne();
    res.json({ success: true, message: 'Review deleted' });
  } catch (err) {
    next(err);
  }
};

// POST /api/reviews/:id/helpful  (protected) - toggle
export const toggleHelpful = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    const userId = req.user._id.toString();
    const alreadyMarked = review.helpfulBy.some((id) => id.toString() === userId);

    if (alreadyMarked) {
      review.helpfulBy = review.helpfulBy.filter((id) => id.toString() !== userId);
      review.helpfulCount = Math.max(0, review.helpfulCount - 1);
    } else {
      review.helpfulBy.push(req.user._id);
      review.helpfulCount += 1;
    }

    await review.save();
    res.json({ success: true, data: { helpfulCount: review.helpfulCount, markedByMe: !alreadyMarked } });
  } catch (err) {
    next(err);
  }
};