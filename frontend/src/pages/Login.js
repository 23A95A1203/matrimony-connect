import React, { useState, useContext } from 'react';
import api from '../axios'; // ✅ Use central API
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { setUser } = useContext(AuthContext);
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/api/users/login', form); // ✅ Use api instance
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      alert('Login successful');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <input name="email" onChange={handleChange} className="form-control mb-3" placeholder="Email" />
        <input name="password" onChange={handleChange} type="password" className="form-control mb-3" placeholder="Password" />
        <button type="submit" className="btn btn-success">Login</button>
      </form>
    </div>
  );
};

export default Login;
