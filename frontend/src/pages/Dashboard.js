// Summary: This file adds the following features:
// - Profile icon in top-right with dropdown menu (Edit Profile, Received Interests, Logout)
// - Upgrade to Premium button with modal to choose a plan and make payment
// - Filter-based user search on dashboard

import React, { useState, useEffect } from 'react';
import axios from '../axios';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSearch, FaCrown } from 'react-icons/fa';
<FaUserCircle />

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ religion: '', caste: '', minAge: '', maxAge: '' });

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get('/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    };
    fetchUser();
  }, [token]);

  const handleSearch = async () => {
    const res = await axios.get('/api/users/search', {
      headers: { Authorization: `Bearer ${token}` },
      params: filters,
    });
    setUsers(res.data);
  };

  const handleUpgrade = async (amount) => {
    try {
      // simulate upgrade process
      await axios.put('/api/users/profile', { plan: 'premium' }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Upgraded successfully!');
      setShowPaymentModal(false);
      window.location.reload();
    } catch (err) {
      alert('Upgrade failed');
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Welcome, {user?.name}</h2>
        <div style={{ position: 'relative' }}>
          <img
            src={user?.profileImage || 'https://via.placeholder.com/40'}
            onClick={() => setShowDropdown(!showDropdown)}
            style={{ width: 40, height: 40, borderRadius: '50%', cursor: 'pointer' }}
            alt="profile"
          />
          {showDropdown && (
            <div
              className="card p-2"
              style={{ position: 'absolute', top: 50, right: 0, zIndex: 1000 }}
            >
              <button className="btn btn-link" onClick={() => navigate('/edit-profile')}>Edit Profile</button>
              <button className="btn btn-link" onClick={() => navigate('/interests')}>Received Interests</button>
              <button className="btn btn-link" onClick={() => localStorage.clear() || navigate('/')}>Logout</button>
            </div>
          )}
        </div>
      </div>

      {!user?.plan || user?.plan === 'free' ? (
        <button className="btn btn-warning mt-3" onClick={() => setShowPaymentModal(true)}>
          <FaCrown /> Upgrade to Premium
        </button>
      ) : (
        <span className="badge bg-success mt-3">Premium Member</span>
      )}

      {showPaymentModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Choose a Plan</h5>
                <button type="button" className="btn-close" onClick={() => setShowPaymentModal(false)}></button>
              </div>
              <div className="modal-body">
                <button className="btn btn-outline-primary w-100 mb-2" onClick={() => handleUpgrade(1)}>1₹ - 1 Day Access</button>
                <button className="btn btn-outline-primary w-100 mb-2" onClick={() => handleUpgrade(10)}>10₹ - 10 Days Access</button>
                <button className="btn btn-outline-primary w-100" onClick={() => handleUpgrade(100)}>100₹ - 30 Days Access</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <hr className="mt-4" />

      <h4>Search Matches</h4>
      <div className="row g-2">
        <div className="col-md-3">
          <input placeholder="Religion" className="form-control" value={filters.religion} onChange={(e) => setFilters({ ...filters, religion: e.target.value })} />
        </div>
        <div className="col-md-3">
          <input placeholder="Caste" className="form-control" value={filters.caste} onChange={(e) => setFilters({ ...filters, caste: e.target.value })} />
        </div>
        <div className="col-md-3">
          <input type="number" placeholder="Min Age" className="form-control" value={filters.minAge} onChange={(e) => setFilters({ ...filters, minAge: e.target.value })} />
        </div>
        <div className="col-md-3">
          <input type="number" placeholder="Max Age" className="form-control" value={filters.maxAge} onChange={(e) => setFilters({ ...filters, maxAge: e.target.value })} />
        </div>
      </div>
      <button className="btn btn-primary mt-2" onClick={handleSearch}><FaSearch /> Search</button>

      <div className="mt-4">
        {users.map((u) => (
          <div key={u._id} className="card p-3 mb-2">
            <p><strong>{u.name}</strong></p>
            <p>Religion: {u.religion}, Caste: {u.caste}</p>
            <p>Age: {new Date().getFullYear() - new Date(u.dob).getFullYear()}</p>
            <p>Location: {u.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
