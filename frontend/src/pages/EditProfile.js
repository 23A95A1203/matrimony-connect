// src/pages/EditProfile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditProfile = () => {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [religion, setReligion] = useState('');
  const [caste, setCaste] = useState('');
  const [profession, setProfession] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [preferences, setPreferences] = useState({
    ageRange: [],
    religion: '',
    caste: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await axios.get('/api/users/profile', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const user = res.data;
      setName(user.name);
      setDob(user.dob?.substr(0, 10));
      setGender(user.gender);
      setReligion(user.religion);
      setCaste(user.caste);
      setProfession(user.profession);
      setLocation(user.location);
      setBio(user.bio);
      setPreferences(user.preferences || {});
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = {
      name, dob, gender, religion, caste, profession, location, bio, preferences
    };
    try {
      await axios.put('/api/users/profile', updatedData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Profile updated successfully');
    } catch (error) {
      alert('Update failed');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <input className="form-control my-2" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
        <input className="form-control my-2" type="date" value={dob} onChange={e => setDob(e.target.value)} />
        <input className="form-control my-2" placeholder="Gender" value={gender} onChange={e => setGender(e.target.value)} />
        <input className="form-control my-2" placeholder="Religion" value={religion} onChange={e => setReligion(e.target.value)} />
        <input className="form-control my-2" placeholder="Caste" value={caste} onChange={e => setCaste(e.target.value)} />
        <input className="form-control my-2" placeholder="Profession" value={profession} onChange={e => setProfession(e.target.value)} />
        <input className="form-control my-2" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
        <textarea className="form-control my-2" placeholder="About You" value={bio} onChange={e => setBio(e.target.value)} />

        <h5 className="mt-4">Match Preferences</h5>
        <div className="d-flex gap-2">
          <input className="form-control" type="number" placeholder="Min Age"
            value={preferences.ageRange?.[0] || ''}
            onChange={e => setPreferences(prev => ({
              ...prev,
              ageRange: [Number(e.target.value), prev.ageRange?.[1] || '']
            }))} />
          <input className="form-control" type="number" placeholder="Max Age"
            value={preferences.ageRange?.[1] || ''}
            onChange={e => setPreferences(prev => ({
              ...prev,
              ageRange: [prev.ageRange?.[0] || '', Number(e.target.value)]
            }))} />
        </div>
        <input className="form-control my-2" placeholder="Preferred Religion"
          value={preferences.religion || ''}
          onChange={e => setPreferences(prev => ({ ...prev, religion: e.target.value }))} />
        <input className="form-control my-2" placeholder="Preferred Caste"
          value={preferences.caste || ''}
          onChange={e => setPreferences(prev => ({ ...prev, caste: e.target.value }))} />

        <button className="btn btn-success mt-3">Save Changes</button>
      </form>
    </div>
  );
};

export default EditProfile;
