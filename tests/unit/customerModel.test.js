beforeEach(() => {
  jest.resetModules();
});

describe('CustomerModel', () => {
  test('calls database methods for CRUD operations', () => {
    const prepare = jest.fn(() => ({
      run: jest.fn(() => ({ changes: 1 })),
      get: jest.fn(() => ({ id: 'cust1', email: 'a@b.com', name: 'Test', total_spent: 100, last_activity_date: '2026-04-25' })),
      all: jest.fn(() => [])
    }));

    jest.doMock('../../src/config/database', () => ({ db: { prepare } }));
    const CustomerModel = require('../../src/models/Customer');

    CustomerModel.upsert({ id: 'cust1', email: 'a@b.com', name: 'Test' });
    CustomerModel.findById('cust1');
    CustomerModel.findAll(10, 0);
    CustomerModel.updateSpending('cust1', 120);
    CustomerModel.updateLastActivity('cust1', '2026-04-26');
    CustomerModel.getCustomerDataForClassification('cust1');

    expect(prepare).toHaveBeenCalled();
  });
});