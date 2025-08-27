import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log('Creating admin user...');
    
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await prisma.user.upsert({
      where: { username: 'admin' },
      update: {
        password: hashedPassword,
        role: 'admin'
      },
      create: {
        username: 'admin',
        email: 'admin@gamehost.com',
        password: hashedPassword,
        role: 'admin'
      }
    });

    console.log('✓ Admin user created successfully:');
    console.log(`  Username: ${admin.username}`);
    console.log(`  Email: ${admin.email}`);
    console.log('  Password: admin123');
    console.log('\n⚠️  Please change the default password after first login!');
  } catch (error) {
    console.error('✗ Error creating admin user:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  createAdmin();
}

export { createAdmin };