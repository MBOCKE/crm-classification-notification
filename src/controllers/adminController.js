const { AdvancedRuleEngine, AVAILABLE_FACTORS, SCENARIO_TEMPLATES } = require('../services/ruleEngine');
const { db } = require('../config/database');

let activeEngine = new AdvancedRuleEngine();

exports.getCurrentConfig = (req, res) => {
  res.json(activeEngine.getConfiguration());
};

exports.updateWeights = (req, res) => {
  const { weights } = req.body;
  const result = activeEngine.updateWeights(weights);
  // audit log
  db.prepare(`INSERT INTO rules_audit_log (action, changes, performed_by, ip_address) VALUES (?, ?, ?, ?)`)
    .run('UPDATE_WEIGHTS', JSON.stringify(weights), req.user.id, req.ip);
  res.json(result);
};

exports.updateTiers = (req, res) => {
  const { tiers } = req.body;
  activeEngine.updateTiers(tiers);
  db.prepare(`INSERT INTO rules_audit_log (action, changes, performed_by, ip_address) VALUES (?, ?, ?, ?)`)
    .run('UPDATE_TIERS', JSON.stringify(tiers), req.user.id, req.ip);
  res.json({ success: true });
};

exports.switchScenario = (req, res) => {
  const { scenarioName } = req.params;
  activeEngine.loadScenario(scenarioName);
  db.prepare(`INSERT INTO rules_audit_log (action, changes, performed_by, ip_address) VALUES (?, ?, ?, ?)`)
    .run('SWITCH_SCENARIO', scenarioName, req.user.id, req.ip);
  res.json({ success: true, scenario: scenarioName, weights: activeEngine.weights });
};

exports.saveRule = (req, res) => {
  const { name, description, weights, tiers, enabledFactors } = req.body;
  const stmt = db.prepare(`
    INSERT INTO classification_rules (name, description, weights_config, tiers_config, enabled_factors, created_by)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const info = stmt.run(name, description, JSON.stringify(weights), JSON.stringify(tiers), JSON.stringify(enabledFactors), req.user.id);
  res.json({ id: info.lastInsertRowid, name });
};

exports.activateRule = (req, res) => {
  const { ruleId } = req.params;
  const rule = db.prepare('SELECT * FROM classification_rules WHERE id = ?').get(ruleId);
  if (!rule) return res.status(404).json({ error: 'Rule not found' });
  db.prepare('UPDATE classification_rules SET is_active = 0').run();
  db.prepare('UPDATE classification_rules SET is_active = 1, activated_at = CURRENT_TIMESTAMP WHERE id = ?').run(ruleId);
  // reload engine with saved config
  const weights = JSON.parse(rule.weights_config);
  const tiers = JSON.parse(rule.tiers_config);
  const enabled = JSON.parse(rule.enabled_factors || '[]');
  activeEngine = new AdvancedRuleEngine({ customWeights: weights, tiers, enabledFactors: enabled });
  res.json({ success: true, activated: rule.name });
};

exports.getAvailableFactors = (req, res) => res.json(AVAILABLE_FACTORS);
exports.getScenarios = (req, res) => res.json(SCENARIO_TEMPLATES);

exports.getAuditLogs = (req, res) => {
  const logs = db.prepare(`
    SELECT id, action, changes, performed_by AS user, ip_address AS ipAddress, created_at
    FROM rules_audit_log
    ORDER BY created_at DESC
    LIMIT 50
  `).all();
  res.json(logs);
};

exports.testClassification = (req, res) => {
  const { customerData, testWeights } = req.body;
  const testEngine = new AdvancedRuleEngine();
  if (testWeights) testEngine.updateWeights(testWeights);
  const result = testEngine.classifyCustomer(customerData);
  res.json(result);
};