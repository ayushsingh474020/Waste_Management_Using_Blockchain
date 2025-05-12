const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// @route   GET /api/products
// @desc    Get all available products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/products/:id
// @desc    Get a specific product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    res.json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/products
// @desc    Add a new product (admin only)
// You can add auth middleware if needed
router.post('/', async (req, res) => {
  try {
    const { name, description, image, pointsRequired, inStock } = req.body;

    const newProduct = new Product({
      name,
      description,
      image,
      pointsRequired,
      inStock,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PATCH /api/products/:id
// @desc    Update product stock or details (admin only)
router.patch('/:id', async (req, res) => {
  try {
    const updates = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    if (!updatedProduct) return res.status(404).json({ error: 'Product not found' });

    res.json(updatedProduct);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ error: 'Product not found' });

    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
