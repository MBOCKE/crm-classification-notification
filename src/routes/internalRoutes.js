const express = require('express');
const router = express.Router();
const { internalAuthMiddleware } = require('../middleware/auth');
const notificationService = require('../services/notificationService');

router.use(internalAuthMiddleware);

router.post('/bonus', (req, res) => {
  const { customerId, bonusPoints, reason } = req.body;
  notificationService.createNotification({
    customerId,
    title: '✨ Bonus Awarded!',
    message: `You earned ${bonusPoints} points for ${reason}`,
    type: 'BONUS'
  });
  res.json({ success: true });
});

router.post('/inactivity', (req, res) => {
  const { customerId } = req.body;
  notificationService.createNotification({
    customerId,
    title: '⏰ We miss you!',
    message: 'Come back and check our new offers!',
    type: 'INACTIVITY'
  });
  res.json({ success: true });
});

module.exports = router;