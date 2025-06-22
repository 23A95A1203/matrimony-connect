const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

dotenv.config();

const userRoutes = require('./routes/userRoutes');
const payuRoutes = require('./routes/payuRoutes');
const interestRoutes = require('./routes/interests');
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api/interests', interestRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payment', payuRoutes);

app.get('/', (req, res) => {
  res.send('✅ MatrimonyConnect API is running...');
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`✅ Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => console.error('❌ MongoDB connection failed:', err));
