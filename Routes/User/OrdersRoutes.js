const express = require('express');
const router = express.Router();
const userOrderController = require('../../Controllers/User/OrderController');


router.get('/user/:userId', userOrderController.getOrdersByUserId);

module.exports = router;
