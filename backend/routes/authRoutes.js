import express from 'express';
import {
  register,
  login,
  logout,
  getCurrentTeacher,
  updateProfile,
  changePassword
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.use(protect);
router.get('/me', getCurrentTeacher);
router.post('/logout', logout);
router.put('/update-profile', updateProfile);
router.put('/change-password', changePassword);

export default router;