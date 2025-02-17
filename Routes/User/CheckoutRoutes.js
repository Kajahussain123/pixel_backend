const express = require('express');
const router = express.Router();
const checkoutController = require('../../Controllers/User/CheckoutController');

router.post('/create', checkoutController.checkout);

module.exports = router;
