import { useEffect, useState } from 'react';
import { getMyOrders } from '../services/api';

export default function Orders({ onBack }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getMyOrders().then((res) => setOrders(res.data));
  }, []);

  const statusColor = {
    pending: '#f0ad4e',
    accepted: '#5bc0de',
    preparing: '#5bc0de',
    ready_for_pickup: '#5cb85c',
    in_delivery: '#5bc0de',
    delivered: '#5cb85c',
    cancelled: '#d9534f',
    declined: '#d9534f',
  };

  return (
    <div style={{ padding: 24 }}>
      <button onClick={onBack} style={{ marginBottom: 16 }}>← Volver</button>
      <h2>Mis pedidos</h2>
      {orders.length === 0 && <p>No tienes pedidos aún</p>}
      {orders.map((order) => (
        <div key={order.id} style={{ padding: 16, border: '1px solid #ddd', borderRadius: 8, marginBottom: 12 }}>
          <p><strong>ID:</strong> {order.id}</p>
          <p>
            <strong>Estado: </strong>
            <span style={{ color: statusColor[order.status], fontWeight: 'bold' }}>
              {order.status}
            </span>
          </p>
          <p><strong>Fecha:</strong> {new Date(order.createdAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}