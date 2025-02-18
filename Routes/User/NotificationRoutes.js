const express = require('express');
const router = express.Router();
const notificationController = require('../../Controllers/User/NotificationController');
const jwtVerify = require('../../Middlewares/jwtMiddleware')


router.get('/view/:userId', jwtVerify(['user']),notificationController.getUserNotifications); // Get all notifications for a user
router.delete('/delete/:notificationId',jwtVerify(['user']), notificationController.deleteNotification); // Delete a notification

module.exports = router;
