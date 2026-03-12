import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import bcrypt from 'bcryptjs';
import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? '' });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@barbearia.com';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'admin123';
  const adminName = process.env.ADMIN_NAME ?? 'Administrador';

  const existingAdmin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
    console.log(`✅ Admin criado: ${adminEmail} / ${adminPassword}`);
  } else {
    console.log('ℹ️  Admin já existe, seed ignorado.');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
