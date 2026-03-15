import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Agrega el token automáticamente a cada request
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

// STORES
export const getStores = () => api.get('/stores');
export const getStoreProducts = (storeId) =>
  api.get(`/stores/${storeId}/products`);

// ORDERS
export const createOrder = (storeId, items) =>
  api.post('/orders', { storeId, items });

export const getMyOrders = () => api.get('/orders/my');