const { errorHandler } = require('../../src/middleware/errorHandler');

describe('errorHandler middleware', () => {
  test('returns 500 and error message', () => {
    const req = { originalUrl: '/test', method: 'GET', ip: '127.0.0.1' };
    const status = jest.fn().mockReturnThis();
    const json = jest.fn().mockReturnThis();
    const res = { status, json };
    const next = jest.fn();
    const err = new Error('Something went wrong');

    errorHandler(err, req, res, next);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({ error: 'Something went wrong' });
    expect(next).not.toHaveBeenCalled();
  });
});