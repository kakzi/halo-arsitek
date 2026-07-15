// ─── PROJECT DATA ───────────────────────────────────────────────────────────

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: 'residensial' | 'komersial' | 'interior';
  year: number;
  location: string;
  area: string;
  description: string;
  coverImage: string;
  images: string[];
}

export const projects: Project[] = [
  {
    id: '1',
    title: 'Villa Bali Modern',
    slug: 'villa-bali-modern',
    category: 'residensial',
    year: 2024,
    location: 'Ubud, Bali',
    area: '450 m²',
    description:
      'Villa modern 2 lantai dengan konsep tropical minimalist. Perpaduan material beton ekspos, kayu jati, dan kaca lebar menciptakan harmoni antara arsitektur kontemporer dan alam Bali.',
    coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=720&h=1080&fit=crop',
    images: [],
  },
  {
    id: '2',
    title: 'Kantor Kreatif Sudirman',
    slug: 'kantor-kreatif-sudirman',
    category: 'komersial',
    year: 2024,
    location: 'Jakarta Selatan',
    area: '1.200 m²',
    description:
      'Ruang kerja kolaboratif 3 lantai dengan desain industrial modern. Open floor plan, area breakout, dan rooftop garden untuk produktivitas tim kreatif.',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=720&h=1080&fit=crop',
    images: [],
  },
  {
    id: '3',
    title: 'Rumah Tropis Kemang',
    slug: 'rumah-tropis-kemang',
    category: 'residensial',
    year: 2023,
    location: 'Kemang, Jakarta',
    area: '320 m²',
    description:
      'Hunian keluarga bergaya tropis kontemporer. Courtyard terbuka di tengah rumah menghadirkan sirkulasi udara alami dan cahaya matahari yang optimal.',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=720&h=1080&fit=crop',
    images: [],
  },
  {
    id: '4',
    title: 'Apartemen Minimalis BSD',
    slug: 'apartemen-minimalis-bsd',
    category: 'interior',
    year: 2023,
    location: 'BSD City, Tangerang',
    area: '85 m²',
    description:
      'Redesain total apartemen 2BR menjadi hunian minimalis bergaya Japandi. Furnitur built-in dan palette kayu-putih menciptakan kesan luas dan tenang.',
    coverImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=720&h=1080&fit=crop',
    images: [],
  },
  {
    id: '5',
    title: 'Resort & Spa Lombok',
    slug: 'resort-spa-lombok',
    category: 'komersial',
    year: 2023,
    location: 'Senggigi, Lombok',
    area: '2.500 m²',
    description:
      'Kompleks resort boutique 12 villa dengan spa dan infinity pool menghadap laut. Arsitektur lokal Sasak diinterpretasi ulang dengan sentuhan modern.',
    coverImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=720&h=1080&fit=crop',
    images: [],
  },
  {
    id: '6',
    title: 'Café & Roastery Bandung',
    slug: 'cafe-roastery-bandung',
    category: 'komersial',
    year: 2022,
    location: 'Dago, Bandung',
    area: '180 m²',
    description:
      'Kedai kopi specialty dengan area roasting terbuka. Desain industrial-warm menggunakan bata ekspos, baja hitam, dan pencahayaan ambient.',
    coverImage: 'https://images.unsplash.com/photo-1600566753086-00f18f6b4fb2?w=720&h=1080&fit=crop',
    images: [],
  },
];

// ─── TESTIMONIALS ───────────────────────────────────────────────────────────

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  project: string;
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    quote:
      'HaloArsitek benar-benar memahami visi kami. Rumah impian kami terwujud melampaui ekspektasi. Setiap detail dipikirkan dengan sangat matang.',
    name: 'Arif & Sarah Pratama',
    role: 'Pemilik Villa Bali Modern',
    project: 'Villa Bali Modern',
  },
  {
    id: '2',
    quote:
      'Proses desainnya sangat profesional dan komunikatif. Tim HaloArsitek selalu responsif dan memberikan solusi kreatif untuk setiap tantangan.',
    name: 'Diana Kusuma',
    role: 'CEO, PT Kreasi Digital',
    project: 'Kantor Kreatif Sudirman',
  },
  {
    id: '3',
    quote:
      'Dari konsultasi awal hingga serah terima, semuanya berjalan lancar. Desain rumah tropis kami sangat fungsional dan estetik.',
    name: 'Budi Hartono',
    role: 'Pemilik Rumah Tropis Kemang',
    project: 'Rumah Tropis Kemang',
  },
];

// ─── SERVICES ───────────────────────────────────────────────────────────────

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string; // emoji for MVP, replace with SVG/3D later
}

export const services: Service[] = [
  {
    id: '1',
    title: 'Desain Arsitektur',
    description:
      'Perancangan bangunan dari konsep hingga gambar kerja detail. Residensial, komersial, dan publik.',
    icon: '🏛️',
  },
  {
    id: '2',
    title: 'Desain Interior',
    description:
      'Tata ruang yang fungsional dan estetik. Dari pemilihan material hingga furniture custom.',
    icon: '🪑',
  },
  {
    id: '3',
    title: 'Landscape Design',
    description:
      'Desain taman, hardscape, dan ruang luar yang menyatu harmonis dengan arsitektur bangunan.',
    icon: '🌿',
  },
  {
    id: '4',
    title: 'Konsultasi',
    description:
      'Konsultasi arsitektur dan perizinan. Evaluasi lahan, studi kelayakan, dan manajemen proyek.',
    icon: '💬',
  },
];

// ─── TEAM ───────────────────────────────────────────────────────────────────

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
}

export const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Rendra Prasetya',
    role: 'Principal Architect',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
  },
  {
    id: '2',
    name: 'Maya Andini',
    role: 'Head of Interior',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face',
  },
  {
    id: '3',
    name: 'Fajar Nugroho',
    role: 'Senior Architect',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
  },
];
