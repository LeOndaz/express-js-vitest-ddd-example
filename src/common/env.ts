import { z } from 'zod';
import dotenv from 'dotenv';


dotenv.config();

export const env = z.object({
  NODE_ENV: z.enum(['test', 'dev', 'staging', 'prod']),
  HOST: z.string(),
  PORT: z.coerce.number().min(1024).max(65536), // 1024 is the first free non-reserved port in the OS
  
  DATABASE_HOST: z.string().min(1),
  DATABASE_PORT: z.coerce.number(),
  DATABASE_USER: z.string().min(1),
  DATABASE_PASSWORD: z.string().min(1),
  DATABASE_NAME: z.string().min(1),
  
  REDIS_HOST: z.string().min(1),
  REDIS_PORT: z.coerce.number(),
  
  TOKEN_AGE_MINUTES: z.coerce.number().min(5),

  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD: z.string().min(8),

  MIGRATIONS_DIR: z.string(),
}).parse(process.env);