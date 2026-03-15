import { useState } from 'react';
import { login, register } from '../services/api';

export default function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    email: '', password: '', name: '', role: 'consumer', storeName: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError('');
    try {
      if (isRegister) {
        await register(form);
        alert('Registro exitoso, ahora inicia sesión');
        setIsRegister(false);
      } else {
        const res = await login(form.email, form.password);
        const token = res.data.session.access_token;
        const user = res.data.user;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        onLogin(user);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 24, border: '1px solid #ddd', borderRadius: 8 }}>
      <h2>{isRegister ? 'Registrarse' : 'Iniciar sesión'}</h2>

      {isRegister && (
        <input
          name="name" placeholder="Nombre"
          value={form.name} onChange={handleChange}
          style={{ display: 'block', width: '100%', marginBottom: 8, padding: 8 }}
        />
      )}

      <input
        name="email" placeholder="Email" type="email"
        value={form.email} onChange={handleChange}
        style={{ display: 'block', width: '100%', marginBottom: 8, padding: 8 }}
      />
      <input
        name="password" placeholder="Contraseña" type="password"
        value={form.password} onChange={handleChange}
        style={{ display: 'block', width: '100%', marginBottom: 8, padding: 8 }}
      />

      {isRegister && (
        <select
          name="role" value={form.role} onChange={handleChange}
          style={{ display: 'block', width: '100%', marginBottom: 8, padding: 8 }}
        >
          <option value="consumer">Consumer</option>
          <option value="store">Store</option>
          <option value="delivery">Delivery</option>
        </select>
      )}

      {isRegister && form.role === 'store' && (
        <input
          name="storeName" placeholder="Nombre de la tienda"
          value={form.storeName} onChange={handleChange}
          style={{ display: 'block', width: '100%', marginBottom: 8, padding: 8 }}
        />
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button
        onClick={handleSubmit}
        style={{ width: '100%', padding: 10, background: '#ff6b35', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
      >
        {isRegister ? 'Registrarse' : 'Entrar'}
      </button>

      <p
        onClick={() => setIsRegister(!isRegister)}
        style={{ textAlign: 'center', cursor: 'pointer', color: '#ff6b35', marginTop: 12 }}
      >
        {isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
      </p>
    </div>
  );
}