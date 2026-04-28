class Notification {
  constructor(id, customerId, message, sentAt, status) {
    this.id = id;
    this.customerId = customerId;
    this.message = message;
    this.sentAt = sentAt;
    this.status = status;
  }
}

module.exports = Notification;
