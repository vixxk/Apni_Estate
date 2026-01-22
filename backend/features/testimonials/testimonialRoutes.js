import express from 'express';
import { protect } from '../../middleware/authmiddleware.js';
import { adminOnly } from '../admin/adminMiddleware.js';
import {
  submitTestimonial,
  getPublicTestimonials,
  getAllTestimonialsAdmin,
  updateTestimonialStatus,
  deleteTestimonial,
} from './testimonialController.js';

const router = express.Router();

router.post('/', protect, submitTestimonial);
router.get('/public', getPublicTestimonials);

// ADMIN ROUTES
router.get('/admin/all', adminOnly, getAllTestimonialsAdmin);
router.put('/admin/:id/status', adminOnly, updateTestimonialStatus);
router.delete('/admin/:id', adminOnly, deleteTestimonial);

export default router;
