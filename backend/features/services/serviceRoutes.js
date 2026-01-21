import express from "express";
import { protect, authorize } from '../../middleware/authmiddleware.js';
import {
  createVendorService,
  getAllServices,
} from './vendorServiceController.js';

const router = express.Router();

router.post("/", protect, authorize("vendor"), createVendorService);
router.get("/", getAllServices);

export default router;
