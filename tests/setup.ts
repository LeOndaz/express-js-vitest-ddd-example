import { env } from '../src/common/env';
import pg from 'pg';
import { logger } from '../src/common/utils/logger';
import { GlobalSetupContext } from 'vitest/node';

declare module 'vitest' {
  export interface ProvidedContext {
    testDB: string;
  }
}

export default async function setup ({ provide }: GlobalSetupContext) {
  const testDbName = '__testingdb__';
  
  // TODO: can be used to connect to a different database instance for testing
  const opts = {
    user: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    host: env.DATABASE_HOST,
    port: env.DATABASE_PORT,
    database: env.DATABASE_NAME,  // connect to original db first
  };
  
  const client = new pg.Client(opts);
  await client.connect();
  
  provide('testDB', testDbName);
  
  logger.info(`conntected to ${testDbName}`);

  await client.query(`CREATE DATABASE ${pg.escapeIdentifier(testDbName)}`);
  
  return async () => {
    await client.query(`DROP DATABASE ${pg.escapeIdentifier(testDbName)}`);
  };
}