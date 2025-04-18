const request = require('supertest');
const app = require('../server');

describe('API: /api/register', () => {
  it('отклоняет регистрацию без email', async () => {
    const res = await request(app).post('/api/register').send({ password: '123456' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/email/i);
  });

  it('отклоняет регистрацию с некорректным email', async () => {
    const res = await request(app).post('/api/register').send({ email: 'bad', password: '123456' });
    expect(res.statusCode).toBe(400);
  });
});
