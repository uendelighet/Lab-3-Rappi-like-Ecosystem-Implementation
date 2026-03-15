import Boom from '@hapi/boom';
import { pool } from '../../config/database';
import { CreateProductDTO, Product, UpdateProductDTO } from './product.types';

export const getProductsByStoreService = async (storeId: string): Promise<Product[]> => {
  const result = await pool.query(
    `SELECT id, name, price, "storeId" FROM products WHERE "storeId" = $1`,
    [storeId]
  );
  return result.rows;
};

export const getProductByIdService = async (productId: string): Promise<Product> => {
  const result = await pool.query(
    `SELECT id, name, price, "storeId" FROM products WHERE id = $1`,
    [productId]
  );
  if (result.rowCount === 0) throw Boom.notFound('Product not found');
  return result.rows[0];
};

export const createProductService = async (data: CreateProductDTO): Promise<Product> => {
  const result = await pool.query(
    `INSERT INTO products (name, price, "storeId") VALUES ($1, $2, $3)
     RETURNING id, name, price, "storeId"`,
    [data.name, data.price, data.storeId]
  );
  return result.rows[0];
};

export const updateProductService = async (data: UpdateProductDTO): Promise<Product> => {
  const product = await getProductByIdService(data.id);
  const name = data.name ?? product.name;
  const price = data.price ?? product.price;

  const result = await pool.query(
    `UPDATE products SET name = $1, price = $2 WHERE id = $3
     RETURNING id, name, price, "storeId"`,
    [name, price, data.id]
  );
  return result.rows[0];
};

export const deleteProductService = async (productId: string): Promise<void> => {
  const product = await getProductByIdService(productId);
  await pool.query(`DELETE FROM products WHERE id = $1`, [product.id]);
};