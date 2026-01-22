import express from 'express';
import { protect, authorize } from '../../middleware/authmiddleware.js';
import { uploadPropertyImages } from '../../middleware/uploadMiddleware.js';
import {
  createProperty,
  getProperties,
  getPropertyById,
  getVendorProperties,
  updateProperty,
  deleteProperty,
  uploadPropertyImagesController,
  togglePropertyFavorite,
  getNearbyProperties,
} from './propertyController.js';

const router = express.Router();

router.get('/', getProperties);

router.post(
  '/upload-images',
  protect,
  authorize('vendor'),
  uploadPropertyImages.array('images', 5),
  uploadPropertyImagesController
);

router.post('/vendor-add', protect, authorize('vendor'), createProperty);
router.get('/vendor/my-properties', protect, authorize('vendor'), getVendorProperties);

router
  .route('/:id')
  .get(getPropertyById)
  .put(protect, authorize('vendor'), updateProperty)
  .delete(protect, authorize('vendor'), deleteProperty);

router.post('/:id/favorite', protect, togglePropertyFavorite);

router.get('/nearby/:id', getNearbyProperties);

export default router;
