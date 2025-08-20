import express from 'express';
import { getDb } from './db';

const app = express();
app.use(express.json());

app.post('/customers', async (req, res) => {
  const { name, email, password, whatsapp, status } = req.body;
  if (!name || !email || !password || !whatsapp || !status) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const db = await getDb();
  try {
    const result = await db.run(
      `INSERT INTO customers (name, email, password, whatsapp, status) VALUES (?, ?, ?, ?, ?)`,
      [name, email, password, whatsapp, status]
    );
    const customer = await db.get(`SELECT * FROM customers WHERE id = ?`, [result.lastID]);
    res.status(201).json(customer);
  } catch (err: any) {
    if (err.message.includes('UNIQUE constraint')) {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

app.get('/customers', async (_req, res) => {
  const db = await getDb();
  const customers = await db.all(`SELECT * FROM customers`);
  res.json(customers);
});

app.get('/customers/:id', async (req, res) => {
  const db = await getDb();
  const customer = await db.get(`SELECT * FROM customers WHERE id = ?`, [req.params.id]);
  if (!customer) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.json(customer);
});

app.put('/customers/:id', async (req, res) => {
  const { name, email, password, whatsapp, status } = req.body;
  const db = await getDb();
  const existing = await db.get(`SELECT * FROM customers WHERE id = ?`, [req.params.id]);
  if (!existing) {
    return res.status(404).json({ error: 'Not found' });
  }
  await db.run(
    `UPDATE customers SET name = ?, email = ?, password = ?, whatsapp = ?, status = ? WHERE id = ?`,
    [
      name ?? existing.name,
      email ?? existing.email,
      password ?? existing.password,
      whatsapp ?? existing.whatsapp,
      status ?? existing.status,
      req.params.id
    ]
  );
  const updated = await db.get(`SELECT * FROM customers WHERE id = ?`, [req.params.id]);
  res.json(updated);
});

app.delete('/customers/:id', async (req, res) => {
  const db = await getDb();
  await db.run(`DELETE FROM customers WHERE id = ?`, [req.params.id]);
  res.status(204).send();
});

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app;
