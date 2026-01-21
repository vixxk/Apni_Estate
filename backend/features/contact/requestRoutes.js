import express from 'express';
import { protect } from '../../middleware/authmiddleware.js';
import {
  createContactRequest,
  getMyRequests,
  getVendorRequests,
  getVendorStats,
  updateContactRequest,
} from './contactRequestController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.post('/create', createContactRequest);
router.get('/my-requests', getMyRequests);
router.get('/vendor/requests', getVendorRequests);
router.get('/vendor/stats', getVendorStats);
router.patch('/vendor/:id', updateContactRequest);

export default router;
