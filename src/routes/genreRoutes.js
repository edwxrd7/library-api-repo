import express from 'express';
import {
  getAllGenresHandler,
  createGenreHandler,
  getGenreByIdHandler,
  deleteGenreHandler,
  updateGenreHandler,
} from '../controllers/genreController.js';

import { validateAddGenre } from '../middleware/genreValidators.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';

const router = express.Router();

router.get('/', getAllGenresHandler);

router.post(
  '/',
  authenticate,
  authorizeRoles('ADMIN'),
  validateAddGenre,
  createGenreHandler,
);
router.put(
  '/:id',
  authenticate,
  authorizeRoles('ADMIN'),
  validateAddGenre,
  updateGenreHandler,
);
router.get('/:id', getGenreByIdHandler);
router.delete(
  '/:id',
  authenticate,
  authorizeRoles('ADMIN'),
  deleteGenreHandler,
);
export default router;
