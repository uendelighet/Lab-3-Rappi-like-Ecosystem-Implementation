import { Request, Response } from 'express';
import Boom from '@hapi/boom';
import {
  getStoresService,
  getStoreByIdService,
  getStoreByUserIdService,
  updateStoreService,
} from './store.service';
import { getAuthUser } from '../../middlewares/authMiddleware';

export const getStoresController = async (req: Request, res: Response) => {
  const stores = await getStoresService();
  return res.json(stores);
};

export const getStoreByIdController = async (req: Request, res: Response) => {
 const store = await getStoreByIdService(String(req.params.id));
  return res.json(store);
};

export const getMyStoreController = async (req: Request, res: Response) => {
  const user = getAuthUser(req);
 const store = await getStoreByIdService(String(req.params.id));
  return res.json(store);
};

export const updateStoreController = async (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const store = await getStoreByIdService(String(req.params.id));

  if (store.userId !== user.id) throw Boom.forbidden('You do not own this store');

  const { name, isOpen } = req.body ?? {};
  const updated = await updateStoreService({ id: String(req.params.id), name, isOpen });
  return res.json(updated);
};