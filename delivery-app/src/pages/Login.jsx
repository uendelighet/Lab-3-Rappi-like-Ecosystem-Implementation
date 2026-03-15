import { useState } from 'react';
import { login } from '../services/api';

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError('');
    try {
      const res = await login(form.email, form.password);
      const token = res.data.session.access_token;
      const user = res.data.user;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      onLogin(user);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 24, border: '1px solid #ddd', borderRadius: 8 }}>
      <h2>Delivery App — Iniciar sesión</h2>
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
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button
        onClick={handleSubmit}
        style={{ width: '100%', padding: 10, background: '#3498db', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
      >
        Entrar
      </button>
    </div>
  );
}