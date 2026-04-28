const request = require('supertest');
const app = require('../../src/app');

describe('API integration tests', () => {
  test('GET /api/internal/health should return healthy', async () => {
    const response = await request(app).get('/api/internal/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'healthy' });
  });
});
