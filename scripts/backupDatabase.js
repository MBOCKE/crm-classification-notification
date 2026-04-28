// scripts/backupDatabase.js
const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, '../data/crm.db');
const backupDir = path.join(__dirname, '../backups');

if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

if (fs.existsSync(source)) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const dest = path.join(backupDir, `crm_${timestamp}.db`);
  fs.copyFileSync(source, dest);
  console.log(`✅ Database backed up to ${dest}`);
} else {
  console.log('❌ No database file found. Run the service first.');
}