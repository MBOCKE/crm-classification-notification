const express = require('express');
const router = express.Router();
const { classifyCustomer } = require('../controllers/classificationController');

router.post('/', classifyCustomer);

module.exports = router;
