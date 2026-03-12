import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

console.log(`Database PATH: ${env('DATABASE_URL')}`);

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx src/prisma/seed.ts',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
