import { PrismaClient } from '@prisma/client';
import { parseUserAgent } from './src/shared/lib/ua-parser';

const prisma = new PrismaClient();

async function main() {
  const days = 7;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days + 1);
  startDate.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const views = await prisma.pageView.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endOfToday,
      },
    },
  });

  console.log('Views found:', views.length);
  
  const deviceMap: Record<string, number> = {};
  views.forEach((v) => {
    const parsed = parseUserAgent(v.userAgent);
    deviceMap[parsed.device] = (deviceMap[parsed.device] || 0) + 1;
  });
  console.log('Devices:', deviceMap);
}
main();
