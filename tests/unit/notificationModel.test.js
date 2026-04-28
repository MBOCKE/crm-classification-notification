beforeEach(() => {
  jest.resetModules();
});

describe('NotificationModel', () => {
  test('uses database methods for notification operations', () => {
    const prepare = jest.fn(() => ({
      run: jest.fn(() => ({ lastInsertRowid: 1, changes: 1 })),
      get: jest.fn(() => ({ count: 2 })),
      all: jest.fn(() => [])
    }));

    jest.doMock('../../src/config/database', () => ({ db: { prepare } }));
    const NotificationModel = require('../../src/models/Notification');

    NotificationModel.create({ customer_id: 'cust1', title: 'Test', message: 'Message', type: 'INFO' });
    NotificationModel.findByCustomer('cust1', 10, 0);
    NotificationModel.countUnread('cust1');
    NotificationModel.markAsRead(1, 'cust1');
    NotificationModel.markAllAsRead('cust1');
    NotificationModel.deleteOld(30);
    NotificationModel.deleteById(1);

    expect(prepare).toHaveBeenCalledTimes(6);
  });
});