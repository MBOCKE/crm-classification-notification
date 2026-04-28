const { evaluateClassification } = require('../../src/services/ruleEngine');

test('evaluateClassification returns a classification string', () => {
  const customer = { id: 1, name: 'Test' };
  const result = evaluateClassification(customer);
  expect(typeof result).toBe('string');
});
