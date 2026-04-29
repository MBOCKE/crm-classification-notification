const db = require('../config/database');

const User = {
  create: (userData) => {
    const { email, password, name, roles = ['user'] } = userData;
    const stmt = db.prepare(`
      INSERT INTO users (email, password, name, roles, created_at, updated_at)
      VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
    `);
    const result = stmt.run(email, password, name, JSON.stringify(roles));
    return result.lastInsertRowid;
  },

  getById: (id) => {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id);
  },

  getByEmail: (email) => {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
  },

  update: (id, userData) => {
    const { email, password, name, roles } = userData;
    const stmt = db.prepare(`
      UPDATE users
      SET email = ?, password = ?, name = ?, roles = ?, updated_at = datetime('now')
      WHERE id = ?
    `);
    stmt.run(email, password, name, JSON.stringify(roles), id);
  },

  delete: (id) => {
    const stmt = db.prepare('DELETE FROM users WHERE id = ?');
    stmt.run(id);
  },

  getAll: () => {
    const stmt = db.prepare('SELECT * FROM users');
    return stmt.all();
  }
};

module.exports = User;