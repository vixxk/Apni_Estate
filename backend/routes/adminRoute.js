import express from "express";
import User from "../models/Usermodel.js";
import Property from "../models/propertymodel.js";
import Appointment from "../models/appointmentModel.js";
import { protect, authorize } from "../middleware/authmiddleware.js";

const router = express.Router();

// @route   GET /api/admin/stats
// @desc    Get dashboard statistics
// @access  Private (admin)
router.get("/stats", protect, authorize("admin"), async (req, res) => {
  try {
    // use ONE property collection everywhere: Property model
    const [
      totalProperties,
      activeListings,
      pendingAppointments,
      userCount,
      appointmentCount,
    ] = await Promise.all([
      Property.countDocuments({}),                 // all properties
      Property.countDocuments({ status: "active" }), // or "available" if that's your field
      Appointment.countDocuments({ status: "pending" }),
      User.countDocuments({ role: "user" }),
      Appointment.countDocuments(),
    ]);

    res.json({
      success: true,
      data: {
        totalProperties,
        activeListings,
        totalViews: 0, // update later when you track views
        pendingAppointments,
        stats: {
          users: userCount,
          properties: totalProperties,
          appointments: appointmentCount,
        },
      },
    });
  } catch (error) {
    console.error("Error in GET /api/admin/stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard stats",
      error: error.message,
    });
  }
});

export default router;
