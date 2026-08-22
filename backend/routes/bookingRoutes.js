import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  cancelBooking,
} from '../controllers/bookingController.js';

const router = express.Router();

router.use(protect);

router.route('/').post(createBooking).get(getBookings);
router.route('/:id').get(getBookingById).put(updateBooking).patch(updateBooking);
router.patch('/:id/cancel', cancelBooking);

export default router;
