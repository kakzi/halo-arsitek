const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const views = await prisma.pageView.findMany();
  console.log('Total views:', views.length);
  const deviceMap = {};
  views.forEach(v => {
    let dev = 'Unknown';
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(v.userAgent)) dev = 'Mobile';
    else if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(v.userAgent)) dev = 'Tablet';
    else dev = 'Desktop';
    deviceMap[dev] = (deviceMap[dev] || 0) + 1;
  });
  console.log('Devices:', deviceMap);
  process.exit(0);
}
main();
