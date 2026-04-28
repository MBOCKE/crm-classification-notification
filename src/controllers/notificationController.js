const { sendNotification } = require('../services/notificationService');

exports.notifyCustomer = (req, res) => {
  const { customer, message } = req.body;
  const result = sendNotification(customer, message);
  res.json(result);
};
