const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const dbPath = process.env.DATABASE_PATH || './data/crm.db';
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const db = new Database(dbPath);
db.pragma('journal_mode = WAL'); // better concurrency

function initializeDatabase() {
  // Customers table
  db.exec(`
    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      total_spent REAL DEFAULT 0,
      current_tier TEXT DEFAULT 'NEW',
      last_activity_date DATE DEFAULT CURRENT_DATE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Classification history (audit)
  db.exec(`
    CREATE TABLE IF NOT EXISTS classification_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id TEXT NOT NULL,
      old_tier TEXT NOT NULL,
      new_tier TEXT NOT NULL,
      score INTEGER,
      reason TEXT,
      triggered_by TEXT,
      metadata TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
    );
  `);

  // Notifications
  db.exec(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT NOT NULL,
      metadata TEXT,
      is_read INTEGER DEFAULT 0,
      is_delivered INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      read_at DATETIME,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
    );
  `);

  // Saved classification rules (admin configurations)
  db.exec(`
    CREATE TABLE IF NOT EXISTS classification_rules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      is_active INTEGER DEFAULT 0,
      weights_config TEXT NOT NULL,
      tiers_config TEXT NOT NULL,
      enabled_factors TEXT,
      created_by TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      activated_at DATETIME
    );
  `);

  // Audit log for rule changes
  db.exec(`
    CREATE TABLE IF NOT EXISTS rules_audit_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      rule_id INTEGER,
      changes TEXT,
      performed_by TEXT,
      ip_address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Indexes
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_customers_tier ON customers(current_tier);
    CREATE INDEX IF NOT EXISTS idx_notifications_customer ON notifications(customer_id);
    CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(customer_id, is_read);
    CREATE INDEX IF NOT EXISTS idx_classification_history_customer ON classification_history(customer_id);
  `);

  console.log('✅ Database initialised');
}

module.exports = { db, initializeDatabase };