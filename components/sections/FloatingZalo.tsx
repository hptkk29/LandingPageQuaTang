import { CAMPAIGN } from "@/lib/constants/campaign";

export function FloatingZalo() {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 md:gap-3 px-2">
      <a
        href="#dang-ky"
        className="inline-flex items-center gap-2 bg-gradient-to-r from-cta-500 to-cta-600 hover:from-cta-600 hover:to-cta-700 text-white font-display font-extrabold text-sm md:text-base px-5 md:px-7 py-3 md:py-3.5 rounded-pill shadow-cta animate-pulse-glow transition-all hover:-translate-y-0.5 whitespace-nowrap"
      >
        🎁 Đăng ký ngay
      </a>
      <a
        href={`https://zalo.me/${CAMPAIGN.hotlineDigits}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat Zalo Sata Robo"
        className="inline-flex items-center gap-2 bg-[#0068FF] hover:bg-[#0055CC] text-white font-display font-bold text-sm md:text-base px-4 md:px-5 py-3 md:py-3.5 rounded-pill shadow-lg transition-all hover:-translate-y-0.5 whitespace-nowrap"
      >
        <span className="w-6 h-6 rounded-full bg-white text-[#0068FF] flex items-center justify-center font-bold text-sm">
          Z
        </span>
        <span className="hidden sm:inline">Zalo</span>
      </a>
    </div>
  );
}
