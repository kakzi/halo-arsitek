import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    const count = await prisma.pageView.count();
    console.log('Total PageViews:', count);
    const sample = await prisma.pageView.findFirst();
    console.log('Sample:', sample);
  } catch(e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
