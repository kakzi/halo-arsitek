export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0A0A]">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-2 border-[#2C2C2E] rounded-full" />
          <div className="absolute inset-0 border-2 border-[#C8A97E] rounded-full border-t-transparent animate-spin" />
        </div>
        <div 
          className="text-[#8A8A8E] text-sm uppercase tracking-[0.2em]"
          style={{ fontFamily: 'var(--font-outfit)' }}
        >
          Memuat...
        </div>
      </div>
    </div>
  );
}
