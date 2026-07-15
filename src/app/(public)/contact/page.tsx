import { createPageMetadata } from '@/shared/lib/metadata';
import { ContactContent } from '@/features/contact/components/contact-content';

export const metadata = createPageMetadata({
  title: 'Contact',
  description: 'Get in touch with HaloArsitek for your architecture and interior design needs.',
  path: '/contact',
});

export default function ContactPage() {
  return <ContactContent />;
}
