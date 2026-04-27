import { body } from 'express-validator';
import { handleValidationErrors } from './handleValidationErrors.js';

export const validateAddGenre = [
  body('name')
    .exists({ values: 'falsy' })
    .withMessage('Genre name is required')
    .bail()
    .isString()
    .withMessage('Genre name must be a string')
    .bail()
    .trim()
    .matches(/[a-zA-Z]/)
    .withMessage('Genre name must contain letters')
    .bail()
    .isLength({ min: 2, max: 50 })
    .withMessage('Genre name must be between 2 and 50 characters'),

  handleValidationErrors,
];
