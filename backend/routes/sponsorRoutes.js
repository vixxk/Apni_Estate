
import express from "express";
import Sponsor from "../models/SponsorModel.js";
import multer from "multer";
import { uploadToImageKit } from "../config/imagekit.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, 
});

// GET all sponsors
router.get("/", async (req, res) => {
  try {
    const sponsors = await Sponsor.find().sort({ createdAt: -1 });
    res.json({ success: true, data: sponsors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST upload logo
router.post("/upload", upload.single("logo"), async (req, res) => {
    try {
        const { email, password } = req.headers;
        if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image uploaded" });
        }

        const result = await uploadToImageKit(req.file, "sponsors");
        res.json({ success: true, url: result.url });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST add sponsor (Admin only)
router.post("/add", async (req, res) => {
  try {
    const { email, password } = req.headers;
    
    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { name, logoUrl, description } = req.body;
    
    if (!name || !logoUrl) {
      return res.status(400).json({ success: false, message: "Name and Logo URL are required" });
    }

    const newSponsor = new Sponsor({ name, logoUrl, description });
    await newSponsor.save();

    res.status(201).json({ success: true, data: newSponsor, message: "Sponsor added successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE sponsor
router.delete("/:id", async (req, res) => {
  try {
    const { email, password } = req.headers;

     if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { id } = req.params;
    await Sponsor.findByIdAndDelete(id);

    res.json({ success: true, message: "Sponsor deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
