import express from 'express';
import { adminProtect } from '../../middleware/authmiddleware.js';
import {
  createTelecaller,
  getAllTelecallers,
  updateTelecallerStatus,
  getTelecallerStats,
  downloadReport,
} from './telecallerController.js';

const router = express.Router();

// All routes protected and admin only
router.use(adminProtect);

router.route('/')
  .post(createTelecaller)
  .get(getAllTelecallers);

router.put('/:id/status', updateTelecallerStatus);
router.get('/stats', getTelecallerStats);
router.get('/export', downloadReport);

export default router;
