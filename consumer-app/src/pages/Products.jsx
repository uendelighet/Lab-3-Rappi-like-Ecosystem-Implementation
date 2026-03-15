import { useEffect, useState } from 'react';
import { getStoreProducts } from '../services/api';

export default function Products({ store, onBack, onCheckout }) {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    getStoreProducts(store.id).then((res) => setProducts(res.data));
  }, [store]);

  const addToCart = (product) => {
    const existing = cart.find((i) => i.productId === product.id);
    if (existing) {
      setCart(cart.map((i) =>
        i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setCart([...cart, { productId: product.id, name: product.name, quantity: 1, price: product.price }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((i) => i.productId !== productId));
  };

  return (
    <div style={{ padding: 24 }}>
      <button onClick={onBack} style={{ marginBottom: 16 }}>← Volver</button>
      <h2>Productos de {store.name}</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {products.map((product) => (
          <div key={product.id} style={{ padding: 16, border: '1px solid #ddd', borderRadius: 8 }}>
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <button
              onClick={() => addToCart(product)}
              style={{ padding: '6px 12px', background: '#ff6b35', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
            >
              Agregar
            </button>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div style={{ marginTop: 24, padding: 16, background: '#f9f9f9', borderRadius: 8 }}>
          <h3>🛒 Carrito</h3>
          {cart.map((item) => (
            <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span>{item.name} x{item.quantity} — ${item.price * item.quantity}</span>
              <button onClick={() => removeFromCart(item.productId)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>✕</button>
            </div>
          ))}
          <button
            onClick={() => onCheckout(store.id, cart)}
            style={{ width: '100%', padding: 10, background: '#ff6b35', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', marginTop: 8 }}
          >
            Hacer pedido
          </button>
        </div>
      )}
    </div>
  );
}