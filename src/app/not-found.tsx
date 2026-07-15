import Link from 'next/link';
import { Button } from '@/shared/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A] text-center px-4">
      <div className="text-[#C8A97E] text-9xl font-bold font-playfair mb-4">404</div>
      <h2 className="text-2xl md:text-3xl text-white font-playfair font-bold mb-4">
        Halaman Tidak Ditemukan
      </h2>
      <p className="text-[#8A8A8E] max-w-md mx-auto mb-8">
        Maaf, halaman yang Anda cari mungkin telah dihapus, namanya diubah, atau tidak tersedia untuk sementara waktu.
      </p>
      <Link href="/">
        <Button variant="outline">
          Kembali ke Beranda
        </Button>
      </Link>
    </div>
  );
}
