import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createReview,
  getReviews,
  getReviewSummary,
  getMyReviews,
  getReviewById,
  updateReview,
  deleteReview,
  toggleHelpful,
} from '../controllers/reviewController.js';

const router = express.Router();

// Public - anyone can browse reviews
router.get('/', getReviews);
router.get('/summary', getReviewSummary);

// Protected - specific routes before /:id to avoid route collisions
router.get('/mine', protect, getMyReviews);
router.post('/', protect, createReview);
router.post('/:id/helpful', protect, toggleHelpful);

router.get('/:id', getReviewById);
router.put('/:id', protect, updateReview);
router.patch('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

export default router;