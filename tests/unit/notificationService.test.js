jest.mock('../../src/models/Notification', () => ({
  create: jest.fn().mockResolvedValue({ id: 1 }),
  findByCustomer: jest.fn().mockReturnValue([]),
  countUnread: jest.fn().mockReturnValue(5),
  markAsRead: jest.fn().mockReturnValue(true),
  markAllAsRead: jest.fn().mockReturnValue(2),
  deleteOld: jest.fn().mockReturnValue(3)
}));

const NotificationModel = require('../../src/models/Notification');
const notificationService = require('../../src/services/notificationService');

describe('notificationService', () => {
  test('createNotification delegates to NotificationModel.create', async () => {
    const payload = { customerId: '123', title: 'Hi', message: 'Hello', type: 'INFO' };
    await notificationService.createNotification(payload);
    expect(NotificationModel.create).toHaveBeenCalledWith({
      customer_id: '123',
      title: 'Hi',
      message: 'Hello',
      type: 'INFO',
      metadata: null
    });
  });

  test('getCustomerNotifications delegates to NotificationModel.findByCustomer', () => {
    notificationService.getCustomerNotifications('123', 10, 0);
    expect(NotificationModel.findByCustomer).toHaveBeenCalledWith('123', 10, 0);
  });

  test('getUnreadCount delegates to NotificationModel.countUnread', () => {
    const value = notificationService.getUnreadCount('123');
    expect(NotificationModel.countUnread).toHaveBeenCalledWith('123');
    expect(value).toBe(5);
  });

  test('markAsRead delegates to NotificationModel.markAsRead', () => {
    const result = notificationService.markAsRead('1', '123');
    expect(NotificationModel.markAsRead).toHaveBeenCalledWith('1', '123');
    expect(result).toBe(true);
  });

  test('markAllAsRead delegates to NotificationModel.markAllAsRead', () => {
    const result = notificationService.markAllAsRead('123');
    expect(NotificationModel.markAllAsRead).toHaveBeenCalledWith('123');
    expect(result).toEqual({ success: true, count: 2 });
  });

  test('deleteOldNotifications delegates to NotificationModel.deleteOld', () => {
    const result = notificationService.deleteOldNotifications(15);
    expect(NotificationModel.deleteOld).toHaveBeenCalledWith(15);
    expect(result).toEqual({ deletedCount: 3 });
  });
});