import { useEffect, useState } from 'react';
import { getStores } from '../services/api';

export default function Stores({ onSelectStore }) {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    getStores().then((res) => setStores(res.data));
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h2>Tiendas disponibles</h2>
      {stores.length === 0 && <p>No hay tiendas disponibles</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {stores.map((store) => (
          <div
            key={store.id}
            onClick={() => store.isOpen && onSelectStore(store)}
            style={{
              padding: 16,
              border: '1px solid #ddd',
              borderRadius: 8,
              cursor: store.isOpen ? 'pointer' : 'not-allowed',
              opacity: store.isOpen ? 1 : 0.5,
            }}
          >
            <h3>{store.name}</h3>
            <p style={{ color: store.isOpen ? 'green' : 'red' }}>
              {store.isOpen ? '🟢 Abierta' : '🔴 Cerrada'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}