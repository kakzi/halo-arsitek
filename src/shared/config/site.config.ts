export const siteConfig = {
  name: 'HaloArsitek',
  description:
    'Studio arsitektur profesional dengan pengalaman 15+ tahun. Spesialis desain rumah modern, interior premium, dan landscape.',
  url: process.env.NEXT_PUBLIC_SITE_URL 
    ? process.env.NEXT_PUBLIC_SITE_URL 
    : (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : 'https://haloarsitek.com'),
  ogImage: '/logo/logo-halo-arsitek-black.png',
  contact: {
    email: 'hello@haloarsitek.com',
    phone: '+62 812 3456 7890',
    whatsapp: '6281234567890',
    address: 'Jl. Arsitektur No. 42, Jakarta Selatan, DKI Jakarta 12345',
  },
  social: {
    instagram: 'https://instagram.com/haloarsitek',
    linkedin: 'https://linkedin.com/company/haloarsitek',
    pinterest: 'https://pinterest.com/haloarsitek',
  },
  stats: {
    years: 15,
    projects: 200,
    awards: 50,
    clients: 180,
  },
} as const;
