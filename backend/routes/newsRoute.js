import express from 'express';

const router = express.Router();

// @route   GET /api/news
// @desc    Get news articles
// @access  Public
router.get('/', async (req, res) => {
  try {
    // For now, return empty array
    res.json({
      success: true,
      data: { news: [] }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch news',
      error: error.message
    });
  }
});

export default router;
