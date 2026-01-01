import express from 'express';
import Appointment from '../models/appointmentModel.js';
import { protect } from '../middleware/authmiddleware.js';
// import { isAdmin } from '../middleware/adminMiddleware.js'; // add admin auth later

const router = express.Router();

// @route   GET /api/appointments
// @desc    Get appointments for logged-in user (user site)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id })
      .populate('property', 'title location images')
      .sort({ date: -1 });

    res.json({
      success: true,
      data: { appointments },
    });
  } catch (error) {
    console.error('Error in GET /api/appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments',
      error: error.message,
    });
  }
});

// @route   GET /api/appointments/all
// @desc    Get all appointments (admin panel)
// @access  Private (ideally admin)
router.get('/all', protect, async (req, res) => {
  try {
    // If needed, enforce admin here
    // if (!req.user.isAdmin) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Not authorized as admin',
    //   });
    // }

    const appointments = await Appointment.find({})
      .populate('property', 'title location images')
      .populate('user', 'name email')
      .sort({ date: -1 });

    res.json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error('Error in GET /api/appointments/all:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments',
      error: error.message,
    });
  }
});

// @route   POST /api/appointments
// @desc    Create appointment (user site)
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const appointmentData = {
      ...req.body,
      user: req.user._id,
    };

    const appointment = await Appointment.create(appointmentData);

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: { appointment },
    });
  } catch (error) {
    console.error('Error in POST /api/appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create appointment',
      error: error.message,
    });
  }
});

export default router;
