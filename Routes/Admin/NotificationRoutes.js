const express = require('express');
const router = express.Router();
const notificationController = require('../../Controllers/Admin/NotificationController');
const jwtVerify = require('../../Middlewares/jwtMiddleware')


router.post('/send', jwtVerify(['admin']), notificationController.sendNotification); // Send notification to a user
router.get('/view/:userId',jwtVerify(['admin']), notificationController.getUserNotifications); // Get all notifications for a user
router.patch('/read/:notificationId',jwtVerify(['admin']), notificationController.markAsRead); // Mark notification as read
router.delete('/:notificationId',jwtVerify(['admin']), notificationController.deleteNotification); // Delete a notification

module.exports = router;
