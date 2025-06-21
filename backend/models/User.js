const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
  dob: Date,
  religion: String,
  caste: String,
  location: String,
  profession: String,
  preferences: {
    ageRange: [Number],
    religion: String,
    caste: String,
  },
  interestsSent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  interestsReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isAdmin: { type: Boolean, default: false },
plan: {
  type: String,
  enum: ['free', 'premium'],
  default: 'free'
}
});

module.exports = mongoose.model('User', userSchema);
