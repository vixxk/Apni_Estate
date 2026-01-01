import express from "express";
import multer from "multer";
import path from "path";
import { protect, authorize } from "../middleware/authmiddleware.js";

const router = express.Router();

// store files in /uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { files: 4 }, // max 4 files
});

// @route   POST /api/upload/property-images
// @desc    IMAGE UPLOAD ENDPOINT
// @access  for Vendors
router.post(
  "/property-images",
  protect,
  authorize("admin"),
  upload.array("images", 4),
  (req, res) => {
    const files = req.files || [];

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const urls = files.map((f) => ({
      url: `${baseUrl}/uploads/${f.filename}`,
    }));

    res.json({
      success: true,
      data: { images: urls },
    });
  }
);

export default router;
