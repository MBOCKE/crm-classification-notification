const { validate, classificationTriggerSchema } = require('../../src/middleware/validation');

describe('validation middleware', () => {
  test('classificationTriggerSchema accepts valid payload', () => {
    const { error, value } = classificationTriggerSchema.validate({ totalSpent: 100, triggerEvent: 'purchase' });
    expect(error).toBeUndefined();
    expect(value.triggerEvent).toBe('purchase');
  });

  test('validate middleware returns 400 on invalid payload', () => {
    const schema = classificationTriggerSchema;
    const middleware = validate(schema);
    const req = { body: { totalSpent: -1 } };
    const json = jest.fn();
    const res = { status: jest.fn().mockReturnValue({ json }) };
    const next = jest.fn();

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });
});