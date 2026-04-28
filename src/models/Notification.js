const { db } = require('../config/database');

class NotificationModel {
  create(notification) {
    const { customer_id, title, message, type, metadata } = notification;
    const stmt = db.prepare(`
      INSERT INTO notifications (customer_id, title, message, type, metadata)
      VALUES (?, ?, ?, ?, ?)
    `);
    const info = stmt.run(customer_id, title, message, type, metadata || null);
    return { id: info.lastInsertRowid, ...notification };
  }

  findByCustomer(customerId, limit = 50, offset = 0) {
    const stmt = db.prepare(`
      SELECT id, title, message, type, is_read, created_at, read_at, metadata
      FROM notifications
      WHERE customer_id = ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `);
    return stmt.all(customerId, limit, offset);
  }

  countUnread(customerId) {
    const stmt = db.prepare('SELECT COUNT(*) as count FROM notifications WHERE customer_id = ? AND is_read = 0');
    return stmt.get(customerId).count;
  }

  markAsRead(notificationId, customerId) {
    const stmt = db.prepare(`
      UPDATE notifications
      SET is_read = 1, read_at = CURRENT_TIMESTAMP
      WHERE id = ? AND customer_id = ?
    `);
    const result = stmt.run(notificationId, customerId);
    return result.changes > 0;
  }

  markAllAsRead(customerId) {
    const stmt = db.prepare(`
      UPDATE notifications
      SET is_read = 1, read_at = CURRENT_TIMESTAMP
      WHERE customer_id = ? AND is_read = 0
    `);
    const result = stmt.run(customerId);
    return result.changes;
  }

  deleteOld(daysOld = 30) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - daysOld);
    const stmt = db.prepare('DELETE FROM notifications WHERE created_at < ? AND is_read = 1');
    const result = stmt.run(cutoff.toISOString());
    return result.changes;
  }

  deleteById(notificationId) {
    const stmt = db.prepare('DELETE FROM notifications WHERE id = ?');
    const result = stmt.run(notificationId);
    return result.changes > 0;
  }
}

module.exports = new NotificationModel();