import express from 'express';
import {
  getDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination,
} from '../controllers/destinationController.js';

const router = express.Router();

router.route('/').get(getDestinations).post(createDestination);
router
  .route('/:id')
  .get(getDestinationById)
  .put(updateDestination)
  .patch(updateDestination)
  .delete(deleteDestination);

export default router;
