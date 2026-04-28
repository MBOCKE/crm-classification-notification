const { evaluateClassification } = require('../services/ruleEngine');

exports.classifyCustomer = (req, res) => {
  const customer = req.body;
  const classification = evaluateClassification(customer);
  res.json({ customer, classification });
};
