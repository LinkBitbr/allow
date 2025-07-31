const express = require('express');
const router = express.Router();

// TODO: Integração com API de pagamento aqui
router.post('/', (req, res) => {
  // placeholder for future payment integration
  res.json({ message: 'Checkout endpoint - payment integration pending' });
});

module.exports = router;
