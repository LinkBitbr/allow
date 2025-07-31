const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// GET /products?category=phone&tag=Oferta
router.get('/', async (req, res) => {
  const { category, tag } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (tag) filter.tag = tag;
  try {
    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// POST /products
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create product' });
  }
});

module.exports = router;
