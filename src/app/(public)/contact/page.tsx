import { createPageMetadata } from '@/shared/lib/metadata';
import { ContactContent } from '@/features/contact/components/contact-content';
import { prisma } from '@/shared/lib/prisma';
import { siteConfig } from '@/shared/config/site.config';

export const metadata = createPageMetadata({
  title: 'Contact',
  description: 'Get in touch with HaloArsitek for your architecture and interior design needs.',
  path: '/contact',
});

export default async function ContactPage() {
  const dbSettings = await prisma.siteSetting.findMany();
  const getSetting = (key: string, fallback: string) => {
    return dbSettings.find(s => s.key === key)?.value || fallback;
  };

  const contactSettings = {
    email: getSetting('contact_email', siteConfig.contact.email),
    phone: getSetting('contact_phone', siteConfig.contact.phone),
    whatsapp: getSetting('contact_whatsapp', siteConfig.contact.whatsapp),
    address: getSetting('contact_address', siteConfig.contact.address),
    social: {
      instagram: getSetting('social_instagram', siteConfig.social.instagram),
      linkedin: getSetting('social_linkedin', siteConfig.social.linkedin),
      pinterest: getSetting('social_pinterest', siteConfig.social.pinterest),
    }
  };

  return <ContactContent settings={contactSettings} />;
}
