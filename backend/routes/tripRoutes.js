import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createTrip,
  getTrips,
  getTripStats,
  getTripById,
  updateTrip,
  deleteTrip,
  addActivity,
  updateActivity,
  deleteActivity,
} from '../controllers/tripController.js';

const router = express.Router();

router.use(protect);

router.route('/').post(createTrip).get(getTrips);
router.get('/stats', getTripStats);
router.route('/:id').get(getTripById).put(updateTrip).patch(updateTrip).delete(deleteTrip);

router.post('/:tripId/activities', addActivity);
router.put('/:tripId/activities/:activityId', updateActivity);
router.patch('/:tripId/activities/:activityId', updateActivity);
router.delete('/:tripId/activities/:activityId', deleteActivity);

export default router;
