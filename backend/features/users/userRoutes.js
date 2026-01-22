import express from 'express';
import { protect } from '../../middleware/authmiddleware.js';
import { uploadAvatar } from '../../middleware/uploadMiddleware.js';
import {
  registerUser,
  loginUser,
  adminLogin,
  forgotPassword,
  resetPassword,
} from './authController.js';
import {
  getUserProfile,
  updateUserProfile,
  uploadUserAvatar,
  deleteUserAvatar,
  getVendorPublicProfile,
  getDetailedProfile,
  getPublicProfile,
  getSavedProperties,
  toggleSavedProperty,
} from './userController.js';

const router = express.Router();

// Auth Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/admin', adminLogin);
router.post('/forgot', forgotPassword);
router.post('/reset/:token', resetPassword);

// User Profile Routes
router.route('/me')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route('/avatar')
  .post(protect, uploadAvatar.single('avatar'), uploadUserAvatar)
  .delete(protect, deleteUserAvatar);

router.get('/profile', protect, getDetailedProfile);
router.get('/public/:id', getPublicProfile);

// Vendor Route
router.get('/vendor/:id', getVendorPublicProfile);

// Saved Properties Routes
router.get('/saved', protect, getSavedProperties);
router.post('/saved/toggle', protect, toggleSavedProperty);

export default router;
