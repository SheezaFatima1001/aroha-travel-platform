import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getProfile,
  updateProfile,
  addFavorite,
  removeFavorite,
  getFavorites,
  addRecentlyViewed,
  getDashboard,
  getPreferences,
  updatePreferences,
} from '../controllers/userController.js';

const router = express.Router();

router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/dashboard', getDashboard);

router.get('/preferences', getPreferences);
router.put('/preferences', updatePreferences);

router.get('/favorites', getFavorites);
router.post('/favorites/:destinationId', addFavorite);
router.delete('/favorites/:destinationId', removeFavorite);

router.post('/recently-viewed/:destinationId', addRecentlyViewed);

export default router;