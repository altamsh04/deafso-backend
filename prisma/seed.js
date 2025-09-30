const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Hash passwords
  const hashedPassword = await bcrypt.hash('password123', 12);

  // Create teachers
  console.log('👨‍🏫 Creating teachers...');
  const teacher1 = await prisma.teacher.upsert({
    where: { email: 'john.doe@deafso.com' },
    update: {},
    create: {
      fullname: 'John Doe',
      email: 'john.doe@deafso.com',
      mobile: '9876543210',
      password: hashedPassword,
    },
  });

  const teacher2 = await prisma.teacher.upsert({
    where: { email: 'jane.smith@deafso.com' },
    update: {},
    create: {
      fullname: 'Jane Smith',
      email: 'jane.smith@deafso.com',
      mobile: '9876543211',
      password: hashedPassword,
    },
  });

  console.log('✅ Teachers created:', teacher1.fullname, 'and', teacher2.fullname);


  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 