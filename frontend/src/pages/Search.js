import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Search = () => {
  const [matches, setMatches] = useState([]);

  const fetchMatches = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/users/matches', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMatches(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const sendInterest = async (toUserId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/users/send-interest',
        { toUserId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Interest sent successfully');
    } catch (err) {
      alert('Failed to send interest');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  return (
    <div className="container mt-5">
      <h3>Match Suggestions</h3>
      {matches.length === 0 && <p>No matches found.</p>}
      <div className="row">
        {matches.map((match) => (
          <div key={match._id} className="col-md-4 mb-4">
            <div className="card p-3">
              <h5>{match.name}</h5>
              <p><b>Religion:</b> {match.religion}</p>
              <p><b>Caste:</b> {match.caste}</p>
              <p><b>Location:</b> {match.location}</p>
              <button
                className="btn btn-outline-success"
                onClick={() => sendInterest(match._id)}
              >
                Send Interest ❤️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;