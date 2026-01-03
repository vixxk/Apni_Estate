import express from 'express';
import ContactRequest from '../models/ContactRequest.js';
import Property from '../models/propertymodel.js';
import User from '../models/Usermodel.js';
import { protect } from '../middleware/authmiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   POST /api/contact-requests/create
// @desc    Create a new contact request (property-specific or general)
// @access  Private
router.post('/create', async (req, res) => {
  try {
    const { propertyId, vendorId, message } = req.body;
    const userId = req.user._id;

    // Validate that either propertyId or vendorId is provided
    if (!propertyId && !vendorId) {
      return res.status(400).json({
        success: false,
        message: 'Either propertyId or vendorId must be provided'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    let property = null;
    let vendor = null;
    let contactType = 'general';
    let propertyInfo = {
      title: '',
      price: 0,
      type: '',
      location: ''
    };

    // Handle property-specific contact request
    if (propertyId) {
      property = await Property.findById(propertyId).populate('owner');
      if (!property) {
        return res.status(404).json({
          success: false,
          message: 'Property not found'
        });
      }

      // Check if property is approved
      if (property.status !== 'approved') {
        return res.status(400).json({
          success: false,
          message: 'This property is not available for contact'
        });
      }

      // Check if user is trying to contact their own property
      if (property.owner._id.toString() === userId.toString()) {
        return res.status(400).json({
          success: false,
          message: 'You cannot contact yourself for your own property'
        });
      }

      vendor = property.owner;
      contactType = 'property';
      propertyInfo = {
        title: property.title,
        price: property.price,
        type: property.type,
        location: property.location?.city || property.location?.address || 'Location not specified'
      };

      // Check for duplicate request (within last 24 hours)
      const existingRequest = await ContactRequest.findOne({
        property: propertyId,
        user: userId,
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      });

      if (existingRequest) {
        return res.status(400).json({
          success: false,
          message: 'You have already sent a contact request for this property in the last 24 hours',
          data: existingRequest
        });
      }
    } 
    // Handle general contact request to vendor
    else if (vendorId) {
      vendor = await User.findById(vendorId);
      if (!vendor) {
        return res.status(404).json({
          success: false,
          message: 'Vendor not found'
        });
      }

      // Check if user is trying to contact themselves
      if (vendorId.toString() === userId.toString()) {
        return res.status(400).json({
          success: false,
          message: 'You cannot contact yourself'
        });
      }

      // Check for duplicate general request (within last 24 hours)
      const existingRequest = await ContactRequest.findOne({
        vendor: vendorId,
        user: userId,
        property: null,
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      });

      if (existingRequest) {
        return res.status(400).json({
          success: false,
          message: 'You have already sent a contact request to this vendor in the last 24 hours',
          data: existingRequest
        });
      }
    }

    const contactRequest = await ContactRequest.create({
      property: propertyId || null,
      user: userId,
      vendor: vendor._id,
      userInfo: {
        name: user.name || user.username,
        email: user.email,
        phone: user.phone || user.contactNumber || 'Not provided'
      },
      propertyInfo,
      contactType,
      message: message || (propertyId 
        ? 'I am interested in this property. Please contact me.'
        : 'I am interested in your services. Please contact me.')
    });

    const populateOptions = [
      { path: 'user', select: 'name email phone username' },
      { path: 'vendor', select: 'name email phone username' }
    ];

    if (propertyId) {
      populateOptions.push({ path: 'property', select: 'title price type location images' });
    }

    await contactRequest.populate(populateOptions);

    res.status(201).json({
      success: true,
      message: 'Contact request sent successfully. The vendor will reach out to you soon.',
      data: contactRequest
    });
  } catch (error) {
    console.error('Error creating contact request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send contact request',
      error: error.message
    });
  }
});

// @route   GET /api/contact-requests/my-requests
// @desc    Get contact requests made by the logged-in user
// @access  Private
router.get('/my-requests', async (req, res) => {
  try {
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
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching user contact requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact requests',
      error: error.message
    });
  }
});

// @route   GET /api/contact-requests/vendor/requests
// @desc    Get all contact requests for the logged-in vendor
// @access  Private (vendors)
router.get('/vendor/requests', async (req, res) => {
  try {
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
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching vendor contact requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact requests',
      error: error.message
    });
  }
});

// @route   GET /api/contact-requests/vendor/stats
// @desc    Get contact request statistics for vendor
// @access  Private (vendors)
router.get('/vendor/stats', async (req, res) => {
  try {
    const vendorId = req.user._id;

    const stats = await ContactRequest.aggregate([
      { $match: { vendor: vendorId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const typeStats = await ContactRequest.aggregate([
      { $match: { vendor: vendorId } },
      {
        $group: {
          _id: '$contactType',
          count: { $sum: 1 }
        }
      }
    ]);

    const total = await ContactRequest.countDocuments({ vendor: vendorId });
    const thisMonth = await ContactRequest.countDocuments({
      vendor: vendorId,
      createdAt: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      }
    });

    const formattedStats = {
      total,
      thisMonth,
      byStatus: stats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, { pending: 0, contacted: 0, closed: 0 }),
      byType: typeStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, { property: 0, general: 0 })
    };

    res.status(200).json({
      success: true,
      data: formattedStats
    });
  } catch (error) {
    console.error('Error fetching vendor contact stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact statistics',
      error: error.message
    });
  }
});

// @route   PATCH /api/contact-requests/vendor/:id
// @desc    Update contact request status (vendor only)
// @access  Private (vendors)
router.patch('/vendor/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, vendorNotes } = req.body;
    const vendorId = req.user._id;

    const contactRequest = await ContactRequest.findById(id);
    if (!contactRequest) {
      return res.status(404).json({
        success: false,
        message: 'Contact request not found'
      });
    }

    if (contactRequest.vendor.toString() !== vendorId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this contact request'
      });
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
      { path: 'user', select: 'name email phone username' }
    ];

    if (contactRequest.property) {
      populateOptions.push({ path: 'property', select: 'title price type location images' });
    }

    await contactRequest.populate(populateOptions);

    res.status(200).json({
      success: true,
      message: 'Contact request updated successfully',
      data: contactRequest
    });
  } catch (error) {
    console.error('Error updating contact request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact request',
      error: error.message
    });
  }
});

export default router;
