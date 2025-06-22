// ✅ File: src/pages/ReceivedInterests.js
import React, { useEffect, useState } from 'react';
import axios from '../axios';
import './ReceivedInterests.css';

const ReceivedInterests = () => {
  const [received, setReceived] = useState([]);

  const fetchInterests = async () => {
    try {
      const res = await axios.get('/users/received-interests', {
        withCredentials: true,
      });
      setReceived(res.data);
    } catch (err) {
      console.error('Fetch Interests Error:', err);
    }
  };

  useEffect(() => {
    fetchInterests();
  }, []);

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const handleAction = async (fromUserId, action) => {
    try {
      const res = await axios.post(`/interests/${action}`, { fromUserId }, { withCredentials: true });
      alert(res.data.message);
      fetchInterests(); // refresh list
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  return (
    <div className="received-interests-container">
      <h2>❤️ Interests Received</h2>
      {received.length === 0 ? (
        <p>No interests received yet.</p>
      ) : (
        <div className="received-grid">
          {received.map(user => (
            <div key={user._id} className="received-card">
              <img
                src={user.profileImage || 'https://via.placeholder.com/100'}
                alt={user.name}
                className="received-img"
              />
              <h4>{user.name}</h4>
              <p>{user.religion} | {user.caste}</p>
              <p><strong>Age:</strong> {calculateAge(user.dob)}</p>
              <p><strong>Location:</strong> {user.location}</p>
              <div className="action-buttons">
                <button
                  className="accept-btn"
                  onClick={() => handleAction(user._id, 'accept')}
                >
                  ✅ Accept
                </button>
                <button
                  className="reject-btn"
                  onClick={() => handleAction(user._id, 'reject')}
                >
                  ❌ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReceivedInterests;
