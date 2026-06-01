"use client";

import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { CAMPAIGN } from "@/lib/constants/campaign";

const SOCIAL_LINKS = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/satarobo",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@satarobo",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005.8 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1.84-.1z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@satarobo",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 md:pt-16 pb-6">
      <Container size="xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8 md:mb-10">
          {/* Col 1: Brand */}
          <div>
            <Image
              src="/logo-satarobo.jpg"
              alt="Sata Robo"
              width={140}
              height={40}
              className="h-10 md:h-12 w-auto mb-4 rounded-md"
            />
            <p className="text-sm leading-relaxed mb-4 text-gray-400">
              Trung tâm đào tạo STEM – Lập trình Robotics & AI
              <br />
              2 cơ sở tại Đà Nẵng
            </p>
            <div className="space-y-2 text-sm">
              <a
                href={`tel:${CAMPAIGN.hotlineDigits}`}
                className="flex items-center gap-2 text-gray-300 hover:text-cta-400 transition-colors"
              >
                <span>📞</span>
                <span className="font-semibold">{CAMPAIGN.hotline}</span>
              </a>
              <a
                href="mailto:info@satarobo.vn"
                className="flex items-center gap-2 text-gray-300 hover:text-cta-400 transition-colors"
              >
                <span>✉️</span>
                <span>info@satarobo.vn</span>
              </a>
            </div>
          </div>

          {/* Col 2: Khoá học */}
          <div>
            <h3 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-4">
              Khoá học
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="https://satarobo.vn/khoa-hoc/laptrinhrobot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-cta-400 transition-colors"
                >
                  Lập trình Robot (offline)
                </a>
              </li>
              <li>
                <a
                  href="https://satarobo.vn/khoa-hoc/luyenthirobosim"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-cta-400 transition-colors"
                >
                  Luyện thi RoboSim (online)
                </a>
              </li>
              <li>
                <a
                  href="https://satarobo.vn/khoa-hoc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-cta-400 transition-colors"
                >
                  Tất cả khoá học
                </a>
              </li>
              <li>
                <a
                  href="https://satarobo.vn/hoc-cu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-cta-400 transition-colors"
                >
                  Học cụ STEM
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Cơ sở + social */}
          <div>
            <h3 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-4">
              Liên hệ
            </h3>
            <ul className="space-y-3 text-sm">
              {CAMPAIGN.locations.map((loc) => (
                <li key={loc.key} className="flex items-start gap-2 text-gray-400">
                  <span className="shrink-0 mt-0.5">📍</span>
                  <span>
                    <strong className="text-gray-300">{loc.address}</strong>
                    <br />
                    {loc.district}, {loc.city}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-5">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-2.5">
                Theo dõi
              </p>
              <div className="flex gap-3">
                {SOCIAL_LINKS.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    className="w-9 h-9 rounded-full bg-gray-800 hover:bg-cta-500 text-gray-300 hover:text-white flex items-center justify-center transition-all hover:-translate-y-0.5"
                  >
                    {s.icon}
                  </a>
                ))}
                <a
                  href={`https://zalo.me/${CAMPAIGN.hotlineDigits}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Zalo"
                  className="w-9 h-9 rounded-full bg-gray-800 hover:bg-[#0068FF] text-gray-300 hover:text-white flex items-center justify-center transition-all hover:-translate-y-0.5 font-bold text-sm"
                >
                  Z
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-gray-800 text-center md:text-left md:flex md:items-center md:justify-between gap-4">
          <p className="text-xs text-gray-500 mb-2 md:mb-0">
            Công ty Cổ phần Công nghệ Giáo dục Sata Robo
          </p>
          <p className="text-xs text-gray-500">
            {`© ${new Date().getFullYear()} Sata Robo. Bảo lưu mọi quyền.`}
          </p>
        </div>
      </Container>
    </footer>
  );
}
