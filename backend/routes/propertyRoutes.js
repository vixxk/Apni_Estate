import express from "express";
import multer from "multer";
import { protect, authorize } from "../middleware/authmiddleware.js";
import { uploadToImageKit } from "../config/imagekit.js";
import Property from "../models/propertymodel.js";

const router = express.Router();

// Multer memory storage (required for ImageKit)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 5 }, // 10MB per file, max 5 files
});

// ============================================
// IMAGE UPLOAD ENDPOINT
// ============================================

// POST /api/properties/upload-images
router.post(
  "/upload-images",
  protect,
  authorize("vendor"),
  upload.array("images", 5),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No images uploaded",
        });
      }

      const uploads = await Promise.all(
        req.files.map((file, idx) =>
          uploadToImageKit(file, "properties").then((img) => ({
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
    } catch (error) {
      console.error("Property image upload error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to upload images",
        error: error.message,
      });
    }
  }
);

// ============================================
// VENDOR ADD PROPERTY ENDPOINT
// ============================================

// POST /api/properties/vendor-add
// POST /api/properties/vendor-add
router.post("/vendor-add", protect, authorize("vendor"), async (req, res) => {
  try {
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

    // Basic validation
    if (!title || !description || !price || !type || !category || !images || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: title, description, price, type, category, and images are required",
      });
    }

    // Create property object matching schema
    const propertyData = {
      title: title.trim(),
      description: description.trim(),
      price: Number(price),
      type: type.toLowerCase(),
      category: category.toLowerCase(),
      location: {
        address: location?.address?.trim() || "",
        city: location?.city?.trim() || "",
        state: location?.state?.trim() || "",
        pincode: location?.pincode?.trim() || "",
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
        furnished: features?.furnished || "unfurnished",
        amenities: Array.isArray(features?.amenities) ? features.amenities : [],
      },
      images: images.map((img) => ({
        url: img.url,
        fileId: img.fileId || null,
        alt: img.alt || "Property image",
        isPrimary: img.isPrimary || false,
      })),
      owner: req.user.id,
      contactInfo: {
        phone: contactInfo?.phone || "",
        email: contactInfo?.email || "",
        alternatePhone: contactInfo?.alternatePhone || "",
      },
      status: "available",
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

    // Create property
    const newProperty = new Property(propertyData);
    const savedProperty = await newProperty.save();

    res.status(201).json({
      success: true,
      message: "Listing created successfully",
      data: savedProperty,
    });
  } catch (error) {
    console.error("Property creation error:", error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create listing",
      error: error.message,
    });
  }
});


// ============================================
// GET ALL PROPERTIES (with filters)
// ============================================

// GET /api/properties
// GET /api/properties
router.get("/", async (req, res) => {
  try {
    const {
      city,
      minPrice,
      maxPrice,
      type,
      category,
      furnished,
      search,
      owner, // NEW: filter by owner
      page = 1,
      limit = 12,
    } = req.query;

    let filter = { status: "available" };

    // NEW: Filter by owner
    if (owner) {
      filter.owner = owner;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { "location.city": { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    if (city) filter["location.city"] = { $regex: city, $options: "i" };
    if (type) filter.type = type.toLowerCase();
    if (category) filter.category = category.toLowerCase();
    if (furnished) filter["features.furnished"] = furnished.toLowerCase();

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const properties = await Property.find(filter)
      .populate("owner", "name email phone avatar") // Include avatar
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch properties",
      error: error.message,
    });
  }
});


// ============================================
// GET SINGLE PROPERTY
// ============================================

// GET /api/properties/:id
router.get("/:id", async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } }, // Increment views
      { new: true }
    ).populate("owner", "name email phone");

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    res.json({
      success: true,
      data: property,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch property",
      error: error.message,
    });
  }
});

// ============================================
// GET VENDOR'S PROPERTIES
// ============================================

// GET /api/properties/vendor/my-properties
router.get("/vendor/my-properties", protect, authorize("vendor"), async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user.id }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      data: properties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch properties",
      error: error.message,
    });
  }
});

// ============================================
// UPDATE PROPERTY
// ============================================

// PUT /api/properties/:id
router.put(
  "/:id",
  protect,
  authorize("vendor"),
  async (req, res) => {
    try {
      const property = await Property.findById(req.params.id);

      if (!property) {
        return res.status(404).json({
          success: false,
          message: "Property not found",
        });
      }

      // Check if vendor owns this property
      if (property.owner.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to update this property",
        });
      }

      // Validate pincode if it's being updated
      if (req.body.location?.pincode) {
        if (!/^\d{6}$/.test(req.body.location.pincode)) {
          return res.status(400).json({
            success: false,
            message: "Invalid pincode format. Please enter a 6-digit pincode.",
          });
        }
      }

      const updatedProperty = await Property.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      ).populate("owner", "name email phone");

      res.json({
        success: true,
        message: "Property updated successfully",
        data: updatedProperty,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to update property",
        error: error.message,
      });
    }
  }
);

// ============================================
// DELETE PROPERTY
// ============================================

// DELETE /api/properties/:id
router.delete(
  "/:id",
  protect,
  authorize("vendor"),
  async (req, res) => {
    try {
      const property = await Property.findById(req.params.id);

      if (!property) {
        return res.status(404).json({
          success: false,
          message: "Property not found",
        });
      }

      // Check if vendor owns this property
      if (property.owner.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to delete this property",
        });
      }

      await Property.findByIdAndDelete(req.params.id);

      res.json({
        success: true,
        message: "Property deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to delete property",
        error: error.message,
      });
    }
  }
);

// ============================================
// ADD PROPERTY TO FAVORITES
// ============================================

// POST /api/properties/:id/favorite
router.post("/:id/favorite", protect, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
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
      message: isFavorited ? "Removed from favorites" : "Added to favorites",
      data: property,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update favorites",
      error: error.message,
    });
  }
});

// ============================================
// GET NEARBY PROPERTIES
// ============================================

// GET /api/properties/nearby
router.get("/nearby/:id", async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property || !property.location.coordinates.latitude) {
      return res.status(400).json({
        success: false,
        message: "Property or coordinates not found",
      });
    }

    const radiusKm = req.query.radius || 10;
    const nearbyProperties = await Property.findNearby(
      property.location.coordinates.latitude,
      property.location.coordinates.longitude,
      radiusKm
    )
      .where("_id")
      .ne(req.params.id) // Exclude the current property
      .limit(6);

    res.json({
      success: true,
      data: nearbyProperties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch nearby properties",
      error: error.message,
    });
  }
});

export default router;
