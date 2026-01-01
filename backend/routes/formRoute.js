import express from 'express';
import { body, validationResult } from 'express-validator';
import ContactForm from '../models/ContactForm.js';

const router = express.Router();

// @route   POST /api/forms
// @desc    Submit contact form
// @access  Public
router.post(
  '/',
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('phone')
      .optional()
      .trim()
      .matches(/^[0-9+\-\s()]*$/)
      .withMessage('Please provide a valid phone number'),
    body('message')
      .trim()
      .notEmpty()
      .withMessage('Message is required')
      .isLength({ min: 10, max: 1000 })
      .withMessage('Message must be between 10 and 1000 characters')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { name, email, phone, message } = req.body;

      const contactForm = new ContactForm({
        name,
        email,
        phone: phone || null,
        message
      });

      await contactForm.save();

      // Optional: Send email notification
      // await sendEmailNotification({ name, email, phone, message });

      res.status(201).json({
        success: true,
        message: 'Form submitted successfully',
        data: {
          id: contactForm._id,
          createdAt: contactForm.createdAt
        }
      });
    } catch (error) {
      console.error('Contact form error:', error);

      // Handle Mongoose validation errors
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }));

        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validationErrors
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to submit form',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

// @route   GET /api/forms
// @desc    Get all contact form submissions (admin only)
// @access  Private
router.get('/', async (req, res) => {
  try {
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
      data: forms
    });
  } catch (error) {
    console.error('Fetch forms error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch forms',
      error: error.message
    });
  }
});

// @route   DELETE /api/forms/:id
// @desc    Delete a contact form submission
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const form = await ContactForm.findByIdAndDelete(req.params.id);

    if (!form) {
      return res.status(404).json({
        success: false,
        message: 'Contact form not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact form deleted successfully'
    });
  } catch (error) {
    console.error('Delete form error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete form',
      error: error.message
    });
  }
});

export default router;
