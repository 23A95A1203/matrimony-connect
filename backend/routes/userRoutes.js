const express = require('express');
const router = express.Router();
const crypto = require('crypto');

const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  uploadProfileImage,
  getMatches,
  sendInterest,
  getReceivedInterests,
  upgradePlan,
} = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// Auth
router.post('/register', registerUser);
router.post('/login', loginUser);

// Profile
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// Image Upload
router.post('/upload-profile-image', protect, upload.single('image'), uploadProfileImage);

// Matchmaking + Interests
router.get('/matches', protect, getMatches);
router.post('/send-interest', protect, sendInterest);
router.get('/received-interests', protect, getReceivedInterests);

// Plan Upgrade
router.put('/upgrade', protect, upgradePlan);

// PayU hash (optional)
const MERCHANT_KEY = process.env.PAYU_MERCHANT_KEY || 'gtKFFx';
const SALT = process.env.PAYU_MERCHANT_SALT || '4R38IvwiV57FwVpsgOvTXBdLE4tHUXFW';

router.post('/payu-hash', (req, res) => {
  const { amount, productinfo, firstname, email, txnid } = req.body;
  const hashString = [
    MERCHANT_KEY, txnid, amount, productinfo, firstname, email,
    '', '', '', '', '', '', '', '', '', SALT,
  ].join('|');

  const hash = crypto.createHash('sha512').update(hashString).digest('hex');
  res.json({ hash });
});

module.exports = router;
