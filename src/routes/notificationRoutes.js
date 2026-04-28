const express = require('express');
const router = express.Router();
const { notifyCustomer } = require('../controllers/notificationController');

router.post('/', notifyCustomer);

module.exports = router;
