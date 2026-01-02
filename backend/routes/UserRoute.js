import "../config/env.js";

import express from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/Usermodel.js";
import Property from "../models/propertymodel.js";
import { protect } from "../middleware/authmiddleware.js";
import { sendEmail, emailTemplates } from "../config/nodemailer.js";
import { appConfig as config } from "../config/config.js";
import multer from "multer";
import { uploadToImageKit } from "../config/imagekit.js";

// console.log("ENV JWTSECRET in UserRoute:", process.env.JWTSECRET);
// console.log("=== CONFIG IN UserRoute ===");
// console.log("ADMIN_EMAIL:", config.ADMIN_EMAIL);
// console.log("JWT_SECRET:", config.JWT_SECRET);

const router = express.Router();

const generateToken = (id) => {
  if (!config.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing in config");
  }

  return jwt.sign({ id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  });
};


// @route   POST /api/users/register
// @desc    Register a new user (user or vendor)
// @access  Public
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Block admin creation via signup
    if (role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin registration is not allowed",
      });
    }

    const allowedRoles = ["user", "vendor"];
    const userRole = allowedRoles.includes(role) ? role : "user";

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: userRole,
    });

    try {
      const tpl = emailTemplates.welcome(user.name);
      await sendEmail(user.email, tpl.subject, tpl.html);
    } catch (emailError) {
      console.error("Welcome email failed:", emailError);
    }

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
});


// @route   POST /api/users/login
// @desc    Authenticate user & get token
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

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
});

// @route   POST /api/users/admin
// @desc    Admin login (using env credentials)
// @access  Public
router.post("/admin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check env-configured admin credentials
    if (email !== config.ADMIN_EMAIL || password !== config.ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
    }

    // Ensure an admin user exists in DB
    let adminUser = await User.findOne({
      email: config.ADMIN_EMAIL.toLowerCase(),
    });

    if (!adminUser) {
      adminUser = await User.create({
        name: "Admin",
        email: config.ADMIN_EMAIL,
        password: config.ADMIN_PASSWORD,
        role: "admin",
      });
    }

    const token = generateToken(adminUser._id);

    res.json({
      success: true,
      message: "Admin login successful",
      data: {
        user: {
          id: adminUser._id,
          name: adminUser.name,
          email: adminUser.email,
          role: adminUser.role,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({
      success: false,
      message: "Admin login failed",
      error: error.message,
    });
  }
});


// @route   GET /api/users/me
// @desc    Get current user (basic)
// @access  Private
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.json({
      success: true,
      data: {
        user: {
          ...user.toJSON(),
          avatar: user.avatar, // explicitly include avatar
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get user profile",
      error: error.message,
    });
  }
});



// Add multer config at the top of the file (after imports)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// @route   POST /api/users/avatar
// @desc    Upload profile avatar
// @access  Private
router.post("/avatar", protect, upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    // Upload to ImageKit
    const uploadResult = await uploadToImageKit(req.file, "avatars");

    // Update user avatar URL
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.avatar = uploadResult.url;
    await user.save();

    res.json({
      success: true,
      message: "Avatar uploaded successfully",
      data: {
        avatar: uploadResult.url,
      },
    });
  } catch (error) {
    console.error("Avatar upload error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload avatar",
      error: error.message,
    });
  }
});

// @route   DELETE /api/users/avatar
// @desc    Remove profile avatar
// @access  Private
router.delete("/avatar", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.avatar = null;
    await user.save();

    res.json({
      success: true,
      message: "Avatar removed successfully",
    });
  } catch (error) {
    console.error("Avatar removal error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove avatar",
      error: error.message,
    });
  }
});

// @route   GET /api/users/vendor/:id
// @desc    Get vendor public profile
// @access  Public
router.get("/vendor/:id", async (req, res) => {
  try {
    const vendor = await User.findById(req.params.id).select(
      "name email phone avatar role createdAt"
    );

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    // Only allow viewing vendor profiles
    if (vendor.role !== "vendor") {
      return res.status(403).json({
        success: false,
        message: "This user is not a vendor",
      });
    }

    res.json({
      success: true,
      data: vendor,
    });
  } catch (error) {
    console.error("Vendor profile fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch vendor profile",
      error: error.message,
    });
  }
});


// @route   GET /api/users/profile
// @desc    Get detailed profile with saved count, etc.
// @access  Private
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "savedProperties",
      "title price location type status"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
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
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
});

// @route   GET /api/users/saved
// @desc    Get saved/favourite properties
// @access  Private
router.get("/saved", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "savedProperties",
      "title price location type status images createdAt"
    );

    const properties = user?.savedProperties || [];

    res.json({
      success: true,
      data: { properties },
    });
  } catch (error) {
    console.error("Saved properties fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch saved properties",
      error: error.message,
    });
  }
});

// @route   POST /api/users/saved/toggle
// @desc    Toggle save/unsave property
// @access  Private
router.post("/saved/toggle", protect, async (req, res) => {
  try {
    const { propertyId } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    const user = await User.findById(req.user._id);
    const idx = user.savedProperties.findIndex(
      (id) => id.toString() === propertyId
    );

    let action;
    if (idx === -1) {
      user.savedProperties.push(propertyId);
      action = "saved";
    } else {
      user.savedProperties.splice(idx, 1);
      action = "removed";
    }

    await user.save();

    res.json({
      success: true,
      message: `Property ${action} successfully`,
      data: {
        savedProperties: user.savedProperties,
      },
    });
  } catch (error) {
    console.error("Toggle saved error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update saved properties",
      error: error.message,
    });
  }
});


// @route   POST /api/users/forgot
// @desc    Forgot password
// @access  Public
router.post("/forgot", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const resetToken = user.createPasswordResetToken();
    await user.save();

    const resetUrl = `${config.WEBSITE_URL}/reset-password/${resetToken}`;
    const tpl = emailTemplates.passwordReset(resetUrl);

    try {
      await sendEmail(user.email, tpl.subject, tpl.html);

      res.json({
        success: true,
        message: "Password reset email sent",
      });
    } catch (emailError) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      return res.status(500).json({
        success: false,
        message: "Email could not be sent",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to process forgot password request",
      error: error.message,
    });
  }
});

// @route   POST /api/users/reset/:token
// @desc    Reset password
// @access  Public
router.post("/reset/:token", async (req, res) => {
  try {
    const { password } = req.body;

    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to reset password",
      error: error.message,
    });
  }
});

// @route   PUT /api/users/me
// @desc    Update current user profile
// @access  Private
router.put("/me", protect, async (req, res) => {
  try {
    const { name, phone } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update only provided fields
    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
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
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
});


export default router;
