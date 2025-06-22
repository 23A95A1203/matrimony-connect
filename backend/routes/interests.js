const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// POST /api/interests/send
router.post('/send', protect, async (req, res) => {
  const fromUserId = req.user._id;
  const { toUserId } = req.body;

  try {
    if (fromUserId.toString() === toUserId.toString()) {
      return res.status(400).json({ message: 'Cannot send interest to yourself' });
    }

    const fromUser = await User.findById(fromUserId);
    const toUser = await User.findById(toUserId);

    if (!fromUser || !toUser) return res.status(404).json({ message: 'User not found' });

    if (fromUser.interestsSent.includes(toUserId)) {
      return res.status(400).json({ message: 'Already sent interest' });
    }

    fromUser.interestsSent.push(toUserId);
    toUser.interestsReceived.push(fromUserId);

    await fromUser.save();
    await toUser.save();

    res.json({ message: 'Interest sent successfully' });
  } catch (err) {
    console.error('Send Interest Error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});
// ✅ Route: Accept Interest
router.post('/accept', protect, async (req, res) => {
  const { fromUserId } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.interestsReceived.includes(fromUserId)) {
      return res.status(400).json({ message: 'Interest not found' });
    }

    // Add to accepted list
    user.acceptedUsers.push(fromUserId);
    user.interestsReceived.pull(fromUserId);
    await user.save();

    res.status(200).json({ message: 'Interest accepted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Route: Reject Interest
router.post('/reject', protect, async (req, res) => {
  const { fromUserId } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.interestsReceived.includes(fromUserId)) {
      return res.status(400).json({ message: 'Interest not found' });
    }

    user.rejectedUsers.push(fromUserId);
    user.interestsReceived.pull(fromUserId);
    await user.save();

    res.status(200).json({ message: 'Interest rejected' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
