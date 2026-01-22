import express from 'express';
import { protect } from '../../middleware/authmiddleware.js';
import { uploadAvatar } from '../../middleware/uploadMiddleware.js'; // Reuse existing 5MB limit
import { uploadChatImage } from './chatController.js';

const router = express.Router();

// Reuse uploadAvatar middleware (5MB limit) or create new one if needed
router.post('/chat-image', protect, uploadAvatar.single('image'), uploadChatImage);

export default router;
