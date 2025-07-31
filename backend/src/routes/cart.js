const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

let cart = [];

router.get('/', (req, res) => {
  res.json(cart);
});

router.post('/', async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    const existing = cart.find(item => item.product._id.equals(productId));
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ product, quantity });
    }
    res.json(cart);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add to cart' });
  }
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  cart = cart.filter(item => !item.product._id.equals(id));
  res.json(cart);
});

module.exports = router;
