const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load .env variables
dotenv.config();

// Import routes
const userRoutes = require('./routes/userRoutes');
const payuRoutes = require('./routes/payuRoutes');

// Middleware
app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api/users', userRoutes);
app.use('/api/payment', payuRoutes);

// Optional default route for testing
app.get('/', (req, res) => {
  res.send('✅ MatrimonyConnect API is running...');
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`✅ Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => console.error('❌ MongoDB connection failed:', err));
