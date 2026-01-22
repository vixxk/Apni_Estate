import express from 'express';
import { calculateEstimation } from './estimatorController.js';

const router = express.Router();

router.post('/calculate', calculateEstimation);

export default router;
