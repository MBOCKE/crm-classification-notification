const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../src/app');
const { db } = require('../../src/config/database');

describe('API Integration Tests', () => {
  let adminToken;
  let userToken;
  const testCustomerId = 'test_cust_999';

  beforeAll(() => {
    // Insert test customer
    db.prepare(`
      INSERT OR REPLACE INTO customers (id, email, name, total_spent, current_tier)
      VALUES (?, ?, ?, ?, ?)
    `).run(testCustomerId, 'test@example.com', 'Test User', 800, 'NORMAL');

    // Generate JWT tokens (use same secret as .env)
    const secret = process.env.JWT_SECRET || 'test-secret';
    adminToken = jwt.sign({ id: 'admin1', roles: ['admin'] }, secret);
    userToken = jwt.sign({ id: 'user1', roles: ['user'] }, secret);
  });

  afterAll(() => {
    db.prepare('DELETE FROM customers WHERE id = ?').run(testCustomerId);
    db.prepare('DELETE FROM notifications WHERE customer_id = ?').run(testCustomerId);
  });

  describe('Health Check', () => {
    test('GET /health returns 200', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('healthy');
    });
  });

  describe('Classification Endpoints', () => {
    test('GET /api/v1/classify/:customerId requires auth', async () => {
      const res = await request(app).get(`/api/v1/classify/${testCustomerId}`);
      expect(res.statusCode).toBe(401);
    });

    test('GET /api/v1/classify/:customerId works with valid token', async () => {
      const res = await request(app)
        .get(`/api/v1/classify/${testCustomerId}`)
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('current_tier');
    });

    test('POST /api/v1/classify/:customerId triggers reclassification', async () => {
      const res = await request(app)
        .post(`/api/v1/classify/${testCustomerId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ totalSpent: 1200, triggerEvent: 'purchase' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('newTier');
    });
  });

  describe('Notification Endpoints', () => {
    test('GET /api/v1/notifications/:customerId returns array', async () => {
      const res = await request(app)
        .get(`/api/v1/notifications/${testCustomerId}`)
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    test('GET /api/v1/notifications/:customerId/unread/count returns number', async () => {
      const res = await request(app)
        .get(`/api/v1/notifications/${testCustomerId}/unread/count`)
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('unreadCount');
      expect(typeof res.body.unreadCount).toBe('number');
    });
  });

  describe('Admin Endpoints', () => {
    test('PUT /api/v1/admin/rules/weights requires admin role', async () => {
      const res = await request(app)
        .put('/api/v1/admin/rules/weights')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ weights: { totalSpent: 0.5 } });
      expect(res.statusCode).toBe(403);
    });

    test('PUT /api/v1/admin/rules/weights works for admin', async () => {
      const res = await request(app)
        .put('/api/v1/admin/rules/weights')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ weights: { totalSpent: 0.5, transactionFrequency: 0.5 } });
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    test('GET /api/v1/admin/factors returns available factors', async () => {
      const res = await request(app)
        .get('/api/v1/admin/factors')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('totalSpent');
    });
  });
});