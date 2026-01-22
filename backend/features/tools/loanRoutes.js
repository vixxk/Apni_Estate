import express from 'express';
import { analyzeLoan } from './loanAnalysisController.js';

const router = express.Router();

router.post('/analyze', analyzeLoan);

export default router;
