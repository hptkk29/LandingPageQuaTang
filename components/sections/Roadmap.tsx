"use client";

import { useState } from "react";

const LEVELS = {
  basic: {
    label: "Cơ bản",
    age: "6–9 tuổi",
    title: "Khởi đầu với Robotics",
    items: [
      "Làm quen robot và tư duy lập trình qua giao diện kéo–thả trực quan",
      "Lắp ráp robot đơn giản theo hướng dẫn từng bước",
      "Hình thành tư duy logic và thói quen thử – sai – sửa",
      "Hoàn thành sản phẩm đầu tiên và thuyết trình ngắn",
    ],
  },
  advanced: {
    label: "Nâng cao",
    age: "9–11 tuổi",
    title: "Lập trình & cảm biến",
    items: [
      "Lập trình robot phức tạp hơn với điều kiện, vòng lặp",
      "Sử dụng cảm biến, động cơ để robot tự xử lý tình huống",
      "Giải các bài toán thực tế theo nhóm dự án",
      "Phân tích sa bàn, tối ưu giải pháp",
    ],
  },
  competition: {
    label: "Thi đấu",
    age: "11–13 tuổi",
    title: "Chinh phục RoboSim 2026",
    items: [
      "Lập trình tự hành nâng cao và tối ưu hiệu suất",
      "Xây dựng chiến thuật, luyện tập theo thể lệ giải đấu",
      "Chuẩn bị toàn diện cho RoboSim 2026 và các kỳ thi quốc gia",
      "Rèn kỹ năng làm việc nhóm và thuyết trình trước hội đồng",
    ],
  },
} as const;

type LevelKey = keyof typeof LEVELS;

export function Roadmap() {
  const [active, setActive] = useState<LevelKey>("basic");
  const lv = LEVELS[active];

  return (
    <section id="chuong-trinh" className="section section--cream" style={{ scrollMarginTop: 80 }}>
      <div className="container container--md">
        <div className="head">
          <span className="kicker kicker--onlight">Lộ trình học</span>
          <h2 className="sticker sticker--red">Lộ trình 3 cấp theo <span className="hl">độ tuổi</span></h2>
          <p>Chương trình được thiết kế phù hợp với từng giai đoạn phát triển của con.</p>
        </div>

        <div className="level-tabs">
          {(Object.keys(LEVELS) as LevelKey[]).map((k) => (
            <button
              key={k}
              type="button"
              className={`level-tab ${active === k ? "active" : ""}`}
              onClick={() => setActive(k)}
            >
              {LEVELS[k].label}
              <small>{LEVELS[k].age}</small>
            </button>
          ))}
        </div>

        <div className="level-panel swap" key={active}>
          <h3>{lv.title} <span className="age">· {lv.age}</span></h3>
          <ul className="level-list">
            {lv.items.map((it, i) => (
              <li key={i}><span className="n">{i + 1}</span><span>{it}</span></li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
