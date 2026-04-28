const { db } = require('../config/database');
const notificationService = require('../services/notificationService');

exports.getNotifications = (req, res, next) => {
  try {
    const { customerId } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    const notifications = notificationService.getCustomerNotifications(customerId, limit, offset);
    res.json(notifications);
  } catch (err) { next(err); }
};

exports.getUnreadCount = (req, res, next) => {
  try {
    const count = notificationService.getUnreadCount(req.params.customerId);
    res.json({ unreadCount: count });
  } catch (err) { next(err); }
};

exports.markAsRead = (req, res, next) => {
  try {
    const { notificationId } = req.params;
    const { customerId } = req.body; // or from JWT
    const success = notificationService.markAsRead(notificationId, customerId);
    res.json({ success });
  } catch (err) { next(err); }
};

exports.markAllAsRead = (req, res, next) => {
  try {
    const result = notificationService.markAllAsRead(req.params.customerId);
    res.json(result);
  } catch (err) { next(err); }
};

exports.deleteNotification = (req, res, next) => {
  try {
    const stmt = db.prepare('DELETE FROM notifications WHERE id = ?');
    const result = stmt.run(req.params.notificationId);
    res.json({ success: result.changes > 0 });
  } catch (err) { next(err); }
};

exports.deleteOldNotifications = (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const result = notificationService.deleteOldNotifications(days);
    res.json(result);
  } catch (err) { next(err); }
};