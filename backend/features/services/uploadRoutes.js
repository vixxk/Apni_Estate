import express from 'express';
import { protect, authorize } from '../../middleware/authmiddleware.js';
import { uploadServiceImages } from '../upload/uploadController.js';
import { uploadPropertyImages } from '../../middleware/uploadMiddleware.js'; // Reuse or create specific middleware if needed

const router = express.Router();

// Using middleware with memory storage if that's what's required by uploadServiceImages
// But wait, uploadServiceImages uses uploadToImageKit which requires file buffer?
// The previous code used multer.memoryStorage().
// Let's create a memory storage middleware instance here or import one.

import multer from 'multer';
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { files: 5 },
});

router.post(
  '/service-images',
  protect,
  authorize('vendor'),
  upload.array('images', 5),
  uploadServiceImages
);

export default router;
