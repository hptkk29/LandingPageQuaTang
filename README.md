# Landing Page Quà Tặng Trải Nghiệm RoboSim 1-1 — Sata Robo

Landing page nhận lead cho chương trình tặng 29 suất trải nghiệm Robotics miễn phí
1 kèm 1 cùng chuyên gia (90 phút/suất). Dành cho học sinh lớp 1-8, tổ chức tại 2 cơ sở
Sata Robo Đà Nẵng.

## Stack
- **Framework:** Next.js 15 (App Router) + React 19
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Forms:** react-hook-form + zod
- **Animation:** Framer Motion
- **Design Intelligence:** UI/UX Pro Max skill (uupm.cc)
- **Form backend:** Google Apps Script Web App → Google Sheet
- **Deploy:** Vercel

## Production
- Domain: https://quatang.edu.vn
- Repo: https://github.com/hptkk29/LandingPageQuaTang

## Local development

```bash
pnpm install
cp .env.example .env.local
# Điền NEXT_PUBLIC_GOOGLE_SCRIPT_URL sau khi setup Google Apps Script
pnpm dev
```

Open http://localhost:3000

## Build

```bash
pnpm build
pnpm start
```

## Project structure

```
LandingPageQuaTang/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout + SEO metadata
│   ├── page.tsx            # Landing page chính
│   ├── globals.css         # Tailwind v4 entry
│   └── api/lead/route.ts   # API proxy → Google Apps Script (Phase 2)
├── components/
│   ├── ui/                 # shadcn/ui base components
│   └── sections/           # Landing page sections (Phase 3)
├── lib/                    # Utilities, validators
├── public/                 # Static assets (logos, images)
└── .claude/skills/         # UI/UX Pro Max design intelligence
```

## Owner
Công Ty Cổ Phần Công Nghệ Giáo Dục Sata Robo
258 Lê Thanh Nghị, Hoà Cường, Đà Nẵng
Hotline: 0818.823.720
