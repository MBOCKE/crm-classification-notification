const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { validate, rulesUpdateSchema } = require('../middleware/validation');
const { authMiddleware, requireAdmin } = require('../middleware/auth');

// All admin routes require JWT + admin role
router.use(authMiddleware, requireAdmin);

router.get('/rules/current', adminController.getCurrentConfig);
router.put('/rules/weights', validate(rulesUpdateSchema), adminController.updateWeights);
router.put('/rules/tiers', adminController.updateTiers);
router.post('/rules/scenario/:scenarioName', adminController.switchScenario);
router.post('/rules/save', adminController.saveRule);
router.post('/rules/activate/:ruleId', adminController.activateRule);
router.get('/factors', adminController.getAvailableFactors);
router.get('/scenarios', adminController.getScenarios);
router.get('/logs', adminController.getAuditLogs);
router.post('/rules/test', adminController.testClassification);

module.exports = router;