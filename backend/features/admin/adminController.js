import Property from '../properties/propertyModel.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

// @desc    ADMIN LOGIN
// @route   POST /api/admin/login
// @access  Public
export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  // Check against environment variables
  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    res.json({
      success: true,
      message: 'Admin login successful',
      data: {
        email: process.env.ADMIN_EMAIL,
        role: 'admin',
        token: 'admin-authenticated',
      },
    });
  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
});

// @desc    GET ALL PENDING PROPERTIES
// @route   GET /api/admin/properties/pending
// @access  Admin only
export const getPendingProperties = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const properties = await Property.find({ status: 'pending' })
    .populate('owner', 'name email phone avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Property.countDocuments({ status: 'pending' });

  res.json({
    success: true,
    data: properties,
    pagination: {
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      limit: Number(limit),
    },
  });
});

// @desc    GET ALL PROPERTIES (ALL STATUSES)
// @route   GET /api/admin/properties/all
// @access  Admin only
export const getAllProperties = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  let filter = {};
  if (status) {
    filter.status = status;
  }

  const properties = await Property.find(filter)
    .populate('owner', 'name email phone avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Property.countDocuments(filter);

  // Get counts for each status
  const statusCounts = await Property.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  res.json({
    success: true,
    data: properties,
    statusCounts: statusCounts.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {}),
    pagination: {
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      limit: Number(limit),
    },
  });
});

// @desc    GET SINGLE PROPERTY (ADMIN VIEW)
// @route   GET /api/admin/properties/:id
// @access  Admin only
export const getPropertyById = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id).populate(
    'owner',
    'name email phone avatar'
  );

  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  res.json({
    success: true,
    data: property,
  });
});

// @desc    APPROVE A PROPERTY
// @route   PUT /api/admin/properties/:id/approve
// @access  Admin only
export const approveProperty = asyncHandler(async (req, res) => {
  const { notes } = req.body;

  const property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  if (property.status !== 'pending') {
    res.status(400);
    throw new Error(`Property is already ${property.status}`);
  }

  property.status = 'approved';
  property.adminReview = {
    reviewedBy: req.admin.email,
    reviewedAt: new Date(),
    notes: notes || '',
    rejectionReason: null,
  };

  await property.save();

  await property.populate('owner', 'name email phone avatar');

  res.json({
    success: true,
    message: 'Property approved successfully',
    data: property,
  });
});

// @desc    REJECT A PROPERTY
// @route   PUT /api/admin/properties/:id/reject
// @access  Admin only
export const rejectProperty = asyncHandler(async (req, res) => {
  const { reason, notes } = req.body;

  if (!reason) {
    res.status(400);
    throw new Error('Rejection reason is required');
  }

  const property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  if (property.status !== 'pending') {
    res.status(400);
    throw new Error(`Property is already ${property.status}`);
  }

  property.status = 'rejected';
  property.adminReview = {
    reviewedBy: req.admin.email,
    reviewedAt: new Date(),
    rejectionReason: reason,
    notes: notes || '',
  };

  await property.save();

  // Populate owner data before sending response
  await property.populate('owner', 'name email phone avatar');

  res.json({
    success: true,
    message: 'Property rejected',
    data: property,
  });
});

// @desc    DELETE A PROPERTY (ADMIN)
// @route   DELETE /api/admin/properties/:id
// @access  Admin only
export const deleteProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  await Property.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Property deleted successfully',
  });
});

// @desc    GET ADMIN DASHBOARD STATS
// @route   GET /api/admin/stats
// @access  Admin only
export const getAdminStats = asyncHandler(async (req, res) => {
  const totalProperties = await Property.countDocuments();
  const pendingProperties = await Property.countDocuments({
    status: 'pending',
  });
  const approvedProperties = await Property.countDocuments({
    status: 'approved',
  });
  const rejectedProperties = await Property.countDocuments({
    status: 'rejected',
  });

  // Recent submissions (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentSubmissions = await Property.countDocuments({
    createdAt: { $gte: sevenDaysAgo },
  });

  // Today's submissions
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todaySubmissions = await Property.countDocuments({
    createdAt: { $gte: todayStart },
  });

  res.json({
    success: true,
    data: {
      totalProperties,
      pendingProperties,
      approvedProperties,
      rejectedProperties,
      recentSubmissions,
      todaySubmissions,
    },
  });
});
