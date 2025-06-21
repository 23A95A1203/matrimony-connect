// frontend/src/pages/ReceivedInterests.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReceivedInterests = () => {
  const [received, setReceived] = useState([]);

  const fetchInterests = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/users/received-interests', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReceived(res.data);
    } catch (err) {
      console.error('Fetch Interests Error:', err);
    }
  };

  useEffect(() => {
    fetchInterests();
  }, []);

  return (
    <div className="container mt-5">
      <h3>Interests Received</h3>
      {received.length === 0 ? (
        <p>No interests received yet.</p>
      ) : (
        <div className="row">
          {received.map(user => (
            <div key={user._id} className="col-md-4 mb-3">
              <div className="card p-3">
                <h5>{user.name}</h5>
                <p><b>Religion:</b> {user.religion}</p>
                <p><b>Caste:</b> {user.caste}</p>
                <p><b>Location:</b> {user.location}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReceivedInterests;
