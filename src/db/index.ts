import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { env } from '../common/env';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { logger } from '../common/utils/logger';

export const getDb = async (opts: pg.ClientConfig) => {
  const client = new pg.Client(opts);

  await client.connect();

  logger.info(`connected to: ${opts.database}`);

  const db = drizzle(client);
  
  await migrate(db, {
    migrationsFolder: env.MIGRATIONS_DIR,
  });

  logger.info('database migrated successfully');

  return db;
};

export const db = await getDb({
  user: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
  host: env.DATABASE_HOST,
  port: env.DATABASE_PORT,
  database: env.DATABASE_NAME,
});
