const Notification = require('../../Models/Admin/NotificationModel');

// Get Notifications for a User (with count)
exports.getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch notifications sorted by latest
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });

    // Count unread notifications
    const unreadCount = await Notification.countDocuments({ userId, isRead: false });

    res.status(200).json({
      notifications,
      unreadCount, // ✅ Return count of unread notifications
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Mark a Notification as Read
exports.markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true }, // ✅ Mark as read
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json({ message: 'Notification marked as read', notification });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Mark All Notifications as Read for a User
exports.markAllNotificationsAsRead = async (req, res) => {
  try {
    const { userId } = req.params;

    await Notification.updateMany({ userId, isRead: false }, { isRead: true });

    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a Notification
exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findByIdAndDelete(notificationId);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
