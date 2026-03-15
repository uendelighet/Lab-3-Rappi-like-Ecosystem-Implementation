import { Request, Response } from 'express';
import Boom from '@hapi/boom';
import {
  getProductsByStoreService,
  getProductByIdService,
  createProductService,
  updateProductService,
  deleteProductService,
} from './product.service';
import { getAuthUser } from '../../middlewares/authMiddleware';
import { getStoreByIdService } from '../stores/store.service';

export const getProductsByStoreController = async (req: Request, res: Response) => {
  const products = await getProductsByStoreService(String(req.params.storeId));
  return res.json(products);
};

export const getProductByIdController = async (req: Request, res: Response) => {
  const product = await getProductByIdService(String(req.params.id));
  return res.json(product);
};

export const createProductController = async (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const store = await getStoreByIdService(String(req.params.storeId));

  if (store.userId !== user.id) throw Boom.forbidden('You do not own this store');

  const { name, price } = req.body ?? {};
  if (!name) throw Boom.badRequest('Name is required');
  if (price === undefined) throw Boom.badRequest('Price is required');

  const product = await createProductService({
    name,
    price: Number(price),
    storeId: String(req.params.storeId),
  });
  return res.status(201).json(product);
};

export const updateProductController = async (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const product = await getProductByIdService(String(req.params.id));
  const store = await getStoreByIdService(product.storeId);

  if (store.userId !== user.id) throw Boom.forbidden('You do not own this store');

  const { name, price } = req.body ?? {};
  const updated = await updateProductService({ id: String(req.params.id), name, price });
  return res.json(updated);
};

export const deleteProductController = async (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const product = await getProductByIdService(String(req.params.id));
  const store = await getStoreByIdService(product.storeId);

  if (store.userId !== user.id) throw Boom.forbidden('You do not own this store');

  await deleteProductService(String(req.params.id));
  return res.json({ message: 'Product deleted' });
};