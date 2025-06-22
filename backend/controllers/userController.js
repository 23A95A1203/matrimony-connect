const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// ✅ Register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, phone, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// ✅ Login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400000,
    });

    res.json({
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        profileImage: user.profileImage,
        plan: user.plan || 'free',
      },
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// ✅ Get Profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update Profile
exports.updateUserProfile = async (req, res) => {
  try {
    const updates = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json({ message: 'Profile updated', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Upload Profile Image
exports.uploadProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.profileImage = req.file?.path || '';
    await user.save();

    res.json({ message: 'Profile image uploaded successfully', imageUrl: user.profileImage });
  } catch (err) {
    res.status(500).json({ message: 'Image upload failed' });
  }
};

// ✅ Get Matches
exports.getMatches = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || !user.preferences) return res.status(404).json({ message: 'No preferences found' });

    const { ageRange, religion, caste } = user.preferences;
    const [minAge = 20, maxAge = 40] = ageRange.length === 2 ? ageRange : [20, 40];

    const today = new Date();
    const minDOB = new Date(today.getFullYear() - maxAge, today.getMonth(), today.getDate());
    const maxDOB = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());

    const matches = await User.find({
      _id: { $ne: user._id },
      dob: { $gte: minDOB, $lte: maxDOB },
      religion,
      caste,
    }).select('-password');

    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Send Interest
exports.sendInterest = async (req, res) => {
  const fromUserId = req.user._id;
  const { toUserId } = req.body;

  try {
    if (fromUserId.toString() === toUserId.toString()) {
      return res.status(400).json({ message: 'Cannot send interest to yourself.' });
    }

    const fromUser = await User.findById(fromUserId);
    const toUser = await User.findById(toUserId);
    if (!fromUser || !toUser) return res.status(404).json({ message: 'User not found' });

    if (fromUser.interestsSent.includes(toUserId)) {
      return res.status(400).json({ message: 'Interest already sent' });
    }

    fromUser.interestsSent.push(toUserId);
    toUser.interestsReceived.push(fromUserId);
    await fromUser.save();
    await toUser.save();

    res.status(200).json({ message: 'Interest sent successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Received Interests
exports.getReceivedInterests = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('interestsReceived', 'name email religion caste dob location profileImage')
      .select('interestsReceived');

    res.json(user.interestsReceived);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Count Interests
exports.getInterestsCount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const count = user.interestsReceived?.length || 0;
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch interests count' });
  }
};

// ✅ Upgrade Plan
exports.upgradePlan = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.plan = 'premium';
    await user.save();
    res.status(200).json({ message: 'Upgraded to premium' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Logout
exports.logoutUser = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
};
