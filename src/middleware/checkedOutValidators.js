import { body, param } from 'express-validator';
import { handleValidationErrors } from './handleValidationErrors.js';

export const validateCheckoutId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Checkout ID must be a positive integer')
    .toInt(),

  handleValidationErrors,
];

export const validateCreateCheckout = [
  body('bookId')
    .exists({ values: 'falsy' })
    .withMessage('Book ID is required')
    .bail()
    .isInt({ min: 1 })
    .withMessage('Book ID must be a positive integer')
    .toInt(),

  handleValidationErrors,
];

export const validateUpdateCheckout = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Checkout ID must be a positive integer')
    .toInt(),

  body('dueDate')
    .not()
    .exists()
    .withMessage(
      'Due date cannot be provided; this endpoint always extends by 14 days',
    ),

  handleValidationErrors,
];
