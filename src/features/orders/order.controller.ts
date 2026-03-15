import { Request, Response } from 'express';
import Boom from '@hapi/boom';
import {
  createOrderService,
  getOrderByIdService,
  getOrdersByConsumerService,
  getOrdersByStoreService,
  getAvailableOrdersService,
  getOrdersByDeliveryService,
  updateOrderStatusService,
} from './order.service';
import { getAuthUser } from '../../middlewares/authMiddleware';
import { getStoreByUserIdService } from '../stores/store.service';
import { OrderStatus } from './order.types';

export const createOrderController = async (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const { storeId, items } = req.body ?? {};

  if (!storeId) throw Boom.badRequest('storeId is required');
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw Boom.badRequest('items array is required y no puede estar vacío');
  }

  const order = await createOrderService({ consumerId: user.id, storeId, items });
  return res.status(201).json(order);
};

export const getMyOrdersController = async (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const orders = await getOrdersByConsumerService(user.id);
  return res.json(orders);
};

export const getOrderByIdController = async (req: Request, res: Response) => {
  const order = await getOrderByIdService(String(req.params.id));
  return res.json(order);
};

export const getStoreOrdersController = async (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const store = await getStoreByUserIdService(user.id);
  const orders = await getOrdersByStoreService(store.id);
  return res.json(orders);
};

export const getAvailableOrdersController = async (req: Request, res: Response) => {
  const orders = await getAvailableOrdersService();
  return res.json(orders);
};

export const getDeliveryOrdersController = async (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const orders = await getOrdersByDeliveryService(user.id);
  return res.json(orders);
};

export const updateOrderStatusController = async (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const order = await getOrderByIdService(String(req.params.id));
  const { status } = req.body ?? {};

  if (!status || !Object.values(OrderStatus).includes(status)) {
    throw Boom.badRequest(`Status debe ser uno de: ${Object.values(OrderStatus).join(', ')}`);
  }

  const role = user.user_metadata?.role as string;

  const storeAllowed = [OrderStatus.ACCEPTED, OrderStatus.PREPARING, OrderStatus.READY, OrderStatus.DECLINED];
  const deliveryAllowed = [OrderStatus.IN_DELIVERY, OrderStatus.DELIVERED, OrderStatus.DECLINED];
  const consumerAllowed = [OrderStatus.CANCELLED];

  if (role === 'store' && !storeAllowed.includes(status)) {
    throw Boom.forbidden(`Store solo puede cambiar a: ${storeAllowed.join(', ')}`);
  } else if (role === 'delivery' && !deliveryAllowed.includes(status)) {
    throw Boom.forbidden(`Delivery solo puede cambiar a: ${deliveryAllowed.join(', ')}`);
  } else if (role === 'consumer') {
    if (!consumerAllowed.includes(status)) throw Boom.forbidden('Consumer solo puede cancelar');
    if (order.consumerId !== user.id) throw Boom.forbidden('No es tu orden');
  }

  const deliveryId = role === 'delivery' && status === OrderStatus.IN_DELIVERY
    ? user.id : undefined;

  const updated = await updateOrderStatusService({ id: String(req.params.id), status, deliveryId });
  return res.json(updated);
};