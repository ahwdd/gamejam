import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const username = process.env.ADMIN_USERNAME ?? 'admin';
  const password = process.env.ADMIN_PASSWORD ?? 'admin123';
  const email = process.env.ADMIN_EMAIL ?? 'admin@studenthub.com';

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.admin.upsert({
    where: { username },
    update: {
      passwordHash,
      email,
      firstName: 'System',
      lastName: 'Administrator',
      role: 'super_admin',
      isActive: true,
      updatedAt: new Date()
    },
    create: {
      username,
      passwordHash,
      email,
      firstName: 'System',
      lastName: 'Administrator',
      role: 'super_admin',
      isActive: true
    }
  });

  console.log(`✅ Admin upserted: ${admin.username} (id: ${admin.id})`);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
