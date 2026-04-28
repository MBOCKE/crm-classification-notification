// scripts/cleanupLogs.js
const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../logs');
const maxAgeDays = 30;
const now = Date.now();

if (!fs.existsSync(logDir)) {
  console.log('Log directory does not exist.');
  process.exit(0);
}

const files = fs.readdirSync(logDir);
let deleted = 0;
for (const file of files) {
  const filePath = path.join(logDir, file);
  const stats = fs.statSync(filePath);
  const ageDays = (now - stats.mtimeMs) / (1000 * 60 * 60 * 24);
  if (ageDays > maxAgeDays) {
    fs.unlinkSync(filePath);
    deleted++;
  }
}
console.log(`🧹 Cleaned up ${deleted} old log files (older than ${maxAgeDays} days).`);