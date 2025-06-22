// models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  password: { type: String, required: true },
  dob: Date,
  gender: String,
  religion: String,
  caste: String,
  location: String,
  profession: String,
  bio: String,
  preferences: {
    ageRange: [Number], // [minAge, maxAge]
    religion: String,
    caste: String,
  },
  profileImage: String,
  plan: { type: String, enum: ['free', 'premium'], default: 'free' },
  interestsSent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  interestsReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  // Inside User schema
acceptedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
rejectedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

}, {
  timestamps: true
});

// ✅ This is critical!
module.exports = mongoose.model('User', userSchema);
