import { useEffect, useState } from 'react';
import { getMyStore, updateStore, getStoreProducts, createProduct, deleteProduct, getStoreOrders, updateOrderStatus } from '../services/api';

export default function Dashboard({ onLogout }) {
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '' });
  const [tab, setTab] = useState('products');

  useEffect(() => {
    getMyStore().then((res) => {
      setStore(res.data);
      getStoreProducts(res.data.id).then((r) => setProducts(r.data));
    });
    getStoreOrders().then((res) => setOrders(res.data));
  }, []);

  const toggleStore = async () => {
    const res = await updateStore(store.id, { isOpen: !store.isOpen });
    setStore(res.data);
  };

  const handleCreateProduct = async () => {
    if (!newProduct.name || !newProduct.price) return;
    const res = await createProduct(store.id, { name: newProduct.name, price: Number(newProduct.price) });
    setProducts([...products, res.data]);
    setNewProduct({ name: '', price: '' });
  };

  const handleDeleteProduct = async (id) => {
    await deleteProduct(id);
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleUpdateStatus = async (orderId, status) => {
    await updateOrderStatus(orderId, status);
    getStoreOrders().then((res) => setOrders(res.data));
  };

  if (!store) return <p style={{ padding: 24 }}>Cargando...</p>;

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2>🏪 {store.name}</h2>
        <div>
          <button
            onClick={toggleStore}
            style={{ marginRight: 8, padding: '8px 16px', background: store.isOpen ? '#e74c3c' : '#2ecc71', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
          >
            {store.isOpen ? '🔴 Cerrar tienda' : '🟢 Abrir tienda'}
          </button>
          <button onClick={onLogout} style={{ padding: '8px 16px', cursor: 'pointer' }}>Salir</button>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <button onClick={() => setTab('products')} style={{ marginRight: 8, padding: '8px 16px', background: tab === 'products' ? '#2ecc71' : '#ddd', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Productos</button>
        <button onClick={() => setTab('orders')} style={{ padding: '8px 16px', background: tab === 'orders' ? '#2ecc71' : '#ddd', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Órdenes</button>
      </div>

      {tab === 'products' && (
        <div>
          <h3>Productos</h3>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <input placeholder="Nombre" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} style={{ padding: 8, flex: 1 }} />
            <input placeholder="Precio" type="number" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} style={{ padding: 8, width: 100 }} />
            <button onClick={handleCreateProduct} style={{ padding: '8px 16px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>+ Agregar</button>
          </div>
          {products.map((p) => (
            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: 12, border: '1px solid #ddd', borderRadius: 8, marginBottom: 8 }}>
              <span>{p.name} — ${p.price}</span>
              <button onClick={() => handleDeleteProduct(p.id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>🗑 Eliminar</button>
            </div>
          ))}
        </div>
      )}

      {tab === 'orders' && (
        <div>
          <h3>Órdenes entrantes</h3>
          {orders.length === 0 && <p>No hay órdenes aún</p>}
          {orders.map((order) => (
            <div key={order.id} style={{ padding: 16, border: '1px solid #ddd', borderRadius: 8, marginBottom: 12 }}>
              <p><strong>ID:</strong> {order.id}</p>
              <p><strong>Estado:</strong> {order.status}</p>
              <p><strong>Fecha:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                {order.status === 'pending' && <button onClick={() => handleUpdateStatus(order.id, 'accepted')} style={{ padding: '6px 12px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>✅ Aceptar</button>}
                {order.status === 'accepted' && <button onClick={() => handleUpdateStatus(order.id, 'preparing')} style={{ padding: '6px 12px', background: '#3498db', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>👨‍🍳 Preparando</button>}
                {order.status === 'preparing' && <button onClick={() => handleUpdateStatus(order.id, 'ready_for_pickup')} style={{ padding: '6px 12px', background: '#9b59b6', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>📦 Listo</button>}
                {['pending', 'accepted', 'preparing'].includes(order.status) && <button onClick={() => handleUpdateStatus(order.id, 'declined')} style={{ padding: '6px 12px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>❌ Rechazar</button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}