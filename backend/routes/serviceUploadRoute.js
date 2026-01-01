import express from "express";
import multer from "multer";
import { protect, authorize } from "../middleware/authmiddleware.js";
import { uploadToImageKit } from "../config/imagekit.js";

const router = express.Router();

// Multer memory storage (required for ImageKit)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { files: 5 }, // max 5 images
});

// @route   POST /api/upload/service-images
// @desc    IMAGE UPLOAD ENDPOINT
// @access  for Vendors
router.post(
  "/service-images",
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
          uploadToImageKit(file, "services").then((img) => ({
            ...img,
            isPrimary: idx === 0,
          }))
        )
      );

      res.json({
        success: true,
        data: { images: uploads },
      });
    } catch (error) {
      console.error("Service image upload error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to upload images",
      });
    }
  }
);

export default router;
