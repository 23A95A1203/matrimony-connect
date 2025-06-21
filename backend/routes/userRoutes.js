const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getMatches,
  sendInterest,
  getReceivedInterests,
  upgradePlan 
} = require('../controllers/userController');

// Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/matches', protect, getMatches);
router.post('/send-interest', protect, sendInterest);
// ✅ Correct location
// Add this line at the right place
router.get('/received-interests', protect, getReceivedInterests);
router.put('/upgrade', protect, upgradePlan);

module.exports = router;
