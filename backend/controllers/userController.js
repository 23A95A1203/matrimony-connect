const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// --- Register User ---
exports.registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, phone, password: hashedPassword });

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- Login User ---
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.isAdmin ? 'admin' : 'user'
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- Get All Users (Optional: Admin use only) ---
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- Get Matches based on preferences ---
exports.getMatches = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user || !user.preferences) {
      return res.status(404).json({ message: 'No preferences found' });
    }

    const { ageRange, religion, caste } = user.preferences;
    const [minAge = 20, maxAge = 40] = ageRange.length === 2 ? ageRange : [20, 40];

    const today = new Date();
    const minDOB = new Date(today.getFullYear() - maxAge, today.getMonth(), today.getDate());
    const maxDOB = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());

    const matches = await User.find({
      _id: { $ne: user._id },
      dob: { $gte: minDOB, $lte: maxDOB },
      religion,
      caste
    }).select('-password');

    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- Get Current User Profile ---
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- Update Profile ---
exports.updateUserProfile = async (req, res) => {
  try {
    const updates = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
    res.json({ message: 'Profile updated', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- Send Interest ---
exports.sendInterest = async (req, res) => {
  const fromUserId = req.user.id;
  const { toUserId } = req.body;

  try {
    if (fromUserId === toUserId) {
      return res.status(400).json({ message: "Cannot send interest to yourself." });
    }

    const fromUser = await User.findById(fromUserId);
    const toUser = await User.findById(toUserId);

    if (!fromUser || !toUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (fromUser.interestsSent.includes(toUserId)) {
      return res.status(400).json({ message: "Interest already sent" });
    }

    fromUser.interestsSent.push(toUserId);
    toUser.interestsReceived.push(fromUserId);

    await fromUser.save();
    await toUser.save();

    res.status(200).json({ message: "Interest sent successfully" });
  } catch (error) {
    console.error("Send Interest Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// --- Get Received Interests ---
exports.getReceivedInterests = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('interestsReceived', 'name email religion caste dob location')
      .select('interestsReceived');

    res.json(user.interestsReceived);
  } catch (err) {
    console.error('Get Interests Error:', err);
    res.status(500).json({ message: err.message });
  }
};
exports.upgradePlan = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.plan = 'premium';
    await user.save();
    res.status(200).json({ message: 'Upgraded to premium' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};