import { useEffect, useState } from 'react';
import {
  getAvailableOrders,
  getMyDeliveries,
  getOrderById,
  updateOrderStatus,
} from '../services/api';

export default function Dashboard({ onLogout }) {
  const [tab, setTab] = useState('available');
  const [available, setAvailable] = useState([]);
  const [myDeliveries, setMyDeliveries] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const loadData = () => {
    getAvailableOrders().then((res) => setAvailable(res.data));
    getMyDeliveries().then((res) => setMyDeliveries(res.data));
  };

  useEffect(() => { loadData(); }, []);

  const handleViewDetail = async (id) => {
    const res = await getOrderById(id);
    setSelectedOrder(res.data);
  };

  const handleAccept = async (orderId) => {
    await updateOrderStatus(orderId, 'in_delivery');
    loadData();
    setSelectedOrder(null);
  };

  const handleDecline = async (orderId) => {
    await updateOrderStatus(orderId, 'declined');
    loadData();
    setSelectedOrder(null);
  };

  const handleDeliver = async (orderId) => {
    await updateOrderStatus(orderId, 'delivered');
    loadData();
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2>🛵 Delivery App</h2>
        <button onClick={onLogout} style={{ padding: '8px 16px', cursor: 'pointer' }}>Salir</button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <button
          onClick={() => setTab('available')}
          style={{ marginRight: 8, padding: '8px 16px', background: tab === 'available' ? '#3498db' : '#ddd', color: tab === 'available' ? 'white' : 'black', border: 'none', borderRadius: 4, cursor: 'pointer' }}
        >
          Órdenes disponibles
        </button>
        <button
          onClick={() => setTab('mine')}
          style={{ padding: '8px 16px', background: tab === 'mine' ? '#3498db' : '#ddd', color: tab === 'mine' ? 'white' : 'black', border: 'none', borderRadius: 4, cursor: 'pointer' }}
        >
          Mis entregas
        </button>
      </div>

      {selectedOrder && (
        <div style={{ padding: 16, border: '2px solid #3498db', borderRadius: 8, marginBottom: 16 }}>
          <h3>Detalle de orden</h3>
          <p><strong>ID:</strong> {selectedOrder.id}</p>
          <p><strong>Estado:</strong> {selectedOrder.status}</p>
          <p><strong>Items:</strong></p>
          <ul>
            {selectedOrder.items?.map((item) => (
              <li key={item.id}>Producto: {item.productId} — Cantidad: {item.quantity}</li>
            ))}
          </ul>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button onClick={() => handleAccept(selectedOrder.id)} style={{ padding: '8px 16px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>✅ Aceptar</button>
            <button onClick={() => handleDecline(selectedOrder.id)} style={{ padding: '8px 16px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>❌ Rechazar</button>
            <button onClick={() => setSelectedOrder(null)} style={{ padding: '8px 16px', border: '1px solid #ddd', borderRadius: 4, cursor: 'pointer' }}>Cerrar</button>
          </div>
        </div>
      )}

      {tab === 'available' && (
        <div>
          <h3>Órdenes listas para recoger</h3>
          {available.length === 0 && <p>No hay órdenes disponibles</p>}
          {available.map((order) => (
            <div key={order.id} style={{ padding: 16, border: '1px solid #ddd', borderRadius: 8, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p><strong>ID:</strong> {order.id}</p>
                <p><strong>Estado:</strong> {order.status}</p>
              </div>
              <button onClick={() => handleViewDetail(order.id)} style={{ padding: '8px 16px', background: '#3498db', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Ver detalle</button>
            </div>
          ))}
        </div>
      )}

      {tab === 'mine' && (
        <div>
          <h3>Mis entregas aceptadas</h3>
          {myDeliveries.length === 0 && <p>No tienes entregas aún</p>}
          {myDeliveries.map((order) => (
            <div key={order.id} style={{ padding: 16, border: '1px solid #ddd', borderRadius: 8, marginBottom: 8 }}>
              <p><strong>ID:</strong> {order.id}</p>
              <p><strong>Estado:</strong> {order.status}</p>
              <p><strong>Fecha:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              {order.status === 'in_delivery' && (
                <button onClick={() => handleDeliver(order.id)} style={{ marginTop: 8, padding: '8px 16px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>✅ Marcar entregado</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}