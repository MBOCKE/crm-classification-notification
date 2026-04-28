beforeEach(() => {
  jest.resetModules();
});

describe('ClassificationHistoryModel', () => {
  test('uses database prepare for history operations', () => {
    const prepare = jest.fn(() => ({
      run: jest.fn(() => ({ lastInsertRowid: 1 })),
      get: jest.fn(() => ({ id: 1 })),
      all: jest.fn(() => [])
    }));

    jest.doMock('../../src/config/database', () => ({ db: { prepare } }));
    const ClassificationHistoryModel = require('../../src/models/ClassificationHistory');

    ClassificationHistoryModel.create({ customer_id: 'cust1', old_tier: 'NEW', new_tier: 'STANDARD' });
    ClassificationHistoryModel.getByCustomerId('cust1');
    ClassificationHistoryModel.getLatest('cust1');

    expect(prepare).toHaveBeenCalledTimes(3);
  });
});