import { useState } from 'react';
import Login from './pages/Login';
import Stores from './pages/Stores';
import Products from './pages/Products';
import Orders from './pages/Orders';
import { createOrder } from './services/api';

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [page, setPage] = useState('stores');
  const [selectedStore, setSelectedStore] = useState(null);

  const handleLogin = (user) => {
    setUser(user);
    setPage('stores');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const handleCheckout = async (storeId, items) => {
    try {
      await createOrder(storeId, items);
      alert('¡Pedido creado exitosamente!');
      setPage('orders');
    } catch (err) {
      alert(err.response?.data?.message || 'Error al crear pedido');
    }
  };

  if (!user) return <Login onLogin={handleLogin} />;

  return (
    <div>
      <nav style={{ padding: '12px 24px', background: '#ff6b35', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: 'white', margin: 0 }}>🛵 Rappi</h1>
        <div>
          <button onClick={() => setPage('stores')} style={{ marginRight: 8, padding: '6px 12px', cursor: 'pointer' }}>Tiendas</button>
          <button onClick={() => setPage('orders')} style={{ marginRight: 8, padding: '6px 12px', cursor: 'pointer' }}>Mis pedidos</button>
          <button onClick={handleLogout} style={{ padding: '6px 12px', cursor: 'pointer' }}>Salir</button>
        </div>
      </nav>

      {page === 'stores' && (
        <Stores onSelectStore={(store) => { setSelectedStore(store); setPage('products'); }} />
      )}
      {page === 'products' && selectedStore && (
        <Products store={selectedStore} onBack={() => setPage('stores')} onCheckout={handleCheckout} />
      )}
      {page === 'orders' && (
        <Orders onBack={() => setPage('stores')} />
      )}
    </div>
  );
}