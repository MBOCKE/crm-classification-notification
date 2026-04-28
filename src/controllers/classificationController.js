const { db } = require('../config/database');
const { AdvancedRuleEngine } = require('../services/ruleEngine');
const notificationService = require('../services/notificationService');

let activeEngine = new AdvancedRuleEngine(); // default balanced

exports.reclassify = async (req, res, next) => {
  try {
    const { customerId } = req.params;
    const { totalSpent, triggerEvent = 'system' } = req.body;

    // Fetch customer data (you should gather all factors from DB or monolith)
    const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(customerId);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    // For demo, we only have total_spent; in real use you'd populate all factors
    const customerData = {
      id: customer.id,
      totalSpent: totalSpent || customer.total_spent,
      // ... other factors would come from other tables / services
    };

    const classification = activeEngine.classifyCustomer(customerData);
    const oldTier = customer.current_tier;
    const newTier = classification.tier;

    if (oldTier !== newTier) {
      // Update customer
      db.prepare('UPDATE customers SET current_tier = ?, total_spent = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
        .run(newTier, customerData.totalSpent, customerId);

      // Record history
      db.prepare(`
        INSERT INTO classification_history (customer_id, old_tier, new_tier, score, reason, triggered_by)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(customerId, oldTier, newTier, classification.score, `Score ${classification.score}`, triggerEvent);

      // Create notification
      await notificationService.createNotification({
        customerId,
        title: `🎉 Tier upgrade: ${newTier}`,
        message: `You moved from ${oldTier} to ${newTier}. Score: ${classification.score}`,
        type: 'TIER_CHANGE'
      });
    }

    res.json({ changed: oldTier !== newTier, oldTier, newTier, score: classification.score });
  } catch (err) {
    next(err);
  }
};

exports.getCurrentTier = (req, res, next) => {
  try {
    const customer = db.prepare('SELECT id, current_tier, total_spent FROM customers WHERE id = ?').get(req.params.customerId);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (err) { next(err); }
};

exports.getHistory = (req, res, next) => {
  try {
    const history = db.prepare(`
      SELECT old_tier, new_tier, score, reason, triggered_by, created_at
      FROM classification_history WHERE customer_id = ? ORDER BY created_at DESC
    `).all(req.params.customerId);
    res.json(history);
  } catch (err) { next(err); }
};

exports.getTierDistribution = (req, res, next) => {
  try {
    const stats = db.prepare(`
      SELECT current_tier, COUNT(*) as count FROM customers GROUP BY current_tier
    `).all();
    res.json(stats);
  } catch (err) { next(err); }
};