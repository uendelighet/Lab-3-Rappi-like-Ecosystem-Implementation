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

// ORDERS
export const getAvailableOrders = () => api.get('/orders/available');
export const getMyDeliveries = () => api.get('/orders/delivery/accepted');
export const getOrderById = (id) => api.get(`/orders/${id}`);
export const updateOrderStatus = (id, status) =>
  api.patch(`/orders/${id}/status`, { status });