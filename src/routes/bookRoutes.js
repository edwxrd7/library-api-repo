import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';
import {
  getAllBooksHandler,
  getBookByIdHandler,
  createBookHandler,
  updateBookHandler,
  deleteBookHandler,
} from '../controllers/bookController.js';
import {
  validateBookId,
  validateCreateBook,
} from '../middleware/bookValidators.js';
const router = express.Router();

router.get('/', getAllBooksHandler);

router.get('/:id', validateBookId, getBookByIdHandler);

router.post(
  '/',
  authenticate,
  authorizeRoles('ADMIN'),
  validateCreateBook,
  createBookHandler,
);

router.put(
  '/:id',
  authenticate,
  authorizeRoles('ADMIN'),
  validateBookId,
  updateBookHandler,
);

router.delete(
  '/:id',
  authenticate,
  authorizeRoles('ADMIN'),
  validateBookId,
  deleteBookHandler,
);

export default router;
