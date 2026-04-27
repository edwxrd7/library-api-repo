import { body, param } from 'express-validator';
import { handleValidationErrors } from './handleValidationErrors.js';

export const validateBookId = [
  param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer'),

  handleValidationErrors,
];

export const validateCreateBook = [
  body('title')
    .exists({ values: 'falsy' })
    .withMessage('Title is required')
    .bail()
    .trim()
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters'),

  body('author')
    .exists({ values: 'falsy' })
    .withMessage('Author is required')
    .bail()
    .trim()
    .isString()
    .withMessage('Author must be a string')
    .bail()
    .isLength({ min: 3 })
    .withMessage('Author must be at least 3 characters'),

  body('yearPublished')
    .exists({ values: 'falsy' })
    .withMessage('Published year is required')
    .bail()
    .isInt({
      min: 1000,
      max: new Date().getFullYear(),
    })
    .withMessage('Published year must be a valid year'),

  body('genreId')
    .exists({ values: 'falsy' })
    .withMessage('Genre ID is required')
    .bail()
    .isInt({ min: 1 })
    .withMessage('Genre ID must be a positive integer'),

  handleValidationErrors,
];
