const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// @route   POST /api/orders
// @desc    Create a new order
// @access  Public or Protected (as per your app)
router.post('/', async (req, res) => {
  const { name, address, pincode, mobile, email, productId, walletAddress } = req.body;
  console.log("Inside post method");

  if (!name || !address || !pincode || !mobile || !email || !productId || !walletAddress) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newOrder = new Order({ name, address, pincode, mobile, email, productId, walletAddress });
    const savedOrder = await newOrder.save();
    console.log("Saved");
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error('Error saving order:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
