// backend/middleware/premiumMiddleware.js
const premiumOnly = (req, res, next) => {
  if (req.user.plan !== 'premium') {
    return res.status(403).json({ message: 'Premium plan required to access this feature' });
  }
  next();
};

module.exports = { premiumOnly };
