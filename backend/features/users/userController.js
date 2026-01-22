import User from './userModel.js';
import Property from '../properties/propertyModel.js';
import { uploadToImageKit } from '../../config/imagekit.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

// @desc    Get current user (basic)
// @route   GET /api/users/me
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({
    success: true,
    data: {
      user: {
        ...user.toJSON(),
        avatar: user.avatar,
      },
    },
  });
});

// @desc    Update current user profile
// @route   PUT /api/users/me
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Update only provided fields
  if (name !== undefined) user.name = name;
  if (phone !== undefined) user.phone = phone;

  const updatedUser = await user.save();

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
      },
    },
  });
});

// @desc    Upload profile avatar
// @route   POST /api/users/avatar
// @access  Private
export const uploadUserAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No image file provided');
  }

  const uploadResult = await uploadToImageKit(req.file, 'avatars');
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.avatar = uploadResult.url;
  await user.save();

  res.json({
    success: true,
    message: 'Avatar uploaded successfully',
    data: {
      avatar: uploadResult.url,
    },
  });
});

// @desc    Remove profile avatar
// @route   DELETE /api/users/avatar
// @access  Private
export const deleteUserAvatar = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.avatar = null;
  await user.save();

  res.json({
    success: true,
    message: 'Avatar removed successfully',
  });
});

// @desc    Get vendor public profile
// @route   GET /api/users/vendor/:id
// @access  Public
export const getVendorPublicProfile = asyncHandler(async (req, res) => {
  const vendor = await User.findById(req.params.id).select(
    'name email phone avatar role createdAt'
  );

  if (!vendor) {
    res.status(404);
    throw new Error('Vendor not found');
  }

  if (vendor.role !== 'vendor') {
    res.status(403);
    throw new Error('This user is not a vendor');
  }

  res.json({
    success: true,
    data: vendor,
  });
});

// @desc    Get detailed profile with saved count
// @route   GET /api/users/profile
// @access  Private
export const getDetailedProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    'savedProperties',
    'title price location type status'
  );

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        savedCount: user.savedProperties?.length || 0,
      },
    },
  });
});

// @desc    Get any user's public profile
// @route   GET /api/users/public/:id
// @access  Public
export const getPublicProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select(
    'name email phone avatar role createdAt'
  );

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({
    success: true,
    data: user,
  });
});

// @desc    Get saved/favourite properties
// @route   GET /api/users/saved
// @access  Private
export const getSavedProperties = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'savedProperties',
    select: 'title price location type status images createdAt owner',
    populate: {
      path: 'owner',
      select: 'name avatar role'
    }
  });

  const properties = user?.savedProperties || [];

  res.json({
    success: true,
    data: { properties },
  });
});

// @desc    Toggle save/unsave property
// @route   POST /api/users/saved/toggle
// @access  Private
export const toggleSavedProperty = asyncHandler(async (req, res) => {
  const { propertyId } = req.body;

  const property = await Property.findById(propertyId);
  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  const user = await User.findById(req.user._id);
  const idx = user.savedProperties.findIndex(
    (id) => id.toString() === propertyId
  );

  let action;
  if (idx === -1) {
    user.savedProperties.push(propertyId);
    action = 'saved';
  } else {
    user.savedProperties.splice(idx, 1);
    action = 'removed';
  }

  await user.save();

  res.json({
    success: true,
    message: `Property ${action} successfully`,
    data: {
      savedProperties: user.savedProperties,
    },
  });
});
