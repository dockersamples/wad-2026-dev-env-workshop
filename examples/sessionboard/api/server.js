const express = require('express');
const { Pool } = require('pg');

const app = express();
const db = new Pool({ connectionString: process.env.DATABASE_URL });

// routes
app.get('/healthz', async (_req, res) => {
  try {
    await db.query('select 1');
    res.json({ status: 'ok' });
  } catch (err) {
    res.status(503).json({ status: 'degraded' });
  }
});

app.get('/api/sessions', async (_req, res) => {
  const { rows } = await db.query(
    'select id, title, speaker, track, starts_at from sessions order by starts_at'
  );
  res.json(rows);
});

app.post('/api/sessions/:id/ratings', express.json(), async (req, res) => {
  const { score } = req.body;
  if (!Number.isInteger(score) || score < 1 || score > 5) {
    return res.status(400).json({ error: 'score must be an integer 1-5' });
  }
  await db.query('insert into ratings (session_id, score) values ($1, $2)', [
    req.params.id,
    score,
  ]);
  res.status(201).end();
});

module.exports = app;

// Bind 0.0.0.0, not 127.0.0.1 — a published sandbox port has nothing to
// connect to otherwise.
if (require.main === module) {
  app.listen(3000, '0.0.0.0', () => console.log('listening on :3000'));
}
