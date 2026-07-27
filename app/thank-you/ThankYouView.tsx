"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

import { trackMetaCustomEvent } from "@/components/analytics/MetaPixel";
import { ZALO_OA_URL } from "@/lib/constants/misa";

import logoSataRobo from "./logo-satarobo-tk.png";

/* Số giây tự chuyển sang Zalo OA (bản mẫu: 10s, cuộn trang thì đếm lại từ đầu) */
const GIAY_TU_CHUYEN = 10;

/* Bảng màu confetti — copy nguyên từ bản mẫu */
const MAU_CONFETTI = ["#F7941E", "#6B21A8", "#FFC94D", "#C084FC", "#FF6B9D"];

type Hat = {
  x: number;
  y: number;
  w: number;
  h: number;
  vy: number;
  vx: number;
  r: number;
  vr: number;
  c: string;
};

/* Bản mẫu chỉ ghi textContent nên phần còn lại của DOM không bị đụng tới.
   Ở React, mọi state đổi mỗi giây (đồng hồ, đếm lùi) phải nằm trong component
   LÁ nhỏ nhất — nếu để ở component gốc thì cả cây (2 SVG lớn + 2 next/image +
   8 section) bị reconcile lại 1 lần/giây. */

/* ---------- ④ Số suất: 12–18, nhất quán per khách ---------- */
type SuatLuu = { n: number; d: string; t: number };

function laSuatLuu(v: unknown): v is SuatLuu {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return typeof o.n === "number" && typeof o.d === "string" && typeof o.t === "number";
}

function homNay(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function tinhSuat(): number {
  const macDinh = 15;
  try {
    const raw = localStorage.getItem("sr_seats");
    const parsed: unknown = raw ? JSON.parse(raw) : null;

    let data: SuatLuu;
    if (laSuatLuu(parsed) && parsed.d === homNay()) {
      data = parsed;
    } else {
      data = {
        n: 12 + Math.floor(Math.random() * 7) /* 12–18 */,
        d: homNay(),
        t: Date.now(),
      };
      localStorage.setItem("sr_seats", JSON.stringify(data));
    }

    /* mỗi ~3h giảm 1 suất, sàn 12 */
    const troiQua = Math.floor((Date.now() - data.t) / (3 * 60 * 60 * 1000));
    return Math.max(12, data.n - troiQua);
  } catch {
    /* private mode: số cố định, không crash */
    return macDinh;
  }
}

function pad(n: number): string {
  return (n < 10 ? "0" : "") + n;
}

/* ══════════ ④ Số suất — component lá ══════════ */
function SoSuat() {
  /* Số suất nằm ở localStorage nên server không thể biết. Render đầu (SSR +
     hydrate) phải là placeholder "–" y như bản mẫu, chỉ sau khi hydrate xong mới
     thay bằng số thật → tránh hydration mismatch. Chạy đúng 1 lần khi mount. */
  const [soSuat, setSoSuat] = useState<string>("–");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSoSuat(String(tinhSuat()));
  }, []);

  return <span className="so">{soSuat}</span>;
}

/* ══════════ ④ Đồng hồ đếm về 23:59:59 giờ máy khách — component lá ══════════ */
function DongHo() {
  const [gio, setGio] = useState<string>("--");
  const [phut, setPhut] = useState<string>("--");
  const [giay, setGiay] = useState<string>("--");
  const [gapGap, setGapGap] = useState(false);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const het = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59,
        999
      );
      const conLai = Math.max(0, Math.floor((het.getTime() - now.getTime()) / 1000));
      setGio(pad(Math.floor(conLai / 3600)));
      setPhut(pad(Math.floor((conLai % 3600) / 60)));
      setGiay(pad(conLai % 60));
      setGapGap(conLai < 3600);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className={gapGap ? "dongho gap" : "dongho"}>
      <div className="o">
        <b>{gio}</b>
        <span>Giờ</span>
      </div>
      <div className="o">
        <b>{phut}</b>
        <span>Phút</span>
      </div>
      <div className="o">
        <b>{giay}</b>
        <span>Giây</span>
      </div>
    </div>
  );
}

