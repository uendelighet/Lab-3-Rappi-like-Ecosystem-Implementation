import { Router } from 'express';
import {
  createOrderController,
  getMyOrdersController,
  getOrderByIdController,
  getStoreOrdersController,
  getAvailableOrdersController,
  getDeliveryOrdersController,
  updateOrderStatusController,
} from './order.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';

export const router = Router();

router.use(authMiddleware);

router.get('/my', getMyOrdersController);
router.get('/store', getStoreOrdersController);
router.get('/available', getAvailableOrdersController);
router.get('/delivery/accepted', getDeliveryOrdersController);

router.post('/', createOrderController);
router.get('/:id', getOrderByIdController);
router.patch('/:id/status', updateOrderStatusController);