const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

router.get('/', transactionController.getAllTransactions);
router.get('/:transactionId', transactionController.getTransactionById);
router.post('/', transactionController.createTransaction);
router.put('/:transactionId', transactionController.updateTransaction);
router.get('/customer/:customerId', transactionController.getTransactionsByCustomer);
router.get('/stats', transactionController.getTransactionStats);
router.post('/bonus', transactionController.awardBonus);

module.exports = router;
