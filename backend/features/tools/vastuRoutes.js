import express from 'express';
import { calculateVastu } from './vastuController.js';

const router = express.Router();

router.post('/calculate', calculateVastu);

export default router;
