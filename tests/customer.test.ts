import request from 'supertest';
import app from '../src/server';
import { getDb } from '../src/db';

beforeEach(async () => {
  const db = await getDb();
  await db.exec('DELETE FROM customers');
});

describe('Customers API', () => {
  it('should create and list customers', async () => {
    const customer = {
      name: 'João',
      email: 'joao@example.com',
      password: 'senha123',
      whatsapp: '5511999999999',
      status: 'ACTIVE'
    };

    const createRes = await request(app).post('/customers').send(customer);
    expect(createRes.status).toBe(201);
    expect(createRes.body).toMatchObject({
      name: customer.name,
      email: customer.email,
      whatsapp: customer.whatsapp,
      status: customer.status
    });

    const listRes = await request(app).get('/customers');
    expect(listRes.status).toBe(200);
    expect(listRes.body.length).toBe(1);
  });
});
