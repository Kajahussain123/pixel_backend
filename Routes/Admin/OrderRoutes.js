const express = require('express');
const router = express.Router();
const adminOrderController = require('../../Controllers/Admin/OrderController');
const jwtVerify = require('../../Middlewares/jwtMiddleware')


router.get('/view',jwtVerify(['admin']), adminOrderController.getAllOrders); // Get all orders
router.get('/orders/:orderId',jwtVerify(['admin']), adminOrderController.getOrderById); // Get single order details
router.put('/orders/:orderId/status',jwtVerify(['admin']), adminOrderController.updateOrderStatus); // Update order status
router.delete('/delete/:orderId',jwtVerify(['admin']), adminOrderController.deleteOrder); // Delete order
router.get('/total/count', jwtVerify(['admin']),adminOrderController.getTotalOrdersCount); // Total orders count
router.get('/total/pixels',jwtVerify(['admin']), adminOrderController.getTotalPixelCount); // Total pixel count
router.get('/graphs', jwtVerify(['admin']),adminOrderController.getGraphData)
router.get('/user/:userId',jwtVerify(['admin']), adminOrderController.getOrdersByUserId);
router.get("/export-excel", adminOrderController.exportOrdersToExcel);

module.exports = router;
