import React, { useState } from 'react';
import api from '../axios'; // ✅

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/api/users/register', form); // ✅ Use api instance
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <input name="name" onChange={handleChange} className="form-control mb-3" placeholder="Full Name" />
        <input name="email" onChange={handleChange} className="form-control mb-3" placeholder="Email" />
        <input name="phone" onChange={handleChange} className="form-control mb-3" placeholder="Phone" />
        <input name="password" onChange={handleChange} type="password" className="form-control mb-3" placeholder="Password" />
        <button type="submit" className="btn btn-primary">Register</button>
      </form>
    </div>
  );
};

export default Register;
