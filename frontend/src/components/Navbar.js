import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaUserCircle, FaHeart } from 'react-icons/fa';
import axios from '../axios';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [interestsCount, setInterestsCount] = useState(0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    const fetchInterests = async () => {
      if (!user) return;
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/users/received-interests', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setInterestsCount(res.data.length);
      } catch (err) {
        console.error('Failed to fetch interests:', err);
      }
    };

    fetchInterests();
  }, [user]);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 sticky-top">
      <Link className="navbar-brand" to="/">💖 Matrimony Connect</Link>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/">Home</Link>
          </li>

          {user && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/search">Search</Link>
              </li>
<button className="interests-btn" onClick={() => navigate('/mutual-matches')}>
  💞 Mutual Matches
</button>

              {user?.plan === 'free' && (
                <li className="nav-item">
                  <Link className="nav-link text-warning" to="/upgrade">Upgrade to Premium</Link>
                </li>
              )}

              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle d-flex align-items-center" href="/" role="button" data-bs-toggle="dropdown">
                  <FaUserCircle size={20} className="me-1" /> {user.name?.split(' ')[0]}
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item d-flex justify-content-between align-items-center" to="/received-interests">
                      <span><FaHeart className="text-danger me-1" /> Received Interests</span>
                      <span className="badge bg-danger">{interestsCount}</span>
                    </Link>
                  </li>
                  <li><Link className="dropdown-item" to="/profile">View / Edit Profile</Link></li>
                  <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                </ul>
              </li>
            </>
          )}

          {!user && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/register">Register</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
