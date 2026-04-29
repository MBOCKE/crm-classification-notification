const { db } = require('../config/database');

const parseMetadata = (metadata) => {
  try {
    return JSON.parse(metadata);
  } catch {
    return {};
  }
};

exports.getSummary = (req, res, next) => {
  try {
    const totalCustomers = db.prepare('SELECT COUNT(*) as count FROM customers').get().count;
    const totalTransactions = db.prepare('SELECT COUNT(*) as count FROM transactions').get().count;
    const pendingNotifications = db.prepare('SELECT COUNT(*) as count FROM notifications WHERE is_read = 0').get().count;
    const bonusRows = db.prepare('SELECT metadata FROM notifications WHERE type = ?').all('BONUS');
    const totalBonus = bonusRows.reduce((sum, row) => {
      const metadata = parseMetadata(row.metadata);
      return sum + (Number(metadata.amount) || 0);
    }, 0);

    res.json({
      totalCustomers,
      totalTransactions,
      pendingNotifications,
      totalBonus,
    });
  } catch (err) {
    next(err);
  }
};

exports.getRecentActivity = (req, res, next) => {
  try {
    const notifications = db.prepare(`
      SELECT id, customer_id, title, message, type, is_read, created_at
      FROM notifications
      ORDER BY created_at DESC
      LIMIT 5
    `).all();

    const transactions = db.prepare(`
      SELECT t.id, t.customer_id, c.name AS customer_name, t.amount, t.status, t.category, t.created_at
      FROM transactions t
      LEFT JOIN customers c ON c.id = t.customer_id
      ORDER BY t.created_at DESC
      LIMIT 5
    `).all();

    res.json({
      notifications: notifications.map((item) => ({
        ...item,
        timestamp: item.created_at,
        read: Boolean(item.is_read),
      })),
      transactions,
    });
  } catch (err) {
    next(err);
  }
};
