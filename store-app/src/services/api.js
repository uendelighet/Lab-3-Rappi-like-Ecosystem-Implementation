import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// AUTH
export const login = (email, password) =>
  api.post('/auth/login', { email, password });

export const register = (data) =>
  api.post('/auth/register', data);

// STORE
export const getMyStore = () => api.get('/stores/my');
export const updateStore = (id, data) => api.patch(`/stores/${id}`, data);

// PRODUCTS
export const getStoreProducts = (storeId) =>
  api.get(`/stores/${storeId}/products`);
export const createProduct = (storeId, data) =>
  api.post(`/stores/${storeId}/products`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// ORDERS
export const getStoreOrders = () => api.get('/orders/store');
export const updateOrderStatus = (id, status) =>
  api.patch(`/orders/${id}/status`, { status });