import Property from './propertyModel.js';
import { uploadToImageKit } from '../../config/imagekit.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

// @desc    IMAGE UPLOAD ENDPOINT
// @route   POST /api/properties/upload-images
// @access  Vendor
export const uploadPropertyImagesController = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('No images uploaded');
  }

  const uploads = await Promise.all(
    req.files.map((file, idx) =>
      uploadToImageKit(file, 'properties').then((img) => ({
        url: img.url,
        fileId: img.fileId,
        alt: `Property image ${idx + 1}`,
        isPrimary: idx === 0,
      }))
    )
  );

  res.json({
    success: true,
    data: { images: uploads },
  });
});

// @desc    VENDOR ADD PROPERTY ENDPOINT (SUBMITS FOR ADMIN APPROVAL)
// @route   POST /api/properties/vendor-add
// @access  Vendor
export const createProperty = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    price,
    type,
    category,
    location,
    features,
    images,
    contactInfo,
    metadata,
    tags,
  } = req.body;

  if (!title || !description || !price || !type || !category || !images || images.length === 0) {
    res.status(400);
    throw new Error('Missing required fields: title, description, price, type, category, and images are required');
  }

  // Create property object matching schema
  const propertyData = {
    title: title.trim(),
    description: description.trim(),
    price: Number(price),
    type: type.toLowerCase(),
    category: category.toLowerCase(),
    location: {
      address: location?.address?.trim() || '',
      city: location?.city?.trim() || '',
      state: location?.state?.trim() || '',
      pincode: location?.pincode?.trim() || '',
      coordinates: {
        latitude: location?.coordinates?.latitude || null,
        longitude: location?.coordinates?.longitude || null,
      },
    },
    features: {
      bedrooms: features?.bedrooms ? Number(features.bedrooms) : 0,
      bathrooms: features?.bathrooms ? Number(features.bathrooms) : 0,
      area: features?.area ? Number(features.area) : null,
      floor: features?.floor ? Number(features.floor) : null,
      totalFloors: features?.totalFloors ? Number(features.totalFloors) : null,
      parking: features?.parking === true,
      furnished: features?.furnished || 'unfurnished',
      amenities: Array.isArray(features?.amenities) ? features.amenities : [],
    },
    images: images.map((img) => ({
      url: img.url,
      fileId: img.fileId || null,
      alt: img.alt || 'Property image',
      isPrimary: img.isPrimary || false,
    })),
    owner: req.user.id,
    contactInfo: {
      phone: contactInfo?.phone || '',
      email: contactInfo?.email || '',
      alternatePhone: contactInfo?.alternatePhone || '',
    },
    status: 'pending',
    metadata: {
      yearBuilt: metadata?.yearBuilt ? Number(metadata.yearBuilt) : null,
      propertyTax: metadata?.propertyTax ? Number(metadata.propertyTax) : null,
      maintenanceCharges: metadata?.maintenanceCharges
        ? Number(metadata.maintenanceCharges)
        : null,
      securityDeposit: metadata?.securityDeposit
        ? Number(metadata.securityDeposit)
        : null,
      noticePeriod: metadata?.noticePeriod || null,
    },
    tags: Array.isArray(tags) ? tags.map((t) => t.toLowerCase()) : [],
  };

  const newProperty = new Property(propertyData);
  const savedProperty = await newProperty.save();

  res.status(201).json({
    success: true,
    message: 'Listing submitted for admin review',
    data: savedProperty,
  });
});

// @desc    GET ALL PROPERTIES (with filters) - ONLY APPROVED PROPERTIES
// @route   GET /api/properties
// @access  Public
export const getProperties = asyncHandler(async (req, res) => {
  const {
    city,
    minPrice,
    maxPrice,
    type,
    category,
    furnished,
    search,
    owner,
    page = 1,
    limit = 12,
  } = req.query;

  // CHANGED: Only show approved properties to public
  let filter = { status: 'approved' };

  if (owner) {
    filter.owner = owner;
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { 'location.city': { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } },
    ];
  }

  if (city) filter['location.city'] = { $regex: city, $options: 'i' };
  if (type) filter.type = type.toLowerCase();
  if (category) filter.category = category.toLowerCase();
  if (furnished) filter['features.furnished'] = furnished.toLowerCase();

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const skip = (Number(page) - 1) * Number(limit);

  const properties = await Property.find(filter)
    .populate('owner', 'name email phone avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Property.countDocuments(filter);

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

// @desc    GET SINGLE PROPERTY
// @route   GET /api/properties/:id
// @access  Public
export const getPropertyById = asyncHandler(async (req, res) => {
  const property = await Property.findByIdAndUpdate(
    req.params.id,
    { $inc: { views: 1 } }, // Increment views
    { new: true }
  ).populate('owner', 'name email phone');

  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  res.json({
    success: true,
    data: property,
  });
});

// @desc    GET VENDOR'S PROPERTIES (ALL STATUSES)
// @route   GET /api/properties/vendor/my-properties
// @access  Vendor
export const getVendorProperties = asyncHandler(async (req, res) => {
  const properties = await Property.find({ owner: req.user.id }).sort({
    createdAt: -1,
  });

  res.json({
    success: true,
    data: properties,
  });
});

// @desc    UPDATE PROPERTY
// @route   PUT /api/properties/:id
// @access  Vendor
export const updateProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  // Check if vendor owns this property
  if (property.owner.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to update this property');
  }

  // Validate pincode if it's being updated
  if (req.body.location?.pincode) {
    if (!/^\d{6}$/.test(req.body.location.pincode)) {
      res.status(400);
      throw new Error('Invalid pincode format. Please enter a 6-digit pincode.');
    }
  }

  const updatedProperty = await Property.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('owner', 'name email phone');

  res.json({
    success: true,
    message: 'Property updated successfully',
    data: updatedProperty,
  });
});

// @desc    DELETE PROPERTY
// @route   DELETE /api/properties/:id
// @access  Vendor
export const deleteProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  // Check if vendor owns this property
  if (property.owner.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to delete this property');
  }

  await Property.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Property deleted successfully',
  });
});

// @desc    ADD PROPERTY TO FAVORITES (Update Property.favorites)
// @route   POST /api/properties/:id/favorite
// @access  Vendor/Users (Logged In)
export const togglePropertyFavorite = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  const userId = req.user.id;
  const isFavorited = property.favorites.includes(userId);

  if (isFavorited) {
    property.favorites = property.favorites.filter(
      (id) => id.toString() !== userId
    );
  } else {
    property.favorites.push(userId);
  }

  await property.save();

  res.json({
    success: true,
    message: isFavorited ? 'Removed from favorites' : 'Added to favorites',
    data: property,
  });
});

// @desc    GET NEARBY PROPERTIES
// @route   GET /api/properties/nearby/:id
// @access  Public
export const getNearbyProperties = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property || !property.location.coordinates.latitude) {
    res.status(400);
    throw new Error('Property or coordinates not found');
  }

  const radiusKm = req.query.radius || 10;
  const nearbyProperties = await Property.findNearby(
    property.location.coordinates.latitude,
    property.location.coordinates.longitude,
    radiusKm
  )
    .where('_id')
    .ne(req.params.id) // Exclude the current property
    .limit(6);

  res.json({
    success: true,
    data: nearbyProperties,
  });
});
