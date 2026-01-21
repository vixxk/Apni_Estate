import express from 'express';
import { protect } from '../../middleware/authmiddleware.js';
import {
  getUserAppointments,
  createAppointment,
  getAllAppointments,
} from './appointmentController.js';

const router = express.Router();

router.route('/').get(protect, getUserAppointments).post(protect, createAppointment);
router.get('/all', protect, getAllAppointments);

export default router;
