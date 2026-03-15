import Boom from '@hapi/boom';
import { pool } from '../../config/database';
import { CreateOrderDTO, Order, OrderStatus, UpdateOrderStatusDTO } from './order.types';

export const getOrderByIdService = async (orderId: string): Promise<Order> => {
  const result = await pool.query(
    `SELECT id, "consumerId", "storeId", "deliveryId", status, "createdAt"
     FROM orders WHERE id = $1`,
    [orderId]
  );
  if (result.rowCount === 0) throw Boom.notFound('Order not found');

  const order = result.rows[0];
  const itemsResult = await pool.query(
    `SELECT id, "orderId", "productId", quantity FROM order_items WHERE "orderId" = $1`,
    [orderId]
  );
  order.items = itemsResult.rows;
  return order;
};

export const getOrdersByConsumerService = async (consumerId: string): Promise<Order[]> => {
  const result = await pool.query(
    `SELECT id, "consumerId", "storeId", "deliveryId", status, "createdAt"
     FROM orders WHERE "consumerId" = $1 ORDER BY "createdAt" DESC`,
    [consumerId]
  );
  return result.rows;
};

export const getOrdersByStoreService = async (storeId: string): Promise<Order[]> => {
  const result = await pool.query(
    `SELECT id, "consumerId", "storeId", "deliveryId", status, "createdAt"
     FROM orders WHERE "storeId" = $1 ORDER BY "createdAt" DESC`,
    [storeId]
  );
  return result.rows;
};

export const getAvailableOrdersService = async (): Promise<Order[]> => {
  const result = await pool.query(
    `SELECT id, "consumerId", "storeId", "deliveryId", status, "createdAt"
     FROM orders WHERE status = $1 AND "deliveryId" IS NULL ORDER BY "createdAt" ASC`,
    [OrderStatus.READY]
  );
  return result.rows;
};

export const getOrdersByDeliveryService = async (deliveryId: string): Promise<Order[]> => {
  const result = await pool.query(
    `SELECT id, "consumerId", "storeId", "deliveryId", status, "createdAt"
     FROM orders WHERE "deliveryId" = $1 ORDER BY "createdAt" DESC`,
    [deliveryId]
  );
  return result.rows;
};

export const createOrderService = async (data: CreateOrderDTO): Promise<Order> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const orderResult = await client.query(
      `INSERT INTO orders ("consumerId", "storeId", status)
       VALUES ($1, $2, $3)
       RETURNING id, "consumerId", "storeId", "deliveryId", status, "createdAt"`,
      [data.consumerId, data.storeId, OrderStatus.PENDING]
    );
    const order = orderResult.rows[0];

    for (const item of data.items) {
      await client.query(
        `INSERT INTO order_items ("orderId", "productId", quantity) VALUES ($1, $2, $3)`,
        [order.id, item.productId, item.quantity]
      );
    }

    await client.query('COMMIT');

    const itemsResult = await client.query(
      `SELECT id, "orderId", "productId", quantity FROM order_items WHERE "orderId" = $1`,
      [order.id]
    );
    order.items = itemsResult.rows;
    return order;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

export const updateOrderStatusService = async (data: UpdateOrderStatusDTO): Promise<Order> => {
  await getOrderByIdService(data.id);

  const result = await pool.query(
    `UPDATE orders
     SET status = $1, "deliveryId" = COALESCE($2, "deliveryId")
     WHERE id = $3
     RETURNING id, "consumerId", "storeId", "deliveryId", status, "createdAt"`,
    [data.status, data.deliveryId ?? null, data.id]
  );
  return result.rows[0];
};