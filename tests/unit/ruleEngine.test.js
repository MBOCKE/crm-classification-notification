const { AdvancedRuleEngine, AVAILABLE_FACTORS, SCENARIO_TEMPLATES } = require('../../src/services/ruleEngine');

describe('AdvancedRuleEngine', () => {
  let engine;
  const sampleCustomer = {
    id: 'cust_001',
    totalSpent: 1500,
    avgTransactionValue: 125,
    highestTransaction: 600,
    recentSpent30Days: 800,
    transactionFrequency: 12,
    daysSinceLastActivity: 3,
    accountAgeDays: 540,
    referralCount: 2,
    reviewCount: 8,
    featureUsageCount: 12,
    churnRiskScore: 15
  };

  beforeEach(() => {
    engine = new AdvancedRuleEngine();
  });

  test('initialises with balanced scenario by default', () => {
    const config = engine.getConfiguration();
    expect(config.activeScenario).toBe('balanced');
    expect(config.weights).toBeDefined();
  });

  test('calculates customer score within 0-100 range', () => {
    const score = engine.calculateCustomerScore(sampleCustomer);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  test('classifies customer into a tier', () => {
    const result = engine.classifyCustomer(sampleCustomer);
    expect(result).toHaveProperty('tier');
    expect(result).toHaveProperty('score');
    expect(result).toHaveProperty('explanation');
    expect(['PREMIUM', 'STANDARD', 'NORMAL', 'BRONZE', 'NEW']).toContain(result.tier);
  });

  test('switching scenario updates weights', () => {
    engine.loadScenario('big_spender');
    const config = engine.getConfiguration();
    expect(config.activeScenario).toBe('big_spender');
    expect(config.weights.totalSpent).toBeGreaterThan(0.3);
  });

  test('custom weights are applied correctly', () => {
    engine.updateWeights({ totalSpent: 0.8, transactionFrequency: 0.2 });
    const config = engine.getConfiguration();
    expect(config.activeScenario).toBe('custom');
    expect(config.weights.totalSpent).toBeCloseTo(0.8, 1);
  });

  test('returns breakdown of factors', () => {
    const breakdown = engine.getFactorsBreakdown(sampleCustomer);
    expect(Array.isArray(breakdown)).toBe(true);
    expect(breakdown[0]).toHaveProperty('factor');
    expect(breakdown[0]).toHaveProperty('contribution');
  });
});