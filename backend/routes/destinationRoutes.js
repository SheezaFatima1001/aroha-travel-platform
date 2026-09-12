import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import {
  getDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination,
} from '../controllers/destinationController.js';

const router = express.Router();

// Public read access
router.get('/', getDestinations);
router.get('/:id', getDestinationById);

// Admin-only write access
router.post('/', protect, adminOnly, createDestination);
router.put('/:id', protect, adminOnly, updateDestination);
router.patch('/:id', protect, adminOnly, updateDestination);
router.delete('/:id', protect, adminOnly, deleteDestination);

export default router;