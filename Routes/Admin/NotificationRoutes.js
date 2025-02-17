const express = require('express');
const router = express.Router();
const notificationController = require('../../Controllers/Admin/NotificationController');

router.post('/send', notificationController.sendNotification); // Send notification to a user
router.get('/view/:userId', notificationController.getUserNotifications); // Get all notifications for a user
router.patch('/read/:notificationId', notificationController.markAsRead); // Mark notification as read
router.delete('/:notificationId', notificationController.deleteNotification); // Delete a notification

module.exports = router;
