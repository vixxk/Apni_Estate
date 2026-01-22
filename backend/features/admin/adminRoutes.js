import express from 'express';
import { adminProtect } from '../../middleware/authmiddleware.js';
import {
  adminLogin,
  getPendingProperties,
  getAllProperties,
  getPropertyById,
  approveProperty,
  rejectProperty,
  deleteProperty,
  getAdminStats,
} from './adminController.js';

const router = express.Router();

router.post('/login', adminLogin);

router.get('/properties/pending', adminProtect, getPendingProperties);
router.get('/properties/all', adminProtect, getAllProperties);

router.route('/properties/:id')
  .get(adminProtect, getPropertyById)
  .delete(adminProtect, deleteProperty);

router.put('/properties/:id/approve', adminProtect, approveProperty);
router.put('/properties/:id/reject', adminProtect, rejectProperty);

router.get('/stats', adminProtect, getAdminStats);

export default router;
