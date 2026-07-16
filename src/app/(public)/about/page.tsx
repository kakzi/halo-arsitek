import { createPageMetadata } from '@/shared/lib/metadata';
import { AboutContent } from '@/features/about/components/about-content';
import { prisma } from '@/shared/lib/prisma';
import { siteConfig } from '@/shared/config/site.config';

export const metadata = createPageMetadata({
  title: 'About',
  description: 'Learn about HaloArsitek — a premium architecture and interior design studio in Indonesia.',
  path: '/about',
});

export default async function AboutPage() {
  const teamMembers = await prisma.teamMember.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: 'asc' },
  });

  const dbSettings = await prisma.siteSetting.findMany();
  const getSetting = (key: string, fallback: string) => {
    return dbSettings.find(s => s.key === key)?.value || fallback;
  };

  const aboutDescription = getSetting('about_description', getSetting('site_description', siteConfig.description));

  const stats = {
    years: getSetting('stat_years', siteConfig.stats.years.toString()),
    projects: getSetting('stat_projects', siteConfig.stats.projects.toString()),
    awards: getSetting('stat_awards', siteConfig.stats.awards.toString()),
    clients: getSetting('stat_clients', siteConfig.stats.clients.toString()),
  };

  return <AboutContent teamMembers={teamMembers} description={aboutDescription} stats={stats} />;
}
