import express from "express";
import Property from "../models/propertymodel.js";
import { adminProtect } from "../middleware/authmiddleware.js";

const router = express.Router();

// @route   POST /api/admin/login
// @desc    ADMIN LOGIN 
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Check against environment variables
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      res.json({
        success: true,
        message: "Admin login successful",
        data: {
          email: process.env.ADMIN_EMAIL,
          role: "admin",
          token: "admin-authenticated", 
        },
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Admin login failed",
      error: error.message,
    });
  }
});

// @route   GET /api/admin/properties/pending
// @desc    GET ALL PENDING PROPERTIES
// @access  Admin only
router.get("/properties/pending", adminProtect, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const properties = await Property.find({ status: "pending" })
      .populate("owner", "name email phone avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Property.countDocuments({ status: "pending" });

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
      message: "Failed to fetch pending properties",
      error: error.message,
    });
  }
});

// @route   GET /api/admin/properties/all
// @desc    GET ALL PROPERTIES (ALL STATUSES)
// @access  Admin only
router.get("/properties/all", adminProtect, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    let filter = {};
    if (status) {
      filter.status = status;
    }

    const properties = await Property.find(filter)
      .populate("owner", "name email phone avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Property.countDocuments(filter);

    // Get counts for each status
    const statusCounts = await Property.aggregate([
      {
        $group: {
          _id: "$status",
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch properties",
      error: error.message,
    });
  }
});

// @route   GET /api/admin/properties/:id
// @desc    GET SINGLE PROPERTY (ADMIN VIEW)
// @access  Admin only
router.get("/properties/:id", adminProtect, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      "owner",
      "name email phone avatar"
    );

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

// @route   PUT /api/admin/properties/:id/approve
// @desc    APPROVE A PROPERTY
// @access  Admin only
router.put("/properties/:id/approve", adminProtect, async (req, res) => {
  try {
    const { notes } = req.body;

    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    if (property.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Property is already ${property.status}`,
      });
    }

    property.status = "approved";
    property.adminReview = {
      reviewedBy: req.admin.email,
      reviewedAt: new Date(),
      notes: notes || "",
      rejectionReason: null,
    };

    await property.save();

    await property.populate("owner", "name email phone avatar");

    res.json({
      success: true,
      message: "Property approved successfully",
      data: property,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to approve property",
      error: error.message,
    });
  }
});

// @route   PUT /api/admin/properties/:id/reject
// @desc    REJECT A PROPERTY
// @access  Admin only
router.put("/properties/:id/reject", adminProtect, async (req, res) => {
  try {
    const { reason, notes } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required",
      });
    }

    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    if (property.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Property is already ${property.status}`,
      });
    }

    property.status = "rejected";
    property.adminReview = {
      reviewedBy: req.admin.email,
      reviewedAt: new Date(),
      rejectionReason: reason,
      notes: notes || "",
    };

    await property.save();

    // Populate owner data before sending response
    await property.populate("owner", "name email phone avatar");

    res.json({
      success: true,
      message: "Property rejected",
      data: property,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to reject property",
      error: error.message,
    });
  }
});

// @route   DELETE /api/admin/properties/:id
// @desc    DELETE A PROPERTY (ADMIN)
// @access  Admin only
router.delete("/properties/:id", adminProtect, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
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
});

// @route   GET /api/admin/stats
// @desc    GET ADMIN DASHBOARD STATS
// @access  Admin only
router.get("/stats", adminProtect, async (req, res) => {
  try {
    const totalProperties = await Property.countDocuments();
    const pendingProperties = await Property.countDocuments({ status: "pending" });
    const approvedProperties = await Property.countDocuments({ status: "approved" });
    const rejectedProperties = await Property.countDocuments({ status: "rejected" });

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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch stats",
      error: error.message,
    });
  }
});

export default router;
