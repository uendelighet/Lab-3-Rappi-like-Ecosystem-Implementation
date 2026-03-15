export enum OrderStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  PREPARING = 'preparing',
  READY = 'ready_for_pickup',
  IN_DELIVERY = 'in_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  DECLINED = 'declined',
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
}

export interface OrderItemInput {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  consumerId: string;
  storeId: string;
  deliveryId: string | null;
  status: OrderStatus;
  createdAt: string;
  items?: OrderItem[];
}

export interface CreateOrderDTO {
  consumerId: string;
  storeId: string;
  items: OrderItemInput[];
}

export interface UpdateOrderStatusDTO {
  id: string;
  status: OrderStatus;
  deliveryId?: string;
}