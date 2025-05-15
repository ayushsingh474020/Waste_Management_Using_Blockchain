require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const productRoutes = require('./routes/product');
const userRoutes = require('./routes/users');
const wasteRoutes = require('./routes/waste');
const orderRoutes = require('./routes/orders.js');
const adminRoutes = require('./routes/admin');

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Admin middleware
const adminAuth = async (req, res, next) => {
  try {
    const userAddress = req.headers['x-user-address'];
    if (!userAddress) {
      return res.status(401).json({ message: 'No user address provided' });
    }

    const user = await require('./models/User').findOne({ address: userAddress.toLowerCase() });
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admin only' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Routes
app.use('/api/users', userRoutes);
app.use('/api/waste', wasteRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminAuth, adminRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});