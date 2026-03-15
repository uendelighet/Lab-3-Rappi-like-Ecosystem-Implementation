import { Router } from 'express';
import {
  getProductByIdController,
  updateProductController,
  deleteProductController,
} from './product.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';

export const router = Router();

router.use(authMiddleware);
router.get('/:id', getProductByIdController);
router.patch('/:id', updateProductController);
router.delete('/:id', deleteProductController);