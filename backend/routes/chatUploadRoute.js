import express from "express";
import multer from "multer";
import { protect } from "../middleware/authmiddleware.js";
import { uploadToImageKit } from "../config/imagekit.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, 
});

// POST /api/upload/chat-image
router.post("/chat-image", protect, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }

    const image = await uploadToImageKit(req.file, "chat");

    res.json({
      success: true,
      data: {
        image: {
          url: image.url,
          width: image.width,
          height: image.height,
          size: req.file.size,
        },
      },
    });
  } catch (error) {
    console.error("Chat image upload error:", error);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
});

export default router;