/* ══════════ ⑤ Auto-redirect 10s sang Zalo OA — component lá ══════════ */
function DemLui({ huyRef }: { huyRef: RefObject<(() => void) | null> }) {
  const [demLui, setDemLui] = useState<number>(GIAY_TU_CHUYEN);
  const [anDemLui, setAnDemLui] = useState(false);

  useEffect(() => {
    let daChuyen = false;
    try {
      daChuyen = sessionStorage.getItem("sr_auto") === "1";
    } catch {
      /* private mode: coi như chưa chuyển */
    }
    /* Quay lại bằng Back trong cùng phiên → không tự chuyển nữa, ẩn dòng đếm lùi.
       Cũng là setState 1 lần khi mount vì sessionStorage chỉ đọc được ở client. */
    if (daChuyen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAnDemLui(true);
      return;
    }

    let dungLai = false;
    let conLai = GIAY_TU_CHUYEN;

    const timer = window.setInterval(() => {
      if (dungLai) {
        window.clearInterval(timer);
        return;
      }
      conLai -= 1;
      if (conLai <= 0) {
        window.clearInterval(timer);
        try {
          sessionStorage.setItem("sr_auto", "1");
        } catch {
          /* bỏ qua */
        }
        trackMetaCustomEvent("AutoRedirectOA");
        window.location.href = ZALO_OA_URL;
        return;
      }
      setDemLui(conLai);
    }, 1000);

    /* cuộn = đang đọc → reset về 10s.
       Sự kiện scroll bắn 60–120 lần/giây; chỉ ghi state khi giá trị THỰC SỰ đổi
       (tức lần cuộn đầu tiên sau mỗi nhịp đếm), các lần sau không đụng React. */
    const onScroll = () => {
      if (conLai !== GIAY_TU_CHUYEN) {
        conLai = GIAY_TU_CHUYEN;
        setDemLui(GIAY_TU_CHUYEN);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    huyRef.current = () => {
      dungLai = true;
      window.clearInterval(timer);
    };

    return () => {
      dungLai = true;
      window.clearInterval(timer);
      window.removeEventListener("scroll", onScroll);
      huyRef.current = null;
    };
  }, [huyRef]);

  return (
    <p className="dem-lui" style={anDemLui ? { display: "none" } : undefined}>
      Đang đưa ba mẹ đến trang nhận quà sau <b>{demLui}</b>s — bấm nút để nhận ngay 🎁
    </p>
  );
}

/* ══════════ ① Confetti 1 lần (canvas thuần, tôn trọng reduced-motion) ══════════ */
function Confetti() {
  const [tatConfetti, setTatConfetti] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const rm =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    /* Máy bật giảm chuyển động → không chạy hiệu ứng. Không cần gỡ canvas như bản
       mẫu vì CSS đã có @media (prefers-reduced-motion) ẩn hẳn .ty-confetti. */
    if (rm) return;

    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    cv.width = window.innerWidth;
    cv.height = window.innerHeight;

    const hat: Hat[] = [];
    for (let j = 0; j < 90; j++) {
      hat.push({
        x: Math.random() * cv.width,
        y: -20 - Math.random() * cv.height * 0.5,
        w: 6 + Math.random() * 6,
        h: 8 + Math.random() * 8,
        vy: 2 + Math.random() * 3,
        vx: -1 + Math.random() * 2,
        r: Math.random() * Math.PI,
        vr: -0.1 + Math.random() * 0.2,
        c: MAU_CONFETTI[j % MAU_CONFETTI.length],
      });
    }

    const t0 = Date.now();
    let raf = 0;
    const ve = () => {
      ctx.clearRect(0, 0, cv.width, cv.height);
      const alpha = Math.max(0, 1 - (Date.now() - t0) / 3000);
      ctx.globalAlpha = alpha;
      for (const p of hat) {
        p.x += p.vx;
        p.y += p.vy;
        p.r += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      if (alpha > 0) {
        raf = window.requestAnimationFrame(ve);
      } else {
        /* hết 3s → gỡ canvas khỏi DOM */
        setTatConfetti(true);
      }
    };
    ve();

    return () => window.cancelAnimationFrame(raf);
  }, []);

  if (tatConfetti) return null;
  return <canvas ref={canvasRef} className="ty-confetti" aria-hidden="true" />;
}

export function ThankYouView() {
  /* Component gốc KHÔNG giữ state nào → không bao giờ re-render, cây tĩnh
     (hero/robot/quyền lợi/3 bước/footer) chỉ dựng đúng 1 lần. */

  /* Hàm huỷ bộ đếm tự chuyển — do <DemLui/> gán, 2 nút CTA gọi */
  const huyTuChuyenRef = useRef<(() => void) | null>(null);

  /* bấm CTA = huỷ hẳn timer + bắn sự kiện */
  const onClickCTA = useCallback(() => {
    huyTuChuyenRef.current?.();
    try {
      sessionStorage.setItem("sr_auto", "1");
    } catch {
      /* bỏ qua */
    }
    trackMetaCustomEvent("ClickQuanTamOA");
  }, []);

  return (
    <div className="ty-root">
      <div className="bg-shape s1" aria-hidden="true" />
      <div className="bg-shape s2" aria-hidden="true" />
      <Confetti />

      <main className="khung">
        {/* ① HERO */}
        <header className="hero">
          <Image
            className="logo"
            src={logoSataRobo}
            alt="Sata Robo"
            width={400}
            height={236}
            priority
          />
          <svg className="tick" viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="42"></circle>
            <path d="M32 52 L45 64 L69 38"></path>
          </svg>
          <h1>ĐĂNG KÝ THÀNH CÔNG!</h1>
          <p>
            Cảm ơn ba mẹ đã tin tưởng Sata Robo. Đội ngũ tư vấn sẽ gọi xác nhận cho ba mẹ{" "}
            <b>trong hôm nay</b>.
          </p>
        </header>

        {/* ② QUÀ + TRUST BADGE */}
        <section className="the qua">
          <div className="robot-wrap">
            {/* mascot robot vẽ SVG theo logo: đầu cam, chi tiết tím */}
            <svg className="robot" viewBox="0 0 220 240" aria-hidden="true">
              <line
                x1="110"
                y1="18"
                x2="110"
                y2="52"
                stroke="#6B21A8"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <circle cx="110" cy="16" r="12" fill="#6B21A8" />
              <rect x="30" y="50" width="160" height="130" rx="42" fill="#F7941E" />
              <circle cx="78" cy="105" r="14" fill="#6B21A8" />
              <circle cx="142" cy="105" r="14" fill="#6B21A8" />
              <circle cx="82" cy="101" r="4.5" fill="#fff" />
              <circle cx="146" cy="101" r="4.5" fill="#fff" />
              <path
                d="M78 140 Q110 165 142 140"
                stroke="#6B21A8"
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
              />
              <rect x="14" y="92" width="16" height="46" rx="8" fill="#E07B00" />
              <rect x="190" y="92" width="16" height="46" rx="8" fill="#E07B00" />
              <g transform="translate(178,178)">
                <circle cx="0" cy="0" r="26" fill="#6B21A8" />
                <circle cx="0" cy="0" r="11" fill="#FFF8F0" />
                <g fill="#6B21A8">
                  <rect x="-5" y="-38" width="10" height="14" rx="4" />
                  <rect x="-5" y="24" width="10" height="14" rx="4" />
                  <rect x="-38" y="-5" width="14" height="10" rx="4" />
                  <rect x="24" y="-5" width="14" height="10" rx="4" />
                  <rect
                    x="-31"
                    y="-31"
                    width="12"
                    height="12"
                    rx="4"
                    transform="rotate(45 -25 -25)"
                  />
                  <rect
                    x="19"
                    y="-31"
                    width="12"
                    height="12"
                    rx="4"
                    transform="rotate(-45 25 -25)"
                  />
                  <rect
                    x="-31"
                    y="19"
                    width="12"
                    height="12"
                    rx="4"
                    transform="rotate(-45 -25 25)"
                  />
                  <rect
                    x="19"
                    y="19"
                    width="12"
                    height="12"
                    rx="4"
                    transform="rotate(45 25 25)"
                  />
                </g>
              </g>
              <rect x="62" y="186" width="52" height="34" rx="12" fill="#6B21A8" opacity=".9" />
              <rect x="70" y="194" width="36" height="18" rx="6" fill="#F3E8FF" />
            </svg>
          </div>
          <div>
            <span className="nhan">🎁 QUÀ ĐẶC BIỆT DÀNH RIÊNG CHO BA MẸ VỪA ĐĂNG KÝ</span>
            <h2>
              <span className="khoa">KHÓA LẬP TRÌNH ROBOSIM MIỄN PHÍ</span> — con học lập
              trình robot ngay tại nhà, không cần mua robot.
            </h2>
            <div className="badge-thi">
              🏆 Robosim là{" "}
              <b>
                nền tảng thi đấu chính thức suốt 5 mùa giải Cuộc thi Sáng tạo Robotics toàn
                quốc
              </b>{" "}
              (Trung ương Đoàn TNCS Hồ Chí Minh) — vòng loại quốc gia 2026 thi đúng trên nền
              tảng này. Con luyện sớm là lợi thế thật khi thi đấu.
            </div>
          </div>
        </section>

        {/* ③ QUYỀN LỢI */}
        <section className="the qloi">
          <h2>Bấm QUAN TÂM Zalo OA — ba mẹ nhận ngay:</h2>
          {/* role="list" — CSS list-style:none làm Safari/VoiceOver bỏ ngữ nghĩa danh sách */}
          <ul role="list">
            <li>
              <span className="ic" aria-hidden="true">
                🎓
              </span>
              <span>
                <b>Khóa lập trình Robosim nhập môn MIỄN PHÍ</b> — giao tự động qua Zalo ngay
                khi quan tâm
              </span>
            </li>
            <li>
              <span className="ic" aria-hidden="true">
                👨‍🏫
              </span>
              <span>
                <b>Vào nhóm học có thầy cô hướng dẫn</b> — đề luyện mỗi tuần + giờ chữa bài
                trực tiếp
              </span>
            </li>
            <li>
              <span className="ic" aria-hidden="true">
                🏆
              </span>
              <span>
                <b>Bộ đề luyện thi vòng loại</b> đúng nền tảng thi đấu quốc gia
              </span>
            </li>
            <li>
              <span className="ic" aria-hidden="true">
                📸
              </span>
              <span>
                <b>Nhận lịch học, lịch thi đấu &amp; hình ảnh hoạt động</b> của con tại trung
                tâm
              </span>
            </li>
            <li>
              <span className="ic" aria-hidden="true">
                ⚡
              </span>
              <span>
                <b>Ưu tiên nhận suất sự kiện miễn phí</b> (Robo Saturday sáng thứ 7 hằng
                tuần)
              </span>
            </li>
          </ul>
        </section>

        {/* ④ KHAN HIẾM */}
        <section className="the khan">
          <div className="suat">
            🔥 HÔM NAY CHỈ CÒN <SoSuat /> SUẤT QUÀ
          </div>
          <p className="vi-sao">
            Mỗi ngày Sata Robo chỉ trao tối đa 18 suất khóa Robosim miễn phí — để thầy cô
            hướng dẫn kịp từng bé.
          </p>
          <p className="han">⏳ Chỉ còn 1 ngày — suất quà hôm nay khép lại sau:</p>
          <DongHo />
        </section>

        {/* ⑤ CTA CHÍNH */}
        <section className="cta-khoi the" style={{ background: "transparent", boxShadow: "none" }}>
          <a className="nut-cta js-cta" href={ZALO_OA_URL} onClick={onClickCTA}>
            🎁 CLICK NHẬN QUÀ NGAY — QUAN TÂM ZALO OA SATA ROBO
          </a>
          <p className="cta-phu">Miễn phí 100% · Nhận quà tự động sau 3 giây quan tâm</p>
          <DemLui huyRef={huyTuChuyenRef} />
        </section>

        {/* ⑥ 3 BƯỚC */}
        <section className="the buoc">
          <h2>3 bước nhận quà</h2>
          <div className="buoc-luoi">
            <div className="buoc-the">
              <span className="buoc-so">1</span>
              <span>
                Bấm <b>nút nhận quà</b> phía trên
              </span>
            </div>
            <div className="buoc-the">
              <span className="buoc-so">2</span>
              <span>
                Bấm <b>“Quan tâm”</b> trên trang Zalo OA Sata Robo Academy
              </span>
            </div>
            <div className="buoc-the">
              <span className="buoc-so">3</span>
              <span>
                Mở tin nhắn chào mừng —{" "}
                <b>quà tự động gửi về Zalo của ba mẹ ngay lập tức</b> 🎉
              </span>
            </div>
          </div>
        </section>

        {/* ⑦ SOCIAL PROOF */}
        <section className="the proof">
          <p>
            ❤️ <b>Hơn 3.000 phụ huynh mỗi năm</b> tin chọn chương trình đào tạo của Sata Robo
            cho con học và luyện thi <b>Cuộc thi Sáng tạo Robotics</b>.
          </p>
        </section>

        {/* ⑧ FOOTER BRAND */}
        <footer className="chan">
          {/* alt="" — logo trang trí, dòng chữ ngay dưới đã đọc "Sata Robo Academy";
              để alt="Sata Robo" thì screen reader đọc trùng tên thương hiệu 2 lần */}
          <Image
            className="logo"
            src={logoSataRobo}
            alt=""
            width={400}
            height={236}
          />
          <p>
            <b>Sata Robo Academy</b> — Học Robotics &amp; AI cho trẻ 6–13 tuổi
          </p>
        </footer>
      </main>

      {/* thanh CTA sticky (chỉ mobile/tablet) */}
      <div className="ty-sticky-bar">
        <a className="nut-cta js-cta" href={ZALO_OA_URL} onClick={onClickCTA}>
          🎁 NHẬN QUÀ NGAY — QUAN TÂM ZALO OA
        </a>
      </div>
    </div>
  );
}
