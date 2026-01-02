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
import uploadRoutes from "./routes/uploadRoute.js";
import vendorServiceRoutes from "./routes/vendorServiceRoute.js";
import serviceUploadRoutes from "./routes/serviceUploadRoute.js";

// console.log("RAW env JWTSECRET:", process.env.JWTSECRET);

const app = express();
const PORT = process.env.PORT || 4000;

// __dirname support (ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect DB
connectDB();

// Basic security 
app.use(helmet());

// Rate limiting 
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
  })
);

app.use(cors());

// Body parsers
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Serve uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "ApniEstate Backend API is running!",
    status: "healthy",
  });
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/forms", formRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/vendor/services", vendorServiceRoutes);

// Upload routes 
app.use("/api/upload/property", uploadRoutes);
app.use("/api/upload/service", serviceUploadRoutes);

// Status endpoint
app.get("/status", (req, res) => {
  res.json({
    status: "OK",
    time: new Date().toISOString(),
  });
});

// 404
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});