const express = require('express');
const router = express.Router();
const User = require('../models/User');
const crypto = require('crypto');
const blockchainService = require('../services/blockchain');

// Get user profile
router.get('/:address', async (req, res) => {
    try {
        const user = await User.findOne({ address: req.params.address.toLowerCase() });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Get user points from blockchain
        const points = await blockchainService.getUserPoints(user.address);
        
        res.json({
            ...user.toJSON(),
            points: points.toString()
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/register", async (req, res) => {
    const { address, role } = req.body;
    if (!address || !role) return res.status(400).json({ message: "Address and role required" });
  
    const existing = await User.findOne({ address: address.toLowerCase() });
    if (existing) return res.status(400).json({ message: "User already registered" });
  
    const user = await User.create({ address: address.toLowerCase(), role });
    res.status(201).json(user);
});

// Create or update user
router.post('/', async (req, res) => {
    try {
        const { address, role } = req.body;
        
        let user = await User.findOne({ address: address.toLowerCase() });
        if (user) {
            user.role = role || user.role;
        } else {
            user = new User({
                address: address.toLowerCase(),
                role: role || 'citizen',
                nonce: crypto.randomBytes(32).toString('hex')
            });
        }
        
        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update user role (admin only)
router.patch('/:address/role', async (req, res) => {
    try {
        const user = await User.findOne({ address: req.params.address.toLowerCase() });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = req.body.role;
        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;