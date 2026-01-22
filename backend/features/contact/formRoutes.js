import express from 'express';
import { body } from 'express-validator';
import {
  submitContactForm,
  getContactForms,
  deleteContactForm,
} from './formController.js';

const router = express.Router();

router.post(
  '/',
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('phone')
      .optional()
      .trim()
      .matches(/^[0-9+\-\s()]*$/)
      .withMessage('Please provide a valid phone number'),
    body('message')
      .trim()
      .notEmpty()
      .withMessage('Message is required')
      .isLength({ min: 10, max: 1000 })
      .withMessage('Message must be between 10 and 1000 characters'),
  ],
  submitContactForm
);

router.get('/', getContactForms);
router.delete('/:id', deleteContactForm);

export default router;
