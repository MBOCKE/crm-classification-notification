const NotificationModel = require('../models/Notification');

class NotificationService {
  createNotification({ customerId, title, message, type, metadata = null }) {
    return NotificationModel.create({
      customer_id: customerId,
      title,
      message,
      type,
      metadata
    });
  }

  getCustomerNotifications(customerId, limit = 50, offset = 0) {
    return NotificationModel.findByCustomer(customerId, limit, offset);
  }

  getUnreadCount(customerId) {
    return NotificationModel.countUnread(customerId);
  }

  markAsRead(notificationId, customerId) {
    return NotificationModel.markAsRead(notificationId, customerId);
  }

  markAllAsRead(customerId) {
    const count = NotificationModel.markAllAsRead(customerId);
    return { success: true, count };
  }

  deleteOldNotifications(daysOld = 30) {
    const deletedCount = NotificationModel.deleteOld(daysOld);
    return { deletedCount };
  }
}

module.exports = new NotificationService();