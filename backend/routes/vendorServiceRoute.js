import express from "express";
import Service from "../models/ServiceModel.js";
import { protect, authorize } from "../middleware/authmiddleware.js";

const router = express.Router();

// POST /api/vendor/services
router.post("/", protect, authorize("vendor"), async (req, res) => {
  try {
    const { title, description, categories, priceRange, images } = req.body;

    if (
      !title ||
      !description ||
      !categories?.length ||
      !priceRange?.min ||
      !priceRange?.max
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const service = await Service.create({
      vendor: req.user._id,
      title,
      description,
      categories,
      priceRange,
      images: images || [],
    });

    res.status(201).json({
      success: true,
      message: "Service listed successfully",
      data: { service },
    });
  } catch (error) {
    console.error("Create service error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create service",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const services = await Service.find({ isActive: true })
      .populate("vendor", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { services },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch services",
    });
  }
});


export default router;
