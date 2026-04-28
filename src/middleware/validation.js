const Joi = require('joi');

const classificationTriggerSchema = Joi.object({
  totalSpent: Joi.number().min(0).optional(),
  triggerEvent: Joi.string().valid('purchase', 'admin', 'system', 'bonus').default('system')
});

const rulesUpdateSchema = Joi.object({
  weights: Joi.object().pattern(Joi.string(), Joi.number().min(0).max(1)).required()
});

function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };
}

module.exports = { validate, classificationTriggerSchema, rulesUpdateSchema };