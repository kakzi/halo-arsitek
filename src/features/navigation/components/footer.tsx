import Link from 'next/link';
import { siteConfig } from '@/shared/config/site.config';
import { navItems } from '@/shared/config/navigation.config';
import { prisma } from '@/shared/lib/prisma';

export async function Footer() {
  const currentYear = new Date().getFullYear();
  const dbSettings = await prisma.siteSetting.findMany();
  
  const getSetting = (key: string, fallback: string) => {
    return dbSettings.find(s => s.key === key)?.value || fallback;
  };

  const name = getSetting('site_name', siteConfig.name);
  const description = getSetting('site_description', siteConfig.description);
  const email = getSetting('contact_email', siteConfig.contact.email);
  const phone = getSetting('contact_phone', siteConfig.contact.phone);
  const whatsapp = getSetting('contact_whatsapp', siteConfig.contact.whatsapp);
  const address = getSetting('contact_address', siteConfig.contact.address);
  const instagram = getSetting('social_instagram', siteConfig.social.instagram);
  const linkedin = getSetting('social_linkedin', siteConfig.social.linkedin);
  const pinterest = getSetting('social_pinterest', siteConfig.social.pinterest);

  return (
    <footer className="bg-[#050505] pt-24 pb-12 px-6 md:px-12 border-t border-[#2C2C2E]/30">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-24">
          
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link 
              href="/" 
              className="text-3xl font-bold tracking-tight text-white block mb-6"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              {name}
            </Link>
            <p className="text-[#8A8A8E] text-sm max-w-xs leading-relaxed">
              {description}
            </p>
          </div>

          {/* Nav */}
          <div>
            <h4 className="text-sm uppercase tracking-[0.2em] text-white mb-6 font-outfit">Navigasi</h4>
            <ul className="flex flex-col gap-4">
              {navItems.map((item) => (
                <li key={item.label}>
                  <Link 
                    href={item.href}
                    className="text-[#8A8A8E] hover:text-[#C8A97E] transition-colors text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm uppercase tracking-[0.2em] text-white mb-6 font-outfit">Kontak</h4>
            <ul className="flex flex-col gap-4 text-sm text-[#8A8A8E]">
              <li>
                <a href={`mailto:${email}`} className="hover:text-[#C8A97E] transition-colors">
                  {email}
                </a>
              </li>
              <li>
                <a href={`https://wa.me/${whatsapp}`} className="hover:text-[#C8A97E] transition-colors">
                  {phone}
                </a>
              </li>
              <li className="leading-relaxed pt-2">
                {address}
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm uppercase tracking-[0.2em] text-white mb-6 font-outfit">Sosial</h4>
            <ul className="flex flex-col gap-4">
              <li>
                <a href={instagram} className="text-[#8A8A8E] hover:text-[#C8A97E] transition-colors text-sm">
                  Instagram
                </a>
              </li>
              <li>
                <a href={linkedin} className="text-[#8A8A8E] hover:text-[#C8A97E] transition-colors text-sm">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href={pinterest} className="text-[#8A8A8E] hover:text-[#C8A97E] transition-colors text-sm">
                  Pinterest
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[#2C2C2E]/30 gap-4">
          <p className="text-[#8A8A8E] text-xs">
            © {currentYear} {name}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-[#8A8A8E] hover:text-white transition-colors text-xs">Privacy Policy</Link>
            <Link href="/terms" className="text-[#8A8A8E] hover:text-white transition-colors text-xs">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
