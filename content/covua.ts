/**
 * Nội dung và cấu hình landing page quà tặng giải cờ vua.
 * Bản duyệt cho người đọc: docs/03-noi-dung-trang.md
 *
 * TODO trước go-live: điền TEN_GIAI_DAU, HAN_DANG_KY, HOTLINE, ZALO_URL.
 */

export const COVUA_PROGRAM_CODE = 'COVUA' as const;

export const covuaConfig = {
  tenGiaiDau: '{{TEN_GIAI_DAU}}',
  hanDangKy: '{{HAN_DANG_KY}}', // ví dụ: '30/09/2026' — để trống thì ẩn dòng hạn đăng ký
  hotline: process.env.NEXT_PUBLIC_COVUA_HOTLINE ?? '{{HOTLINE}}',
  zaloUrl: process.env.NEXT_PUBLIC_COVUA_ZALO_URL ?? '#',
  canonicalUrl: 'https://covua.quatang.edu.vn',
  soSuatDoatGiai: 20,
} as const;

/* ------------------------------------------------------------------ */
/* Cơ sở                                                               */
/* ------------------------------------------------------------------ */

export const CAMPUSES = [
  {
    value: 'CS1',
    label: 'Cơ sở 1 — 211 Nguyễn Hữu Thọ',
    shortLabel: 'Cơ sở 1',
    address: '211 Nguyễn Hữu Thọ, Đà Nẵng',
    mapUrl: 'https://maps.google.com/?q=211+Nguyen+Huu+Tho+Da+Nang',
  },
  {
    value: 'CS2',
    label: 'Cơ sở 2 — 114 Hoàng Diệu',
    shortLabel: 'Cơ sở 2',
    address: '114 Hoàng Diệu, Đà Nẵng',
    mapUrl: 'https://maps.google.com/?q=114+Hoang+Dieu+Da+Nang',
  },
] as const;

/* ------------------------------------------------------------------ */
/* Thành tích — trường điều khiển toàn bộ logic form                   */
/* ------------------------------------------------------------------ */

export const ACHIEVEMENTS = [
  { value: 'NHAT', label: 'Giải Nhất', group: 'A' },
  { value: 'NHI', label: 'Giải Nhì', group: 'A' },
  { value: 'BA', label: 'Giải Ba', group: 'A' },
  { value: 'KHUYEN_KHICH', label: 'Giải Khuyến khích', group: 'A' },
  { value: 'THAM_GIA', label: 'Tham gia giải (không đoạt giải)', group: 'B' },
] as const;

export type AchievementValue = (typeof ACHIEVEMENTS)[number]['value'];
export type AchievementGroup = 'A' | 'B';

export function getAchievementGroup(value?: string | null): AchievementGroup | null {
  const found = ACHIEVEMENTS.find((a) => a.value === value);
  return found ? found.group : null;
}

export const isWinner = (value?: string | null) => getAchievementGroup(value) === 'A';

/* ------------------------------------------------------------------ */
/* Hình thức học                                                       */
/* ------------------------------------------------------------------ */

export const STUDY_MODES = [
  {
    value: 'BOTH',
    label: 'Học cả hai — trực tiếp tại lớp và online',
    hint: 'Khuyến nghị',
  },
  { value: 'ONLINE_ONLY', label: 'Chỉ học online' },
] as const;

export const TECH_INTEREST_OPTIONS = [
  { value: 'CO', label: 'Có' },
  { value: 'CHUA', label: 'Chưa nghĩ tới' },
] as const;

/* ------------------------------------------------------------------ */
/* Nội dung các section                                                */
/* ------------------------------------------------------------------ */

