import { CAMPAIGN } from "@/lib/constants/campaign";

export function FloatingZalo() {
  return (
    <div className="fixed right-5 bottom-5 z-[60]">
      <a
        href={`tel:${CAMPAIGN.hotlineDigits}`}
        aria-label="Gọi hotline"
        className="relative grid place-items-center w-14 h-14 rounded-full bg-[#ed2d22] text-white shadow-[0_16px_34px_-14px_rgb(120_20_10/0.5)] transition-transform hover:scale-110"
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full border-2 border-[#ed2d22] animate-ping"
        />
        <svg
          className="relative w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
        </svg>
      </a>
    </div>
  );
}
