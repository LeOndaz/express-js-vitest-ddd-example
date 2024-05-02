import 'dotenv/config';
import type { Config } from 'drizzle-kit';
import { env } from './src/common/env';

export default {
  schema: [
    './src/features/**/models/*.ts',
  ],
  out: './migrations',
  driver: 'pg',
  dbCredentials: {
    host: env.DATABASE_HOST,
    user: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    database: env.DATABASE_NAME,
    port: env.DATABASE_PORT,
  },
} satisfies Config;