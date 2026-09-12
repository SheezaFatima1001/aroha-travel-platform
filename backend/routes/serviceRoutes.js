import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from '../controllers/serviceController.js';

const router = express.Router();

router.get('/', getServices);
router.get('/:id', getServiceById);

router.post('/', protect, adminOnly, createService);
router.put('/:id', protect, adminOnly, updateService);
router.patch('/:id', protect, adminOnly, updateService);
router.delete('/:id', protect, adminOnly, deleteService);

export default router;