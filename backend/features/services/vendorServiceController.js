import Service from './serviceModel.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

// @desc    Create a new service
// @route   POST /api/vendor/services
// @access  Vendor
export const createVendorService = asyncHandler(async (req, res) => {
  const { title, description, categories, priceRange, images } = req.body;

  if (
    !title ||
    !description ||
    !categories?.length ||
    !priceRange?.min ||
    !priceRange?.max
  ) {
    res.status(400);
    throw new Error('All fields are required');
  }

  const service = await Service.create({
    vendor: req.user._id,
    title,
    description,
    categories,
    priceRange,
    images: images || [],
  });

  res.status(201).json({
    success: true,
    message: 'Service listed successfully',
    data: { service },
  });
});

// @desc    Get all services
// @route   GET /api/vendor/services
// @access  Public
export const getAllServices = asyncHandler(async (req, res) => {
  const services = await Service.find({ isActive: true })
    .populate('vendor', 'name')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: { services },
  });
});
