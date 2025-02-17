const express = require('express');
const router = express.Router();
const notificationController = require('../../Controllers/User/NotificationController');

router.get('/view/:userId', notificationController.getUserNotifications); // Get all notifications for a user
router.delete('/delete/:notificationId', notificationController.deleteNotification); // Delete a notification

module.exports = router;
