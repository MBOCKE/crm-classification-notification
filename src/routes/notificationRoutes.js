const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.get('/:customerId', notificationController.getNotifications);
router.get('/:customerId/unread/count', notificationController.getUnreadCount);
router.put('/:notificationId/read', notificationController.markAsRead);
router.put('/:customerId/read-all', notificationController.markAllAsRead);
router.delete('/:notificationId', notificationController.deleteNotification);
router.delete('/:customerId/old', notificationController.deleteOldNotifications);

module.exports = router;