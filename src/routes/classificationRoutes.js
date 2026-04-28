const express = require('express');
const router = express.Router();
const classificationController = require('../controllers/classificationController');
const { validate, classificationTriggerSchema } = require('../middleware/validation');

router.post('/:customerId', validate(classificationTriggerSchema), classificationController.reclassify);
router.get('/:customerId', classificationController.getCurrentTier);
router.get('/:customerId/history', classificationController.getHistory);
router.get('/stats/tiers', classificationController.getTierDistribution);

module.exports = router;