import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { join } from 'path';

sqlite3.verbose();

let db: Database | null = null;

export async function getDb(): Promise<Database> {
  if (!db) {
    db = await open({
      filename: join(__dirname, '..', 'clientes.db'),
      driver: sqlite3.Database
    });
    await db.exec(`CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      whatsapp TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('ACTIVE','INACTIVE'))
    )`);
  }
  return db;
}
