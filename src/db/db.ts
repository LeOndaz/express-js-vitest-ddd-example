import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { env } from '@env/';

export const getDb = () => {
  const client = new pg.Client({
    user: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    host: env.DATABASE_HOST,
    port: env.PORT,
    database: env.DATABASE_NAME,
  });

  return drizzle(client);
};

export const db = getDb();
