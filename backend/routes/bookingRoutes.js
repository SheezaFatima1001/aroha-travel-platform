import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import {
  createBooking, getBookings, getBookingById, updateBooking, cancelBooking,
  updateBookingStatus, getAllBookingsAdmin,
} from '../controllers/bookingController.js';

const router = express.Router();
router.use(protect);

// Admin routes (specific paths before /:id to avoid collisions)
router.get('/admin/all', adminOnly, getAllBookingsAdmin);
router.patch('/:id/status', adminOnly, updateBookingStatus);

router.route('/').post(createBooking).get(getBookings);
router.route('/:id').get(getBookingById).put(updateBooking).patch(updateBooking);
router.patch('/:id/cancel', cancelBooking);
export default router;