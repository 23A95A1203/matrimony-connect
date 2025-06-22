// ✅ File: src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from '../axios';
import { useNavigate } from 'react-router-dom';
import {
  FaUserCircle, FaCrown, FaHeart, FaEdit, FaSignOutAlt, FaSearch
} from 'react-icons/fa';
import './Dashboard.css';
 // optional if you want separate Navbar layout

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [interestsCount, setInterestsCount] = useState(0);
  const [sentIds, setSentIds] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await axios.get('/users/profile');
        setUser(profileRes.data);

        const matchesRes = await axios.get('/users/matches');
        setMatches(matchesRes.data);
        setFilteredMatches(matchesRes.data);

        const interestRes = await axios.get('/users/received-interests');
        setInterestsCount(interestRes.data.length);

        const sent = profileRes.data?.interestsSent || [];
        setSentIds(sent.map(id => id.toString()));
      } catch (err) {
        console.error("❌ Dashboard fetch failed", err);
        navigate('/login');
      }
    };
    fetchData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post('/users/logout');
      navigate('/');
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    setFilteredMatches(
      matches.filter(match =>
        match.name.toLowerCase().includes(value) ||
        (match.religion && match.religion.toLowerCase().includes(value)) ||
        (match.caste && match.caste.toLowerCase().includes(value))
      )
    );
  };

  const handleSendInterest = async (toUserId) => {
    try {
      const res = await axios.post('/interests/send', { toUserId }, { withCredentials: true });
      alert(res.data.message);
      setSentIds(prev => [...prev, toUserId]);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send interest');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h3 className="logo-text">💍 Matrimony Connect</h3>

        <div className="search-box-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="search-box"
            placeholder="Search matches..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {/* ✅ 💞 Mutual Matches in between Search and Interests */}
        <button className="mutual-btn" onClick={() => navigate('/mutual-matches')}>
           Mutual Matches 💞
        </button>

        <button className="interests-btn" onClick={() => navigate('/received-interests')}>
          <FaHeart /> Interests ({interestsCount})
        </button>

        {user?.plan !== 'premium' && (
          <button className="upgrade-navbar-btn" onClick={() => navigate('/upgrade')}>
            <FaCrown /> Upgrade to Premium
          </button>
        )}

        <div className="profile-icon" onClick={() => setShowDropdown(!showDropdown)}>
          <FaUserCircle size={32} />
          {showDropdown && (
            <div className="dropdown-menu-dashboard">
              <button onClick={() => navigate('/edit-profile')}><FaEdit /> Edit Profile</button>
              <button onClick={handleLogout}><FaSignOutAlt /> Logout</button>
            </div>
          )}
        </div>
      </div>

      <div className="welcome-section">
        <h2>Welcome, {user?.name?.toUpperCase()} 👋</h2>
        {user?.plan === 'premium' && (
          <span className="premium-badge">🌟 Premium Member</span>
        )}
      </div>

      <div className="matches-section">
        <h3>💘 Suggested Matches</h3>
        {filteredMatches.length === 0 ? (
          <p>No matches found based on your preferences or search.</p>
        ) : (
          <div className="match-cards">
            {filteredMatches.map((match) => (
              <div key={match._id} className="match-card">
                <img
                  src={match.profileImage || 'https://via.placeholder.com/100'}
                  alt={match.name}
                />
                <h5>{match.name}</h5>
                <p>{match.religion} | {match.caste}</p>
                <p>Age: {calculateAge(match.dob)}</p>

                {sentIds.includes(match._id) ? (
                  <p className="interest-sent-text">✅ Interest Sent</p>
                ) : (
                  <button
                    onClick={() => handleSendInterest(match._id)}
                    className="send-interest-btn"
                  >
                    ❤️ Send Interest
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
