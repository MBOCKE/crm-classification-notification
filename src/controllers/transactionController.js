const { db } = require('../config/database');
const { randomUUID } = require('crypto');

const normalizeTransaction = (row) => ({
  id: row.id,
  customerId: row.customer_id,
  customerName: row.customer_name,
  amount: row.amount,
  status: row.status,
  category: row.category,
  description: row.description,
  merchant: row.merchant,
  metadata: row.metadata ? JSON.parse(row.metadata) : null,
  created_at: row.created_at,
  updated_at: row.updated_at,
});

exports.getAllTransactions = (req, res, next) => {
  try {
    const { limit = 100, offset = 0, status } = req.query;
    const conditions = [];
    const params = [];

    if (status) {
      conditions.push('t.status = ?');
      params.push(status);
    }

    let sql = `SELECT t.*, c.name AS customer_name FROM transactions t
      LEFT JOIN customers c ON c.id = t.customer_id`;
    if (conditions.length) {
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }
    sql += ' ORDER BY t.created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const transactions = db.prepare(sql).all(...params);
    res.json(transactions.map(normalizeTransaction));
  } catch (err) {
    next(err);
  }
};

exports.getTransactionById = (req, res, next) => {
  try {
    const row = db.prepare(`
      SELECT t.*, c.name AS customer_name
      FROM transactions t
      LEFT JOIN customers c ON c.id = t.customer_id
      WHERE t.id = ?
    `).get(req.params.transactionId);
    if (!row) return res.status(404).json({ error: 'Transaction not found' });
    res.json(normalizeTransaction(row));
  } catch (err) {
    next(err);
  }
};

exports.createTransaction = (req, res, next) => {
  try {
    const { customerId, amount, status = 'completed', category = 'purchase', merchant = '', description = '' } = req.body;
    if (!customerId || amount === undefined) {
      return res.status(400).json({ error: 'customerId and amount are required' });
    }

    const id = randomUUID();
    const stmt = db.prepare(`
      INSERT INTO transactions (id, customer_id, amount, status, category, merchant, description, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, customerId, amount, status, category, merchant, description, null);

    if (status === 'completed' && Number(amount) > 0) {
      db.prepare(`
        UPDATE customers
        SET total_spent = total_spent + ?, last_activity_date = CURRENT_DATE, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(amount, customerId);
    }

    const created = db.prepare(`
      SELECT t.*, c.name AS customer_name
      FROM transactions t
      LEFT JOIN customers c ON c.id = t.customer_id
      WHERE t.id = ?
    `).get(id);

    res.status(201).json(normalizeTransaction(created));
  } catch (err) {
    next(err);
  }
};

exports.updateTransaction = (req, res, next) => {
  try {
    const { status, category, merchant, description, amount } = req.body;
    const updates = [];
    const params = [];

    if (status !== undefined) {
      updates.push('status = ?');
      params.push(status);
    }
    if (category !== undefined) {
      updates.push('category = ?');
      params.push(category);
    }
    if (merchant !== undefined) {
      updates.push('merchant = ?');
      params.push(merchant);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      params.push(description);
    }
    if (amount !== undefined) {
      updates.push('amount = ?');
      params.push(amount);
    }

    if (!updates.length) {
      return res.status(400).json({ error: 'No valid transaction fields provided for update' });
    }

    params.push(req.params.transactionId);
    db.prepare(`UPDATE transactions SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(...params);
    const updated = db.prepare(`
      SELECT t.*, c.name AS customer_name
      FROM transactions t
      LEFT JOIN customers c ON c.id = t.customer_id
      WHERE t.id = ?
    `).get(req.params.transactionId);
    if (!updated) return res.status(404).json({ error: 'Transaction not found' });
    res.json(normalizeTransaction(updated));
  } catch (err) {
    next(err);
  }
};

exports.getTransactionsByCustomer = (req, res, next) => {
  try {
    const rows = db.prepare(`
      SELECT t.*, c.name AS customer_name
      FROM transactions t
      LEFT JOIN customers c ON c.id = t.customer_id
      WHERE t.customer_id = ?
      ORDER BY t.created_at DESC
    `).all(req.params.customerId);
    res.json(rows.map(normalizeTransaction));
  } catch (err) {
    next(err);
  }
};

exports.getTransactionStats = (req, res, next) => {
  try {
    const summary = db.prepare(`
      SELECT
        COUNT(*) AS totalTransactions,
        COALESCE(SUM(amount), 0) AS totalAmount,
        COALESCE(AVG(amount), 0) AS averageAmount
      FROM transactions
    `).get();
    res.json(summary);
  } catch (err) {
    next(err);
  }
};

exports.awardBonus = (req, res, next) => {
  try {
    const { customerId, amount, reason = 'Bonus awarded' } = req.body;
    if (!customerId || amount === undefined) {
      return res.status(400).json({ error: 'customerId and amount are required' });
    }

    const stmt = db.prepare(`
      INSERT INTO notifications (customer_id, title, message, type, metadata)
      VALUES (?, ?, ?, 'BONUS', ?)
    `);
    stmt.run(
      customerId,
      'Bonus awarded',
      `Awarded ${amount} bonus points for ${reason}`,
      JSON.stringify({ amount, reason })
    );

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
