import React, { useState, useEffect } from 'react';
import axios from '../axios'; // ✅ use the custom instance
import UpgradePlan from '../components/UpgradePlan';

const Profile = () => {
  const token = localStorage.getItem('token');
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: '',
    dob: '',
    gender: '',
    religion: '',
    caste: '',
    profession: '',
    location: '',
    bio: '',
    preferences: {
      ageRange: [],
      religion: '',
      caste: ''
    },
    imageFile: null
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = res.data;
        setUser(data);
        setForm({
          name: data.name || '',
          dob: data.dob?.substr(0, 10) || '',
          gender: data.gender || '',
          religion: data.religion || '',
          caste: data.caste || '',
          profession: data.profession || '',
          location: data.location || '',
          bio: data.bio || '',
          preferences: {
            ageRange: data.preferences?.ageRange || [],
            religion: data.preferences?.religion || '',
            caste: data.preferences?.caste || ''
          },
          imageFile: null
        });
        if (!data.dob || !data.gender) setEditMode(true);
      } catch (err) {
        console.error('Failed to load profile', err);
        setEditMode(true);
      }
    };
    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'minAge' || name === 'maxAge') {
      setForm((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          ageRange: [
            name === 'minAge' ? Number(value) : prev.preferences.ageRange?.[0] || '',
            name === 'maxAge' ? Number(value) : prev.preferences.ageRange?.[1] || ''
          ]
        }
      }));
    } else if (['religion', 'caste'].includes(name)) {
      setForm((prev) => ({
        ...prev,
        preferences: { ...prev.preferences, [name]: value }
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/users/profile', form, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Upload profile image if exists
      if (form.imageFile) {
        const formData = new FormData();
        formData.append('image', form.imageFile);

        await axios.post('/api/users/upload-profile-image', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      alert('Profile updated successfully');
      setEditMode(false);
      window.location.reload(); // reload to fetch new image if needed
    } catch (err) {
      alert('Failed to update profile');
      console.error(err);
    }
  };

  if (!user && !editMode) return <div className="container mt-4">Loading...</div>;

  return (
    <div className="container mt-4">
      <h2>Profile</h2>

      {/* ✅ Show profile image if exists */}
      {user?.image && (
        <div className="mb-3">
          <img
            src={`http://localhost:5000/uploads/${user.image}`}
            alt="Profile"
            style={{ width: 150, height: 150, objectFit: 'cover', borderRadius: '50%' }}
          />
        </div>
      )}

      {!editMode ? (
        <>
          <p><strong>Plan:</strong> {user?.plan}</p>
          {user?.plan === 'free' && <UpgradePlan />}
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Date of Birth:</strong> {user.dob?.substr(0, 10)}</p>
          <p><strong>Gender:</strong> {user.gender}</p>
          <p><strong>Religion:</strong> {user.religion}</p>
          <p><strong>Caste:</strong> {user.caste}</p>
          <p><strong>Profession:</strong> {user.profession}</p>
          <p><strong>Location:</strong> {user.location}</p>
          <p><strong>About You:</strong> {user.bio}</p>
          <h5>Match Preferences</h5>
          <p><strong>Age Range:</strong> {user.preferences?.ageRange?.join(' - ')}</p>
          <p><strong>Preferred Religion:</strong> {user.preferences?.religion}</p>
          <p><strong>Preferred Caste:</strong> {user.preferences?.caste}</p>
          <button className="btn btn-primary mt-2" onClick={() => setEditMode(true)}>Edit Profile</button>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <input className="form-control my-2" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} />
          <input className="form-control my-2" type="date" name="dob" value={form.dob} onChange={handleChange} />
          <input className="form-control my-2" name="gender" placeholder="Gender" value={form.gender} onChange={handleChange} />
          <input className="form-control my-2" name="religion" placeholder="Religion" value={form.religion} onChange={handleChange} />
          <input className="form-control my-2" name="caste" placeholder="Caste" value={form.caste} onChange={handleChange} />
          <input className="form-control my-2" name="profession" placeholder="Profession" value={form.profession} onChange={handleChange} />
          <input className="form-control my-2" name="location" placeholder="Location" value={form.location} onChange={handleChange} />
          <textarea className="form-control my-2" name="bio" placeholder="About You" value={form.bio} onChange={handleChange} />

          <h5 className="mt-4">Match Preferences</h5>
          <div className="d-flex gap-2">
            <input className="form-control" name="minAge" type="number" placeholder="Min Age"
              value={form.preferences.ageRange?.[0] || ''}
              onChange={handleChange} />
            <input className="form-control" name="maxAge" type="number" placeholder="Max Age"
              value={form.preferences.ageRange?.[1] || ''}
              onChange={handleChange} />
          </div>
          <input className="form-control my-2" name="religion" placeholder="Preferred Religion"
            value={form.preferences.religion || ''} onChange={handleChange} />
          <input className="form-control my-2" name="caste" placeholder="Preferred Caste"
            value={form.preferences.caste || ''} onChange={handleChange} />

          {/* ✅ Profile Image Upload */}
          <h5 className="mt-4">Upload Profile Image</h5>
          <input
            type="file"
            accept="image/*"
            className="form-control mb-3"
            onChange={(e) => setForm((prev) => ({ ...prev, imageFile: e.target.files[0] }))}
          />

          <button className="btn btn-success mt-3" type="submit">Save</button>
        </form>
      )}
    </div>
  );
};

export default Profile;
