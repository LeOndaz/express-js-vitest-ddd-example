import { z } from 'zod';
import * as process from 'node:process';
import dotenv from 'dotenv';


dotenv.config();

export const env = z.object({
  NODE_ENV: z.enum(['dev', 'staging', 'prod']),
  HOST: z.string(),
  PORT: z.coerce.number().min(1024).max(65536), // 1024 is the first free non-reserved port in the OS
  JWT_SECRET: z.string().min(32),
  
  DATABASE_HOST: z.string().min(1),
  DATABASE_PORT: z.coerce.number(),
  DATABASE_USER: z.string().min(1),
  DATABASE_PASSWORD: z.string().min(1),
  DATABASE_NAME: z.string().min(1),
}).parse(process.env);