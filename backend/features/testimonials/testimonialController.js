import Testimonial from './testimonialModel.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

// @desc    Submit a new testimonial
// @route   POST /api/testimonials
// @access  Private
export const submitTestimonial = asyncHandler(async (req, res) => {
  const { text, rating } = req.body;

  if (!text || !rating) {
    res.status(400);
    throw new Error('Please provide text and rating');
  }

  // Optional: Check if user already submitted recently to prevent spam
  const existing = await Testimonial.findOne({
    user: req.user._id,
    status: 'pending',
  });
  if (existing) {
    res.status(400);
    throw new Error(
      'You already have a pending review. Please wait for approval.'
    );
  }

  const testimonial = await Testimonial.create({
    user: req.user._id,
    text,
    rating,
  });

  res.status(201).json({
    success: true,
    message:
      'Testimonial submitted successfully! It will be visible after admin approval.',
    data: testimonial,
  });
});

// @desc    Get all APPROVED testimonials for the home page
// @route   GET /api/testimonials/public
// @access  Public
export const getPublicTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find({ status: 'approved' })
    .populate('user', 'name avatar location')
    .sort({ createdAt: -1 })
    .limit(10);

  // Transform data
  const formatted = testimonials.map((t) => ({
    _id: t._id,
    id: t._id,
    text: t.text,
    name: t.user?.name || 'Anonymous',
    location: 'Verified User',
    image: t.user?.avatar || null,
    rating: t.rating,
  }));

  res.json({ success: true, data: formatted });
});

// @desc    Get ALL testimonials (pending, approved, rejected)
// @route   GET /api/testimonials/admin/all
// @access  Admin Protected
export const getAllTestimonialsAdmin = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find({})
    .populate('user', 'name email avatar')
    .sort({ createdAt: -1 });

  res.json({ success: true, data: testimonials });
});

// @desc    Update status (approve/reject)
// @route   PUT /api/testimonials/admin/:id/status
// @access  Admin Protected
export const updateTestimonialStatus = asyncHandler(async (req, res) => {
  const { status } = req.body; // 'approved' or 'rejected'
  if (!['approved', 'rejected', 'pending'].includes(status)) {
    res.status(400);
    throw new Error('Invalid status');
  }

  const testimonial = await Testimonial.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  if (!testimonial) {
    res.status(404);
    throw new Error('Testimonial not found');
  }

  res.json({
    success: true,
    message: `Testimonial ${status}`,
    data: testimonial,
  });
});

// @desc    Delete a testimonial
// @route   DELETE /api/testimonials/admin/:id
// @access  Admin Protected
export const deleteTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
  if (!testimonial) {
    res.status(404);
    throw new Error('Testimonial not found');
  }
  res.json({ success: true, message: 'Testimonial deleted' });
});
