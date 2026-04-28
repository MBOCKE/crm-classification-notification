const { db } = require('../config/database');

class ClassificationHistoryModel {
  // Insert a classification event
  create(historyData) {
    const { customer_id, old_tier, new_tier, score, reason, triggered_by, metadata } = historyData;
    const stmt = db.prepare(`
      INSERT INTO classification_history (customer_id, old_tier, new_tier, score, reason, triggered_by, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(customer_id, old_tier, new_tier, score, reason, triggered_by, metadata || null);
  }

  // Get history for a customer
  getByCustomerId(customerId, limit = 20) {
    const stmt = db.prepare(`
      SELECT * FROM classification_history
      WHERE customer_id = ?
      ORDER BY created_at DESC
      LIMIT ?
    `);
    return stmt.all(customerId, limit);
  }

  // Get latest classification for a customer
  getLatest(customerId) {
    const stmt = db.prepare(`
      SELECT * FROM classification_history
      WHERE customer_id = ?
      ORDER BY created_at DESC
      LIMIT 1
    `);
    return stmt.get(customerId);
  }
}

module.exports = new ClassificationHistoryModel();