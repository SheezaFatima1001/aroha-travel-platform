import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { getAdminStats, getAllUsers, updateUserRole, deleteUser } from '../controllers/adminController.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

export default router;