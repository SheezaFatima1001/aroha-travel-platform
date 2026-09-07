import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getDestinationRecommendations, getServiceRecommendations } from '../controllers/recommendationController.js';

const router = express.Router();

router.use(protect);

router.get('/destinations', getDestinationRecommendations);
router.get('/services', getServiceRecommendations);

export default router;