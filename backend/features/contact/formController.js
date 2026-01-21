import { validationResult } from 'express-validator';
import ContactForm from './formModel.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

// @desc    Submit contact form
// @route   POST /api/forms
// @access  Public
export const submitContactForm = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }

  const { name, email, phone, message } = req.body;

  const contactForm = new ContactForm({
    name,
    email,
    phone: phone || null,
    message,
  });

  await contactForm.save();

  res.status(201).json({
    success: true,
    message: 'Form submitted successfully',
    data: {
      id: contactForm._id,
      createdAt: contactForm.createdAt,
    },
  });
});

// @desc    Get all contact form submissions (admin only)
// @route   GET /api/forms
// @access  Private (Admin)
export const getContactForms = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const forms = await ContactForm.find()
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

  const count = await ContactForm.countDocuments();

  res.json({
    success: true,
    count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    data: forms,
  });
});

// @desc    Delete a contact form submission
// @route   DELETE /api/forms/:id
// @access  Private (Admin)
export const deleteContactForm = asyncHandler(async (req, res) => {
  const form = await ContactForm.findByIdAndDelete(req.params.id);

  if (!form) {
    res.status(404);
    throw new Error('Contact form not found');
  }

  res.json({
    success: true,
    message: 'Contact form deleted successfully',
  });
});
