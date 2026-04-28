const jwt = require('jsonwebtoken');

beforeEach(() => {
  jest.resetModules();
  process.env.JWT_SECRET = 'test-secret';
  process.env.API_KEY = 'test-api-key';
});

describe('auth middleware', () => {
  test('authMiddleware passes valid Bearer token', () => {
    const { authMiddleware } = require('../../src/middleware/auth');
    const token = jwt.sign({ id: 'user1', roles: ['admin'] }, process.env.JWT_SECRET);
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = {};
    const next = jest.fn();

    authMiddleware(req, res, next);
    expect(req.user).toBeDefined();
    expect(req.user.id).toBe('user1');
    expect(next).toHaveBeenCalled();
  });

  test('authMiddleware rejects missing token', () => {
    const { authMiddleware } = require('../../src/middleware/auth');
    const req = { headers: {} };
    const json = jest.fn();
    const res = { status: jest.fn().mockReturnValue({ json }) };
    const next = jest.fn();

    authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(json).toHaveBeenCalledWith({ error: 'No token provided' });
    expect(next).not.toHaveBeenCalled();
  });

  test('requireAdmin rejects non-admin users', () => {
    const { requireAdmin } = require('../../src/middleware/auth');
    const req = { user: { roles: ['user'] } };
    const json = jest.fn();
    const res = { status: jest.fn().mockReturnValue({ json }) };
    const next = jest.fn();

    requireAdmin(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(json).toHaveBeenCalledWith({ error: 'Admin access required' });
    expect(next).not.toHaveBeenCalled();
  });

  test('internalAuthMiddleware allows valid API key', () => {
    const { internalAuthMiddleware } = require('../../src/middleware/auth');
    const req = { headers: { 'x-api-key': process.env.API_KEY } };
    const res = {};
    const next = jest.fn();

    internalAuthMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});