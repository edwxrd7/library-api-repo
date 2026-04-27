import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';
import {
  getMyCheckoutsHandler,
  createCheckoutHandler,
  getCheckoutByIdHandler,
  updateCheckoutHandler,
  returnBookHandler,
  getAllCheckoutsHandler,
} from '../controllers/checkedOutController.js';
import {
  validateCheckoutId,
  validateCreateCheckout,
  validateUpdateCheckout,
} from '../middleware/checkedOutValidators.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getAllCheckoutsHandler);
router.get('/me', getMyCheckoutsHandler);
router.post('/', validateCreateCheckout, createCheckoutHandler);
router.get(
  '/:id',
  authorizeRoles('ADMIN'),
  validateCheckoutId,
  getCheckoutByIdHandler,
);

router.put(
  '/:id',
  authorizeRoles('ADMIN'),
  validateUpdateCheckout,
  updateCheckoutHandler,
);

router.delete('/:id', validateCheckoutId, returnBookHandler);
export default router;
