class ClassificationHistory {
  constructor(id, customerId, previousClassification, newClassification, changedAt) {
    this.id = id;
    this.customerId = customerId;
    this.previousClassification = previousClassification;
    this.newClassification = newClassification;
    this.changedAt = changedAt;
  }
}

module.exports = ClassificationHistory;
