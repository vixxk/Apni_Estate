import "./config/env.js";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./config/mongodb.js";
import userRoutes from "./routes/UserRoute.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import appointmentRoutes from "./routes/appointmentRoute.js";
import formRoutes from "./routes/formRoute.js";
import newsRoutes from "./routes/newsRoute.js";
import adminRoutes from "./routes/adminRoute.js";
import uploadRoutes from "./routes/uploadRoute.js"; // ✅ new
import { appConfig } from "./config/config.js";
import vendorServiceRoutes from "./routes/vendorServiceRoute.js";
import serviceUploadRoutes from "./routes/serviceUploadRoute.js";


console.log("RAW env JWTSECRET:", process.env.JWTSECRET);

const app = express();
const PORT = process.env.PORT || 4000;

// for __dirname with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// CORS configuration
app.use(
  cors({
    origin: [
      appConfig.WEBSITE_URL || "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ✅ serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    message: "ApniEstate Backend API is running!",
    version: "1.0.0",
    status: "healthy",
  });
});

// API routes
app.use("/api/users", userRoutes);

// Properties
app.use("/api/properties", propertyRoutes);

// ✅ new upload route for property images
app.use("/api/upload", uploadRoutes);

app.use("/api/appointments", appointmentRoutes);
app.use("/api/forms", formRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/vendor/services", vendorServiceRoutes);
app.use("/api/upload", serviceUploadRoutes);


// Status endpoint
app.get("/status", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ApniEstate Backend Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(
    `🌐 Frontend URL: ${process.env.WEBSITE_URL || "http://localhost:5173"}`
  );
});
