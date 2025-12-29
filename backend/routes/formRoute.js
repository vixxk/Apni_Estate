import express from 'express';

const router = express.Router();

// @route   POST /api/forms
// @desc    Submit contact form
// @access  Public
router.post('/', async (req, res) => {
  try {
    // For now, just return success
    res.json({
      success: true,
      message: 'Form submitted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit form',
      error: error.message
    });
  }
});

export default router;
