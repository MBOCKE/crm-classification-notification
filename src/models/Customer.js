const { db } = require('../config/database');

class CustomerModel {
  // Create or update customer
  upsert(customerData) {
    const { id, email, name, total_spent = 0, current_tier = 'NEW', last_activity_date = new Date().toISOString().split('T')[0] } = customerData;
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO customers (id, email, name, total_spent, current_tier, last_activity_date, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);
    return stmt.run(id, email, name, total_spent, current_tier, last_activity_date);
  }

  // Find by ID
  findById(id) {
    return db.prepare('SELECT * FROM customers WHERE id = ?').get(id);
  }

  // Get all customers (limited)
  findAll(limit = 100, offset = 0) {
    return db.prepare('SELECT * FROM customers ORDER BY created_at DESC LIMIT ? OFFSET ?').all(limit, offset);
  }

  // Update spending and optionally recalc tier (tier update handled by service)
  updateSpending(id, newTotalSpent) {
    const stmt = db.prepare('UPDATE customers SET total_spent = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    return stmt.run(newTotalSpent, id);
  }

  // Update last activity date
  updateLastActivity(id, date = new Date().toISOString().split('T')[0]) {
    const stmt = db.prepare('UPDATE customers SET last_activity_date = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    return stmt.run(date, id);
  }

  // Build complete customer data object for rule engine (including derived factors)
  // In a real implementation, this would query transaction, loyalty, engagement tables.
  // For MVP, we compute realistic defaults or fetch from external services.
  getCustomerDataForClassification(id) {
    const customer = this.findById(id);
    if (!customer) return null;

    // For now, we only have total_spent and last_activity.
    // We'll add synthetic or zero values for other factors.
    // In production, you would join with other tables or call other microservices.
    return {
      id: customer.id,
      totalSpent: customer.total_spent,
      avgTransactionValue: customer.total_spent / 5,      // assume 5 transactions
      highestTransaction: customer.total_spent * 0.4,
      recentSpent30Days: customer.total_spent * 0.3,
      recurringRevenue: 0,
      transactionFrequency: 4,
      daysSinceLastActivity: (() => {
        const last = new Date(customer.last_activity_date);
        const now = new Date();
        return Math.floor((now - last) / (1000 * 60 * 60 * 24));
      })(),
      sessionDuration: 15,
      pagesViewedPerVisit: 8,
      reviewCount: 0,
      referralCount: 0,
      accountAgeDays: 120,
      loyaltyTierDuration: 60,
      returnRate: 0,
      supportTickets: 0,
      paymentReliability: 100,
      socialShares: 0,
      newsletterClicks: 0,
      featureUsageCount: 3,
      eventAttendance: 0,
      betaParticipation: false,
      churnRiskScore: 20,
      lifetimeValueScore: customer.total_spent * 3,
      seasonalBonus: 1.0
    };
  }
}

module.exports = new CustomerModel();