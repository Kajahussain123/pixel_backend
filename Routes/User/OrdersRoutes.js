const express = require('express');
const router = express.Router();
const userOrderController = require('../../Controllers/User/OrderController');
const jwtVerify = require('../../Middlewares/jwtMiddleware')

router.get('/user/:userId',jwtVerify(['user']), userOrderController.getOrdersByUserId);

module.exports = router;
