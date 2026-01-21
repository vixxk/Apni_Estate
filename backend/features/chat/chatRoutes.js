import express from 'express';
import { protect } from '../../middleware/authmiddleware.js';
import {
  sendMessage,
  getChatRoomMessages,
  getMyConversations,
  getSpecificChat,
} from './chatController.js';

const router = express.Router();

router.post('/', protect, sendMessage);
router.get('/room/:otherUserId', protect, getChatRoomMessages);
router.get('/my/conversations/list', protect, getMyConversations);
router.get('/:vendorId/:userId', protect, getSpecificChat);

export default router;
