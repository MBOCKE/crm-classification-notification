const { db } = require('../config/database');
const { randomUUID } = require('crypto');

const normalizeCustomer = (row) => ({
  id: row.id,
  email: row.email,
  name: row.name,
  phone: row.phone || '',
  total_spent: row.total_spent,
  current_tier: row.current_tier,
  active: Boolean(row.active),
  last_activity_date: row.last_activity_date,
  created_at: row.created_at,
  updated_at: row.updated_at,
});

exports.getAllCustomers = (req, res, next) => {
  try {
    const { search, tier, active, limit = 100, offset = 0 } = req.query;
    const conditions = [];
    const params = [];

    if (search) {
      conditions.push('(name LIKE ? OR email LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    if (tier) {
      conditions.push('current_tier = ?');
      params.push(tier.toUpperCase());
    }

    if (active !== undefined) {
      conditions.push('active = ?');
      params.push(active === 'true' || active === '1' ? 1 : 0);
    }

    let sql = 'SELECT * FROM customers';
    if (conditions.length) {
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }
    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const customers = db.prepare(sql).all(...params);
    res.json(customers.map(normalizeCustomer));
  } catch (err) {
    next(err);
  }
};

exports.getCustomerById = (req, res, next) => {
  try {
    const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(req.params.customerId);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(normalizeCustomer(customer));
  } catch (err) {
    next(err);
  }
};

exports.createCustomer = (req, res, next) => {
  try {
    const { email, name, phone = '', total_spent = 0, current_tier = 'NEW', active = true } = req.body;
    const id = randomUUID();
    const stmt = db.prepare(`
      INSERT INTO customers (id, email, name, phone, total_spent, current_tier, active, last_activity_date, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_DATE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `);
    stmt.run(id, email, name, phone, total_spent, current_tier.toUpperCase(), active ? 1 : 0);
    const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(id);
    res.status(201).json(normalizeCustomer(customer));
  } catch (err) {
    next(err);
  }
};

exports.updateCustomer = (req, res, next) => {
  try {
    const { email, name, phone = '', current_tier, total_spent, active } = req.body;
    const updates = [];
    const params = [];

    if (email !== undefined) {
      updates.push('email = ?');
      params.push(email);
    }
    if (name !== undefined) {
      updates.push('name = ?');
      params.push(name);
    }
    if (phone !== undefined) {
      updates.push('phone = ?');
      params.push(phone);
    }
    if (current_tier !== undefined) {
      updates.push('current_tier = ?');
      params.push(current_tier.toUpperCase());
    }
    if (total_spent !== undefined) {
      updates.push('total_spent = ?');
      params.push(total_spent);
    }
    if (active !== undefined) {
      updates.push('active = ?');
      params.push(active ? 1 : 0);
    }

    if (!updates.length) {
      return res.status(400).json({ error: 'No valid customer fields provided for update' });
    }

    params.push(req.params.customerId);
    const stmt = db.prepare(`UPDATE customers SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`);
    stmt.run(...params);
    const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(req.params.customerId);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(normalizeCustomer(customer));
  } catch (err) {
    next(err);
  }
};

exports.deleteCustomer = (req, res, next) => {
  try {
    const stmt = db.prepare('DELETE FROM customers WHERE id = ?');
    const result = stmt.run(req.params.customerId);
    res.json({ success: result.changes > 0 });
  } catch (err) {
    next(err);
  }
};
