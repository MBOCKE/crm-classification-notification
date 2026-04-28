const path = require('path');
const Database = require('better-sqlite3');

const databasePath = process.env.DATABASE_URL || path.resolve(__dirname, '../../data/database.sqlite');
const db = new Database(databasePath, { verbose: console.log });

module.exports = db;
