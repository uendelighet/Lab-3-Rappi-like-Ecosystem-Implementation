import Boom from '@hapi/boom';
import { pool } from '../../config/database';
import { Store, UpdateStoreDTO } from './store.types';

export const getStoresService = async (): Promise<Store[]> => {
  const result = await pool.query(
    `SELECT id, name, "isOpen", "userId" FROM stores`
  );
  return result.rows;
};

export const getStoreByIdService = async (storeId: string): Promise<Store> => {
  const result = await pool.query(
    `SELECT id, name, "isOpen", "userId" FROM stores WHERE id = $1`,
    [storeId]
  );
  if (result.rowCount === 0) throw Boom.notFound('Store not found');
  return result.rows[0];
};

export const getStoreByUserIdService = async (userId: string): Promise<Store> => {
  const result = await pool.query(
    `SELECT id, name, "isOpen", "userId" FROM stores WHERE "userId" = $1`,
    [userId]
  );
  if (result.rowCount === 0) throw Boom.notFound('Store not found for this user');
  return result.rows[0];
};

export const updateStoreService = async (data: UpdateStoreDTO): Promise<Store> => {
  const store = await getStoreByIdService(data.id);
  const name = data.name ?? store.name;
  const isOpen = data.isOpen ?? store.isOpen;

  const result = await pool.query(
    `UPDATE stores SET name = $1, "isOpen" = $2 WHERE id = $3
     RETURNING id, name, "isOpen", "userId"`,
    [name, isOpen, data.id]
  );
  return result.rows[0];
};