import Appointment from './appointmentModel.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

// @desc    Get appointments for logged-in user (user site)
// @route   GET /api/appointments
// @access  Private
export const getUserAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ user: req.user._id })
    .populate('property', 'title location images')
    .sort({ date: -1 });

  res.json({
    success: true,
    data: { appointments },
  });
});

// @desc    Create appointment (user site)
// @route   POST /api/appointments
// @access  Private
export const createAppointment = asyncHandler(async (req, res) => {
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
});

// @desc    Get all appointments (admin panel)
// @route   GET /api/appointments/all
// @access  Private (Admin)
export const getAllAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({})
    .populate('property', 'title location images')
    .populate('user', 'name email')
    .sort({ date: -1 });

  res.json({
    success: true,
    appointments,
  });
});
