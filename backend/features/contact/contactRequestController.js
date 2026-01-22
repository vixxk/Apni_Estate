import ContactRequest from './requestModel.js';
import Property from '../properties/propertyModel.js';
import User from '../users/userModel.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

// @desc    Create a new contact request (property-specific or general)
// @route   POST /api/contact-requests/create
// @access  Private
export const createContactRequest = asyncHandler(async (req, res) => {
  const { propertyId, vendorId, message } = req.body;
  const userId = req.user._id;

  // Validate that either propertyId or vendorId is provided
  if (!propertyId && !vendorId) {
    res.status(400);
    throw new Error('Either propertyId or vendorId must be provided');
  }

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  let property = null;
  let vendor = null;
  let contactType = 'general';
  let propertyInfo = {
    title: '',
    price: 0,
    type: '',
    location: '',
  };

  // Handle property-specific contact request
  if (propertyId) {
    property = await Property.findById(propertyId).populate('owner');
    if (!property) {
      res.status(404);
      throw new Error('Property not found');
    }

    // Check if property is approved
    if (property.status !== 'approved') {
      res.status(400);
      throw new Error('This property is not available for contact');
    }

    // Check if user is trying to contact their own property
    if (property.owner._id.toString() === userId.toString()) {
      res.status(400);
      throw new Error('You cannot contact yourself for your own property');
    }

    vendor = property.owner;
    contactType = 'property';
    propertyInfo = {
      title: property.title,
      price: property.price,
      type: property.type,
      location:
        property.location?.city ||
        property.location?.address ||
        'Location not specified',
    };

    // Check for duplicate request (within last 24 hours)
    const existingRequest = await ContactRequest.findOne({
      property: propertyId,
      user: userId,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    if (existingRequest) {
      res.status(400).json({
        success: false,
        message:
          'You have already sent a contact request for this property in the last 24 hours',
        data: existingRequest,
      });
      return;
    }
  }
  // Handle general contact request to vendor
  else if (vendorId) {
    vendor = await User.findById(vendorId);
    if (!vendor) {
      res.status(404);
      throw new Error('Vendor not found');
    }

    // Check if user is trying to contact themselves
    if (vendorId.toString() === userId.toString()) {
      res.status(400);
      throw new Error('You cannot contact yourself');
    }

    // Check for duplicate general request (within last 24 hours)
    const existingRequest = await ContactRequest.findOne({
      vendor: vendorId,
      user: userId,
      property: null,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    if (existingRequest) {
      res.status(400).json({
        success: false,
        message:
          'You have already sent a contact request to this vendor in the last 24 hours',
        data: existingRequest,
      });
      return;
    }
  }

  const contactRequest = await ContactRequest.create({
    property: propertyId || null,
    user: userId,
    vendor: vendor._id,
    userInfo: {
      name: user.name || user.username,
      email: user.email,
      phone: user.phone || user.contactNumber || 'Not provided',
    },
    propertyInfo,
    contactType,
    message:
      message ||
      (propertyId
        ? 'I am interested in this property. Please contact me.'
        : 'I am interested in your services. Please contact me.'),
  });

  const populateOptions = [
    { path: 'user', select: 'name email phone username' },
    { path: 'vendor', select: 'name email phone username' },
  ];

  if (propertyId) {
    populateOptions.push({
      path: 'property',
      select: 'title price type location images',
    });
  }

  await contactRequest.populate(populateOptions);

  res.status(201).json({
    success: true,
    message:
      'Contact request sent successfully. The vendor will reach out to you soon.',
    data: contactRequest,
  });
});

// @desc    Get contact requests made by the logged-in user
// @route   GET /api/contact-requests/my-requests
// @access  Private
export const getMyRequests = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { page = 1, limit = 20, type } = req.query;

  const query = { user: userId };
  if (type) {
    query.contactType = type;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const contactRequests = await ContactRequest.find(query)
    .populate('property', 'title price type location images')
    .populate('vendor', 'name email phone username')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await ContactRequest.countDocuments(query);

  res.status(200).json({
    success: true,
    data: contactRequests,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      limit: parseInt(limit),
    },
  });
});

// @desc    Get all contact requests for the logged-in vendor
// @route   GET /api/contact-requests/vendor/requests
// @access  Private (vendors)
export const getVendorRequests = asyncHandler(async (req, res) => {
  const vendorId = req.user._id;
  const { status, type, page = 1, limit = 20 } = req.query;

  const query = { vendor: vendorId };
  if (status) {
    query.status = status;
  }
  if (type) {
    query.contactType = type;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const contactRequests = await ContactRequest.find(query)
    .populate('property', 'title price type location images')
    .populate('user', 'name email phone username')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await ContactRequest.countDocuments(query);

  res.status(200).json({
    success: true,
    data: contactRequests,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      limit: parseInt(limit),
    },
  });
});

// @desc    Get contact request statistics for vendor
// @route   GET /api/contact-requests/vendor/stats
// @access  Private (vendors)
export const getVendorStats = asyncHandler(async (req, res) => {
  const vendorId = req.user._id;

  const stats = await ContactRequest.aggregate([
    { $match: { vendor: vendorId } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const typeStats = await ContactRequest.aggregate([
    { $match: { vendor: vendorId } },
    {
      $group: {
        _id: '$contactType',
        count: { $sum: 1 },
      },
    },
  ]);

  const total = await ContactRequest.countDocuments({ vendor: vendorId });
  const thisMonth = await ContactRequest.countDocuments({
    vendor: vendorId,
    createdAt: {
      $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    },
  });

  const formattedStats = {
    total,
    thisMonth,
    byStatus: stats.reduce(
      (acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      },
      { pending: 0, contacted: 0, closed: 0 }
    ),
    byType: typeStats.reduce(
      (acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      },
      { property: 0, general: 0 }
    ),
  };

  res.status(200).json({
    success: true,
    data: formattedStats,
  });
});

// @desc    Update contact request status (vendor only)
// @route   PATCH /api/contact-requests/vendor/:id
// @access  Private (vendors)
export const updateContactRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, vendorNotes } = req.body;
  const vendorId = req.user._id;

  const contactRequest = await ContactRequest.findById(id);
  if (!contactRequest) {
    res.status(404);
    throw new Error('Contact request not found');
  }

  if (contactRequest.vendor.toString() !== vendorId.toString()) {
    res.status(403);
    throw new Error('You are not authorized to update this contact request');
  }

  if (status) {
    contactRequest.status = status;
    if (status === 'contacted' && !contactRequest.contactedAt) {
      contactRequest.contactedAt = new Date();
    }
  }

  if (vendorNotes !== undefined) {
    contactRequest.vendorNotes = vendorNotes;
  }

  await contactRequest.save();

  const populateOptions = [
    { path: 'user', select: 'name email phone username' },
  ];

  if (contactRequest.property) {
    populateOptions.push({
      path: 'property',
      select: 'title price type location images',
    });
  }

  await contactRequest.populate(populateOptions);

  res.status(200).json({
    success: true,
    message: 'Contact request updated successfully',
    data: contactRequest,
  });
});
