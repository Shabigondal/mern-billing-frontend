import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; // Optional for extra custom CSS

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('https://b0893827-e39d-4537-b172-9bb4f3b0d8c6-00-2e5a27ct7ql3n.sisko.replit.dev/api/auth/login', {
        email, password
      });
      onLogin(res.data);
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-page d-flex align-items-center justify-content-center vh-100">
      <div className="login-card shadow-lg p-4 rounded" style={{ width: '100%', maxWidth: '400px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
        <h3 className="text-center mb-4 text-white">🔐 Cashier Login</h3>

        {error && <div className="alert alert-danger py-1">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label className="text-white">📧 Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="e.g. cashier@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-4">
            <label className="text-white">🔒 Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 fw-bold">
            🚀 Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
