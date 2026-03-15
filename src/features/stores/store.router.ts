import { Router } from 'express';
import {
  getStoresController,
  getStoreByIdController,
  getMyStoreController,
  updateStoreController,
} from './store.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';

export const router = Router();

router.use(authMiddleware);
router.get('/', getStoresController);
router.get('/my', getMyStoreController);
router.get('/:id', getStoreByIdController);
router.patch('/:id', updateStoreController);