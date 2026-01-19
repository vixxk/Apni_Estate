import express from "express";
import Testimonial from "../models/TestimonialModel.js";
import { protect } from "../middleware/authmiddleware.js";
import { appConfig as config } from "../config/config.js";

const router = express.Router();

const adminOnly = (req, res, next) => {
  const adminEmail = req.headers.email;
  const adminPassword = req.headers.password;

  if (
    adminEmail === config.ADMIN_EMAIL &&
    adminPassword === config.ADMIN_PASSWORD
  ) {
    next();
  } else {
    res.status(401).json({ success: false, message: "Unauthorized: Admin access only" });
  }
};

// @route   POST /api/testimonials
// @desc    Submit a new testimonial
// @access  Private (User must be logged in)
router.post("/", protect, async (req, res) => {
  try {
    const { text, rating } = req.body;

    if (!text || !rating) {
      return res.status(400).json({ success: false, message: "Please provide text and rating" });
    }

    // Optional: Check if user already submitted recently to prevent spam
    const existing = await Testimonial.findOne({ user: req.user._id, status: "pending" });
    if(existing) {
         return res.status(400).json({ success: false, message: "You already have a pending review. Please wait for approval." });
    }

    const testimonial = await Testimonial.create({
      user: req.user._id,
      text,
      rating,
    });

    res.status(201).json({
      success: true,
      message: "Testimonial submitted successfully! It will be visible after admin approval.",
      data: testimonial,
    });
  } catch (error) {
    console.error("Submit testimonial error:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
});

// @route   GET /api/testimonials/public
// @desc    Get all APPROVED testimonials for the home page
// @access  Public
router.get("/public", async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ status: "approved" })
      .populate("user", "name avatar location") 
      .sort({ createdAt: -1 })
      .limit(10); 

    // Transform data to match frontend expectation if needed, or handle on frontend
    // The frontend expects: { id, text, name, location, image, rating }
    const formatted = testimonials.map(t => ({
      _id: t._id,
      id: t._id, 
      text: t.text,
      name: t.user?.name || "Anonymous",
      location: "Verified User", 
      image: t.user?.avatar || null, 
      rating: t.rating
    }));

    res.json({ success: true, data: formatted });
  } catch (error) {
    console.error("Fetch public testimonials error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// ==============================================================================
// ADMIN ROUTES
// ==============================================================================

// @route   GET /api/testimonials/admin/all
// @desc    Get ALL testimonials (pending, approved, rejected)
// @access  Admin Protected
router.get("/admin/all", adminOnly, async (req, res) => {
  try {
    const testimonials = await Testimonial.find({})
      .populate("user", "name email avatar")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
});

// @route   PUT /api/testimonials/admin/:id/status
// @desc    Update status (approve/reject)
// @access  Admin Protected
router.put("/admin/:id/status", adminOnly, async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!testimonial) {
      return res.status(404).json({ success: false, message: "Testimonial not found" });
    }

    res.json({ success: true, message: `Testimonial ${status}`, data: testimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
});

// @route   DELETE /api/testimonials/admin/:id
// @desc    Delete a testimonial
// @access  Admin Protected
router.delete("/admin/:id", adminOnly, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: "Testimonial not found" });
    }
    res.json({ success: true, message: "Testimonial deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
});

export default router;
