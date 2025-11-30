const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/getcart', cartController.getCart);
router.post('/savetocart', cartController.saveToCart);
router.delete('/delfromcart/:id', cartController.deleteFromCart);

module.exports = router;