export const covuaContent = {
  hero: {
    eyebrow: `Nhà tài trợ ${covuaConfig.tenGiaiDau}`,
    title: 'Sata Robo trao quà cho toàn bộ thí sinh giải cờ vua',
    description:
      'Đúng như cam kết tài trợ, mỗi thí sinh tham gia giải đều có một phần quà từ Sata Robo — một khóa học lập trình Robot dành riêng cho con. Thí sinh đoạt giải nhận thêm suất học bổng trải nghiệm Robotics & AI một tháng tại lớp.',
    primaryCta: 'Đăng ký nhận quà',
    secondaryCta: 'Xem phần quà của con',
    trustLine: `Chương trình dành riêng cho thí sinh dự ${covuaConfig.tenGiaiDau}. Quyền lợi được xác nhận sau khi đối chiếu danh sách chính thức của ban tổ chức.`,
  },

  gifts: {
    title: 'Phần quà của con',
    cards: [
      {
        id: 'A',
        badge: `${covuaConfig.soSuatDoatGiai} suất`,
        title: 'Thí sinh đoạt giải',
        condition: 'Giải Nhất, Nhì, Ba và Khuyến khích',
        items: [
          'Học bổng trải nghiệm **Lập trình Robotics & AI** — học 1 tháng trực tiếp tại lớp, ở CS1 hoặc CS2 Sata Robo',
          'Khóa **Lập trình Robot Online**',
        ],
        highlight: 'Nhận cả hai phần quà, không phải chọn một.',
      },
      {
        id: 'B',
        badge: 'Mọi thí sinh còn lại',
        title: 'Thí sinh tham gia',
        condition: 'Đã tham gia thi đấu tại giải',
        items: ['Khóa **Lập trình Robot Online**'],
        highlight: `Áp dụng cho thí sinh dự ${covuaConfig.tenGiaiDau}.`,
      },
    ],
  },

  learning: {
    title: 'Từ bàn cờ đến dòng lệnh',
    intro:
      'Cờ vua dạy con nhìn trước vài nước. Lập trình cũng vậy — chỉ khác là con viết ra nước đi cho máy tự chạy.',
    points: [
      {
        title: 'Tư duy thuật toán',
        body: 'Chia một việc lớn thành các bước máy hiểu được, đúng thứ tự.',
      },
      {
        title: 'Lắp ráp và điều khiển robot',
        body: 'Con tự lắp, tự nạp chương trình, tự sửa khi robot chạy sai.',
      },
      {
        title: 'Làm quen AI',
        body: 'Nhận diện hình ảnh, âm thanh, cảm biến, ở mức phù hợp lứa tuổi.',
      },
      {
        title: 'Kiên trì gỡ lỗi',
        body: 'Chương trình chạy sai là chuyện bình thường; tìm ra sai ở đâu mới là phần con học được nhiều nhất.',
      },
    ],
  },

  campusSection: {
    title: 'Học trực tiếp tại đâu',
    note: 'Suất học bổng trải nghiệm một tháng học tại một trong hai cơ sở. Con ở tỉnh khác vẫn nhận đủ khóa học online.',
  },

  steps: {
    title: 'Cách nhận quà',
    items: [
      { no: '01', title: 'Đăng ký', body: 'Điền thông tin của con trên trang này.' },
      {
        no: '02',
        title: 'Đối chiếu và xác nhận',
        body: 'Sata Robo kiểm tra danh sách chính thức từ ban tổ chức rồi gọi cho phụ huynh.',
      },
      {
        no: '03',
        title: 'Nhận quà và học',
        body: 'Nhận mã kích hoạt khóa online; thí sinh đoạt giải chốt thêm lịch học trực tiếp tại cơ sở.',
      },
    ],
  },

  faq: {
    title: 'Câu hỏi thường gặp',
    items: [
      {
        q: 'Con chỉ tham gia, không đoạt giải, có quà không?',
        a: `Có. Mọi thí sinh dự ${covuaConfig.tenGiaiDau} đều nhận một khóa Lập trình Robot Online.`,
      },
      {
        q: 'Phần quà có mất phí gì thêm không?',
        a: 'Không. Đây là phần quà tài trợ của Sata Robo, không kèm điều kiện mua khóa học.',
      },
      {
        q: 'Nhà con ở tỉnh khác, có nhận được không?',
        a: 'Được. Khóa online học ở đâu cũng được. Suất học trực tiếp một tháng chỉ áp dụng tại hai cơ sở ở Đà Nẵng, nếu không tiện đi lại thì anh/chị chọn "Chỉ học online".',
      },
      {
        q: 'Con chưa biết gì về lập trình, học được không?',
        a: 'Được. Khóa trải nghiệm thiết kế cho học sinh lớp 1 đến lớp 8 bắt đầu từ con số không.',
      },
      {
        q: 'Bao lâu thì Sata Robo liên hệ?',
        a: 'Trong 24–48 giờ làm việc kể từ khi anh/chị gửi đăng ký.',
      },
      {
        q: 'Nhà có hai con cùng dự giải thì sao?',
        a: 'Anh/chị điền form hai lần, mỗi lần cho một con. Mỗi thí sinh có một phần quà riêng.',
      },
    ],
  },

  form: {
    title: 'Đăng ký nhận quà',
    labels: {
      studentName: 'Họ và tên thí sinh',
      parentName: 'Họ và tên phụ huynh',
      parentPhone: 'Số điện thoại phụ huynh',
      parentEmail: 'Email phụ huynh (không bắt buộc)',
      province: 'Tỉnh/Thành phố',
      address: 'Địa chỉ',
      achievement: 'Thành tích thi đấu',
      category: 'Bảng/hạng mục thi đấu (không bắt buộc)',
      registrationNumber: 'Số báo danh (không bắt buộc)',
      techInterest: 'Anh/chị có mong muốn phát triển tư duy công nghệ cho con không?',
      studyMode: 'Hình thức học',
      campus: 'Cơ sở học trực tiếp',
      consent: 'Tôi đồng ý để Sata Robo liên hệ xác nhận phần quà và tư vấn khóa học.',
    },
    placeholders: {
      studentName: 'Nguyễn Văn An',
      parentName: 'Người Sata Robo sẽ liên hệ',
      parentPhone: '09xx xxx xxx',
      parentEmail: 'Để gửi mã quà và tài khoản khóa online',
      address: 'Số nhà, đường, phường/xã',
      category: 'VD: Bảng U9 nam',
      registrationNumber: 'Giúp đối chiếu nhanh hơn',
    },
    techInterestNote:
      'Câu này chỉ để Sata Robo tư vấn đúng nhu cầu. Trả lời thế nào con cũng nhận đủ phần quà.',
    submit: 'Đăng ký nhận quà',
    submitting: 'Đang gửi đăng ký...',
    privacyNote:
      'Sata Robo chỉ dùng thông tin này để liên hệ trao quà và tư vấn, không chia sẻ cho bên thứ ba.',
    dynamicHints: {
      groupA:
        'Con nhận 2 phần quà: học bổng trải nghiệm 1 tháng tại lớp và khóa lập trình Robot online.',
      groupB: 'Con nhận khóa lập trình Robot online.',
      onlineOnlyWarning:
        'Suất học trực tiếp sẽ được giữ lại. Anh/chị có thể đổi ý khi Sata Robo gọi xác nhận.',
    },
  },

  success: {
    titleTemplate: 'Đã nhận đăng ký cho {studentName}',
    giftLineA:
      'Phần quà của con: học bổng trải nghiệm Lập trình Robotics & AI 1 tháng tại {campus}, và khóa Lập trình Robot Online.',
    giftLineB: 'Phần quà của con: khóa Lập trình Robot Online.',
    steps: [
      'Sata Robo đối chiếu với danh sách thí sinh chính thức của ban tổ chức.',
      'Tư vấn viên gọi cho anh/chị theo số {parentPhone} trong 24–48 giờ làm việc.',
      'Anh/chị nhận mã quà và chốt lịch học cho con.',
    ],
    zaloCta: 'Nhắn Zalo cho Sata Robo',
  },

  errors: {
    studentNameRequired: 'Nhập họ và tên đầy đủ của thí sinh.',
    studentNameFullName: 'Nhập cả họ và tên, ví dụ Nguyễn Văn An.',
    parentNameRequired: 'Nhập họ và tên phụ huynh.',
    phoneInvalid: 'Số điện thoại chưa đúng. Nhập 10 số, bắt đầu bằng 0.',
    emailInvalid: 'Email chưa đúng định dạng.',
    addressRequired: 'Nhập địa chỉ để Sata Robo gửi quà và xếp lớp gần nhà.',
    achievementRequired: 'Chọn thành tích của con tại giải.',
    techInterestRequired: 'Chọn một câu trả lời.',
    campusRequired: 'Chọn cơ sở con sẽ học trực tiếp.',
    consentRequired: 'Cần đồng ý để Sata Robo liên hệ trao quà.',
    submitFailed:
      'Chưa gửi được đăng ký. Anh/chị bấm gửi lại, hoặc gọi {hotline} để Sata Robo ghi nhận trực tiếp. Thông tin đã nhập vẫn được giữ.',
  },
} as const;
