// ✅ File: src/pages/MutualMatches.js
import React, { useEffect, useState } from 'react';
import axios from '../axios';
import './ReceivedInterests.css';

const MutualMatches = () => {
  const [matches, setMatches] = useState([]);

  const fetchMutuals = async () => {
    try {
      const res = await axios.get('/users/mutual-matches', { withCredentials: true });
      setMatches(res.data);
    } catch (err) {
      console.error('Fetch mutual matches failed', err);
    }
  };

  useEffect(() => {
    fetchMutuals();
  }, []);

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  return (
    <div className="received-interests-container">
      <h2>💞 Mutual Matches</h2>
      {matches.length === 0 ? (
        <p>No mutual matches yet.</p>
      ) : (
        <div className="received-grid">
          {matches.map(match => (
            <div key={match._id} className="received-card">
              <img
                src={match.profileImage || 'https://via.placeholder.com/100'}
                alt={match.name}
                className="received-img"
              />
              <h4>{match.name}</h4>
              <p>{match.religion} | {match.caste}</p>
              <p>Age: {calculateAge(match.dob)}</p>
              <p><strong>Location:</strong> {match.location}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MutualMatches;
