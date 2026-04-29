// scripts/seedDatabase.js
const { db, initializeDatabase } = require('../src/config/database');
const { AdvancedRuleEngine } = require('../src/services/ruleEngine');
const bcrypt = require('bcrypt');

// Initialise database (creates tables if not exist)
initializeDatabase();

// Create default admin user
const createDefaultUser = async () => {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (email, password, name, roles)
    VALUES (?, ?, ?, ?)
  `);
  insertUser.run('admin@example.com', hashedPassword, 'Admin User', JSON.stringify(['admin']));
  console.log('✅ Default admin user created (email: admin@example.com, password: admin123)');
};

// Sample customers with realistic data
const sampleCustomers = [
  {
    id: 'cust_001',
    email: 'alice@example.com',
    name: 'Alice Johnson',
    total_spent: 3500,
    current_tier: 'PREMIUM',
    last_activity_date: '2026-04-25'
  },
  {
    id: 'cust_002',
    email: 'bob@example.com',
    name: 'Bob Smith',
    total_spent: 750,
    current_tier: 'STANDARD',
    last_activity_date: '2026-04-20'
  },
  {
    id: 'cust_003',
    email: 'carol@example.com',
    name: 'Carol Davis',
    total_spent: 200,
    current_tier: 'NORMAL',
    last_activity_date: '2026-04-10'
  },
  {
    id: 'cust_004',
    email: 'david@example.com',
    name: 'David Wilson',
    total_spent: 50,
    current_tier: 'NEW',
    last_activity_date: '2026-04-28'
  }
];

// Insert customers
const insertCustomer = db.prepare(`
  INSERT OR REPLACE INTO customers (id, email, name, total_spent, current_tier, last_activity_date)
  VALUES (?, ?, ?, ?, ?, ?)
`);

for (const cust of sampleCustomers) {
  insertCustomer.run(cust.id, cust.email, cust.name, cust.total_spent, cust.current_tier, cust.last_activity_date);
}
console.log(`✅ Inserted ${sampleCustomers.length} sample customers.`);

// Optionally trigger classification for each to see scores
const engine = new AdvancedRuleEngine();
console.log('\n📊 Classification results:');
for (const cust of sampleCustomers) {
  // Build full factor data (in real app you'd fetch from other tables)
  const customerData = {
    id: cust.id,
    totalSpent: cust.total_spent,
    avgTransactionValue: cust.total_spent / 5,   // assume 5 transactions
    highestTransaction: cust.total_spent * 0.4,
    recentSpent30Days: cust.total_spent * 0.3,
    accountAgeDays: 120,
    transactionFrequency: 4,
    daysSinceLastActivity: 5,
    referralCount: Math.floor(Math.random() * 3),
    reviewCount: Math.floor(Math.random() * 10),
    featureUsageCount: Math.floor(Math.random() * 15)
  };
  const result = engine.classifyCustomer(customerData);
  console.log(`${cust.name}: ${result.tier} (score ${result.score})`);
}

console.log('\n✅ Seeding complete. Run `npm start` to start the service.');

// Create default user
createDefaultUser().catch(console.error);