// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  profileImage: {
  type: String,
  default: '',
},

  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  dob: Date,
  religion: String,
  caste: String,
  location: String,
  profession: String,
  preferences: {
    ageRange: {
      type: [Number],
      default: [20, 40]
    },
    religion: String,
    caste: String
  },
  interestsSent: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  ],
  interestsReceived: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  ],
  isAdmin: {
    type: Boolean,
    default: false
  },
  plan: {
    type: String,
    enum: ['free', 'premium'],
    default: 'free'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
