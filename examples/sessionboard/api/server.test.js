const request = require('supertest');
const app = require('./server');

test('GET /healthz reports ok', async () => {
  const res = await request(app).get('/healthz');
  expect(res.status).toBe(200);
  expect(res.body.status).toBe('ok');
});

test('GET /api/sessions returns the schedule', async () => {
  const res = await request(app).get('/api/sessions');
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});

test('POST rejects an out-of-range score', async () => {
  const res = await request(app).post('/api/sessions/1/ratings').send({ score: 9 });
  expect(res.status).toBe(400);
});
