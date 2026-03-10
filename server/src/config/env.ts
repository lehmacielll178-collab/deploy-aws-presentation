import 'dotenv/config';

import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  PORT: z.coerce.number().default(3000),
  ADMIN_EMAIL: z.string().email().default('admin@barbearia.com'),
  ADMIN_PASSWORD: z.string().min(6).default('admin123'),
  ADMIN_NAME: z.string().default('Administrador'),
  FRONTEND_URL: z.url().default('http://localhost:5173'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  process.exit(1);
}

export const env = _env.data;
