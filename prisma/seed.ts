import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...\n');

  
  const adminPassword = await bcrypt.hash('admin123', 12);
  
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@haloarsitek.com' },
    update: {},
    create: {
      email: 'admin@haloarsitek.com',
      name: 'Admin HaloArsitek',
      passwordHash: adminPassword,
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });
  console.log(`✅ Admin created: ${admin.email} (password: admin123)`);

  // ─── 2. Seed Project Categories & Projects ──────────────────────────────────
  const projectCategoriesData = [
    { name: 'Residensial', slug: 'residensial', description: 'Kategori proyek rumah tinggal dan residensial.' },
    { name: 'Komersial', slug: 'komersial', description: 'Kategori proyek komersial seperti kantor, cafe, dan resort.' },
    { name: 'Interior', slug: 'interior', description: 'Kategori proyek desain interior.' },
  ];

  const projectCategories = await Promise.all(
    projectCategoriesData.map((c) =>
      prisma.projectCategory.upsert({
        where: { slug: c.slug },
        update: {},
        create: c,
      })
    )
  );
  console.log(`✅ ${projectCategories.length} project categories seeded`);

  const categoryMap = projectCategories.reduce((acc, cat) => {
    acc[cat.slug] = cat.id;
    return acc;
  }, {} as Record<string, string>);

  const projectsData = [
    {
      title: 'Villa Bali Modern',
      slug: 'villa-bali-modern',
      categoryId: categoryMap['residensial'],
      year: 2024,
      location: 'Ubud, Bali',
      area: '450 m²',
      description: 'Villa modern 2 lantai dengan konsep tropical minimalist. Perpaduan material beton ekspos, kayu jati, dan kaca lebar menciptakan harmoni antara arsitektur kontemporer dan alam Bali.',
      coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=720&h=1080&fit=crop',
      images: JSON.stringify([]),
      isPublished: true,
      sortOrder: 1,
    },
    {
      title: 'Kantor Kreatif Sudirman',
      slug: 'kantor-kreatif-sudirman',
      categoryId: categoryMap['komersial'],
      year: 2024,
      location: 'Jakarta Selatan',
      area: '1.200 m²',
      description: 'Ruang kerja kolaboratif 3 lantai dengan desain industrial modern. Open floor plan, area breakout, dan rooftop garden untuk produktivitas tim kreatif.',
      coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=720&h=1080&fit=crop',
      images: JSON.stringify([]),
      isPublished: true,
      sortOrder: 2,
    },
    {
      title: 'Rumah Tropis Kemang',
      slug: 'rumah-tropis-kemang',
      categoryId: categoryMap['residensial'],
      year: 2023,
      location: 'Kemang, Jakarta',
      area: '320 m²',
      description: 'Hunian keluarga bergaya tropis kontemporer. Courtyard terbuka di tengah rumah menghadirkan sirkulasi udara alami dan cahaya matahari yang optimal.',
      coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=720&h=1080&fit=crop',
      images: JSON.stringify([]),
      isPublished: true,
      sortOrder: 3,
    },
    {
      title: 'Apartemen Minimalis BSD',
      slug: 'apartemen-minimalis-bsd',
      categoryId: categoryMap['interior'],
      year: 2023,
      location: 'BSD City, Tangerang',
      area: '85 m²',
      description: 'Redesain total apartemen 2BR menjadi hunian minimalis bergaya Japandi. Furnitur built-in dan palette kayu-putih menciptakan kesan luas dan tenang.',
      coverImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=720&h=1080&fit=crop',
      images: JSON.stringify([]),
      isPublished: true,
      sortOrder: 4,
    },
    {
      title: 'Resort & Spa Lombok',
      slug: 'resort-spa-lombok',
      categoryId: categoryMap['komersial'],
      year: 2023,
      location: 'Senggigi, Lombok',
      area: '2.500 m²',
      description: 'Kompleks resort boutique 12 villa dengan spa dan infinity pool menghadap laut. Arsitektur lokal Sasak diinterpretasi ulang dengan sentuhan modern.',
      coverImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=720&h=1080&fit=crop',
      images: JSON.stringify([]),
      isPublished: true,
      sortOrder: 5,
    },
    {
      title: 'Café & Roastery Bandung',
      slug: 'cafe-roastery-bandung',
      categoryId: categoryMap['komersial'],
      year: 2022,
      location: 'Dago, Bandung',
      area: '180 m²',
      description: 'Kedai kopi specialty dengan area roasting terbuka. Desain industrial-warm menggunakan bata ekspos, baja hitam, dan pencahayaan ambient.',
      coverImage: 'https://images.unsplash.com/photo-1600566753086-00f18f6b4fb2?w=720&h=1080&fit=crop',
      images: JSON.stringify([]),
      isPublished: true,
      sortOrder: 6,
    },
  ];

  await prisma.project.deleteMany(); // Clear existing projects to avoid unique constraint issues if modifying existing
  for (const p of projectsData) {
    await prisma.project.create({
      data: p,
    });
  }
  console.log(`✅ ${projectsData.length} projects seeded`);

  // ─── 2b. Seed News Categories & News ───────────────────────────────────────
  const newsCategoriesData = [
    { name: 'Tips & Trik', slug: 'tips-trik', description: 'Tips dan trik seputar arsitektur dan interior.' },
    { name: 'Inspirasi Desain', slug: 'inspirasi-desain', description: 'Kumpulan inspirasi desain untuk hunian Anda.' },
  ];

  const newsCategories = await Promise.all(
    newsCategoriesData.map((c) =>
      prisma.newsCategory.upsert({
        where: { slug: c.slug },
        update: {},
        create: c,
      })
    )
  );
  console.log(`✅ ${newsCategories.length} news categories seeded`);

  const newsCatMap = newsCategories.reduce((acc, cat) => {
    acc[cat.slug] = cat.id;
    return acc;
  }, {} as Record<string, string>);

  const newsData = [
    {
      title: 'Tren Arsitektur 2026: Eco-friendly Living',
      slug: 'tren-arsitektur-2026-eco-friendly-living',
      categoryId: newsCatMap['inspirasi-desain'],
      content: 'Tahun 2026 membawa angin segar dalam dunia arsitektur dengan semakin populernya konsep eco-friendly living. Penggunaan material daur ulang dan efisiensi energi menjadi prioritas utama.',
      coverImage: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=720&h=1080&fit=crop',
      isPublished: true,
    },
    {
      title: '5 Cara Menata Interior Apartemen Studio',
      slug: '5-cara-menata-interior-apartemen-studio',
      categoryId: newsCatMap['tips-trik'],
      content: 'Menata apartemen studio memang gampang-gampang susah. Kuncinya ada pada pemilihan furnitur multifungsi dan pencahayaan yang tepat agar ruangan terasa lebih lega.',
      coverImage: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=720&h=1080&fit=crop',
      isPublished: true,
    },
  ];

  await prisma.news.deleteMany();
  for (const n of newsData) {
    await prisma.news.create({
      data: n,
    });
  }
  console.log(`✅ ${newsData.length} news seeded`);

  // ─── 3. Seed Testimonials ──────────────────────────────────────────────────
  const testimonialsData = [
    { quote: 'HaloArsitek benar-benar memahami visi kami. Rumah impian kami terwujud melampaui ekspektasi. Setiap detail dipikirkan dengan sangat matang.', name: 'Arif & Sarah Pratama', role: 'Pemilik Villa Bali Modern', project: 'Villa Bali Modern', isPublished: true, sortOrder: 1 },
    { quote: 'Proses desainnya sangat profesional dan komunikatif. Tim HaloArsitek selalu responsif dan memberikan solusi kreatif untuk setiap tantangan.', name: 'Diana Kusuma', role: 'CEO, PT Kreasi Digital', project: 'Kantor Kreatif Sudirman', isPublished: true, sortOrder: 2 },
    { quote: 'Dari konsultasi awal hingga serah terima, semuanya berjalan lancar. Desain rumah tropis kami sangat fungsional dan estetik.', name: 'Budi Hartono', role: 'Pemilik Rumah Tropis Kemang', project: 'Rumah Tropis Kemang', isPublished: true, sortOrder: 3 },
  ];

  await prisma.testimonial.deleteMany();
  for (const t of testimonialsData) {
    await prisma.testimonial.create({ data: t });
  }
  console.log(`✅ ${testimonialsData.length} testimonials seeded`);

  // ─── 4. Seed Services ──────────────────────────────────────────────────────
  const servicesData = [
    { title: 'Desain Arsitektur', description: 'Perancangan bangunan dari konsep hingga gambar kerja detail. Residensial, komersial, dan publik.', icon: 'Building', isPublished: true, sortOrder: 1 },
    { title: 'Desain Interior', description: 'Tata ruang yang fungsional dan estetik. Dari pemilihan material hingga furniture custom.', icon: 'Armchair', isPublished: true, sortOrder: 2 },
    { title: 'Landscape Design', description: 'Desain taman, hardscape, dan ruang luar yang menyatu harmonis dengan arsitektur bangunan.', icon: 'TreePine', isPublished: true, sortOrder: 3 },
    { title: 'Konsultasi', description: 'Konsultasi arsitektur dan perizinan. Evaluasi lahan, studi kelayakan, dan manajemen proyek.', icon: 'MessageCircle', isPublished: true, sortOrder: 4 },
  ];

  await prisma.service.deleteMany();
  for (const s of servicesData) {
    await prisma.service.create({ data: s });
  }
  console.log(`✅ ${servicesData.length} services seeded`);

  // ─── 5. Seed Team Members ─────────────────────────────────────────────────
  const teamData = [
    { name: 'Rendra Prasetya', role: 'Principal Architect', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face', isPublished: true, sortOrder: 1 },
    { name: 'Maya Andini', role: 'Head of Interior', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face', isPublished: true, sortOrder: 2 },
    { name: 'Fajar Nugroho', role: 'Senior Architect', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face', isPublished: true, sortOrder: 3 },
  ];

  await prisma.teamMember.deleteMany();
  for (const t of teamData) {
    await prisma.teamMember.create({ data: t });
  }
  console.log(`✅ ${teamData.length} team members seeded`);

  // ─── 6. Seed Site Settings ─────────────────────────────────────────────────
  const settingsData = [
    { key: 'hero_tagline', value: 'Menciptakan Ruang, Membangun Cerita', type: 'STRING' as const },
    { key: 'hero_subtitle', value: 'Studio arsitektur profesional dengan pengalaman 15+ tahun', type: 'STRING' as const },
    { key: 'about_description', value: 'Kami adalah tim arsitek berpengalaman yang berkomitmen menciptakan karya arsitektur yang fungsional, estetik, dan berkelanjutan.', type: 'STRING' as const },
    { key: 'stat_years', value: '15', type: 'NUMBER' as const },
    { key: 'stat_projects', value: '200', type: 'NUMBER' as const },
    { key: 'stat_awards', value: '50', type: 'NUMBER' as const },
    { key: 'stat_clients', value: '180', type: 'NUMBER' as const },
    { key: 'contact_email', value: 'hello@haloarsitek.com', type: 'STRING' as const },
    { key: 'contact_phone', value: '+62 812 3456 7890', type: 'STRING' as const },
    { key: 'contact_whatsapp', value: '6281234567890', type: 'STRING' as const },
    { key: 'contact_address', value: 'Jl. Arsitektur No. 42, Jakarta Selatan, DKI Jakarta 12345', type: 'STRING' as const },
    { key: 'social_instagram', value: 'https://instagram.com/haloarsitek', type: 'STRING' as const },
    { key: 'social_linkedin', value: 'https://linkedin.com/company/haloarsitek', type: 'STRING' as const },
  ];

  for (const s of settingsData) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }
  console.log(`✅ ${settingsData.length} site settings seeded`);

  console.log('\n🎉 Seeding complete!\n');
  console.log('📧 Admin Login:');
  console.log('   Email: admin@haloarsitek.com');
  console.log('   Password: admin123');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
