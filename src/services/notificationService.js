function sendNotification(customer, message) {
  // Implement notification delivery here
  return {
    customerId: customer.id,
    message,
    sentAt: new Date(),
    status: 'sent'
  };
}

module.exports = { sendNotification };
