const { db, initializeDatabase } = require('../src/config/database');

beforeAll(() => {
  initializeDatabase();
  // Clear tables for a clean slate
  db.prepare('DELETE FROM customers').run();
  db.prepare('DELETE FROM notifications').run();
  db.prepare('DELETE FROM classification_history').run();
});

afterAll(() => {
  db.close();
});