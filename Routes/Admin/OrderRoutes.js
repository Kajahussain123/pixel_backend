const express = require('express');
const router = express.Router();
const adminOrderController = require('../../Controllers/Admin/OrderController');

router.get('/view', adminOrderController.getAllOrders); // Get all orders
router.get('/orders/:orderId', adminOrderController.getOrderById); // Get single order details
router.put('/orders/:orderId/status', adminOrderController.updateOrderStatus); // Update order status
router.delete('/orders/:orderId', adminOrderController.deleteOrder); // Delete order
router.get('/total/count', adminOrderController.getTotalOrdersCount); // Total orders count
router.get('/total/pixels', adminOrderController.getTotalPixelCount); // Total pixel count
router.get('/graphs',adminOrderController.getGraphData)
router.get('/user/:userId', adminOrderController.getOrdersByUserId);

module.exports = router;
