// ✅ File: src/pages/EditProfile.js
import React, { useState, useEffect } from 'react';
import axios from '../axios';
import './EditProfile.css';

const EditProfile = () => {
  const [form, setForm] = useState({
    name: '',
    dob: '',
    gender: '',
    religion: '',
    caste: '',
    profession: '',
    location: '',
    bio: '',
    preferences: { ageRange: [], religion: '', caste: '' },
    profileImage: '',
    imageFile: null,
  });

  const [loading, setLoading] = useState(false);

  // ✅ Load existing profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/users/profile');
        const user = res.data;
        setForm(prev => ({
          ...prev,
          ...user,
          dob: user.dob?.substr(0, 10),
          preferences: user.preferences || { ageRange: [], religion: '', caste: '' },
        }));
      } catch (err) {
        console.error('❌ Profile fetch error', err);
      }
    };
    fetchProfile();
  }, []);

  // ✅ Handle field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['minAge', 'maxAge'].includes(name)) {
      setForm(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          ageRange: [
            name === 'minAge' ? Number(value) : prev.preferences.ageRange?.[0] || '',
            name === 'maxAge' ? Number(value) : prev.preferences.ageRange?.[1] || '',
          ],
        },
      }));
    } else if (['religion', 'caste'].includes(name)) {
      setForm(prev => ({
        ...prev,
        preferences: { ...prev.preferences, [name]: value },
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  // ✅ Upload to Cloudinary
  const handleImageUpload = async (file) => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'matrimony_upload'); // ✅ your preset
    data.append('cloud_name', 'dqmfyxz4b'); // ✅ your cloud name

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/dqmfyxz4b/image/upload', {
        method: 'POST',
        body: data,
      });
      const json = await res.json();
      return json.secure_url;
    } catch (err) {
      console.error('❌ Image upload failed:', err);
      return null;
    }
  };

  // ✅ Save form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = form.profileImage;
    if (form.imageFile) {
      const uploadedUrl = await handleImageUpload(form.imageFile);
      if (uploadedUrl) imageUrl = uploadedUrl;
    }

    try {
      const updatedForm = { ...form, profileImage: imageUrl };
      await axios.put('/users/profile', updatedForm);
      alert('✅ Profile updated successfully');
    } catch (err) {
      console.error('❌ Profile update error', err);
      alert('❌ Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <input className="form-control my-2" name="name" value={form.name} onChange={handleChange} placeholder="Full Name" />
        <input className="form-control my-2" name="dob" type="date" value={form.dob} onChange={handleChange} />
        <input className="form-control my-2" name="gender" value={form.gender} onChange={handleChange} placeholder="Gender" />
        <input className="form-control my-2" name="religion" value={form.religion} onChange={handleChange} placeholder="Religion" />
        <input className="form-control my-2" name="caste" value={form.caste} onChange={handleChange} placeholder="Caste" />
        <input className="form-control my-2" name="profession" value={form.profession} onChange={handleChange} placeholder="Profession" />
        <input className="form-control my-2" name="location" value={form.location} onChange={handleChange} placeholder="Location" />
        <textarea className="form-control my-2" name="bio" value={form.bio} onChange={handleChange} placeholder="About You" />

        <h5 className="mt-3">Match Preferences</h5>
        <div className="d-flex gap-2">
          <input name="minAge" className="form-control" placeholder="Min Age" value={form.preferences.ageRange?.[0] || ''} onChange={handleChange} />
          <input name="maxAge" className="form-control" placeholder="Max Age" value={form.preferences.ageRange?.[1] || ''} onChange={handleChange} />
        </div>
        <input name="religion" className="form-control my-2" placeholder="Preferred Religion" value={form.preferences.religion || ''} onChange={handleChange} />
        <input name="caste" className="form-control my-2" placeholder="Preferred Caste" value={form.preferences.caste || ''} onChange={handleChange} />

        <h5 className="mt-3">Upload Profile Image</h5>
        <input
          type="file"
          accept="image/*"
          className="form-control mb-3"
          onChange={(e) => setForm(prev => ({ ...prev, imageFile: e.target.files[0] }))}
        />

        {/* ✅ Show preview if already uploaded */}
        {form.profileImage && (
          <div className="mb-3">
            <img src={form.profileImage} alt="Preview" style={{ width: 120, height: 120, borderRadius: '50%' }} />
          </div>
        )}

        <button className="btn btn-success mt-2" type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
