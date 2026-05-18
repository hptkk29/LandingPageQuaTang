export const CAMPAIGN = {
  totalSlotsPerLocation: 12,
  totalSlots: 24,

  // 2 cơ sở (CS3 đã bỏ)
  locations: [
    {
      key: "co-so-1",
      address: "211 Nguyễn Hữu Thọ",
      district: "Hoà Cường",
      city: "Đà Nẵng",
      fullAddress: "211 Nguyễn Hữu Thọ, Hoà Cường, Đà Nẵng",
    },
    {
      key: "co-so-2",
      address: "114 Hoàng Diệu",
      district: "Hải Châu",
      city: "Đà Nẵng",
      fullAddress: "114 Hoàng Diệu, Hải Châu, Đà Nẵng",
    },
  ],

  // 2 đợt khai giảng — áp dụng cho cả 2 cơ sở
  batches: [
    {
      key: "batch-1",
      khaiGiang: "2026-05-23T15:45:00+07:00",
      khaiGiangLabel: "Thứ 7, 23/5/2026",
      scheduleLabel: "T4/T7 hằng tuần — 15h45-17h15",
      shortLabel: "Đợt 1: 23/5 (T4/T7 — 15h45)",
      priority: 1,
    },
    {
      key: "batch-2",
      khaiGiang: "2026-05-25T17:30:00+07:00",
      khaiGiangLabel: "Thứ 2, 25/5/2026",
      scheduleLabel: "T2/T5 hằng tuần — 17h30-19h00",
      shortLabel: "Đợt 2: 25/5 (T2/T5 — 17h30)",
      priority: 2,
    },
  ],

  // Deadline đăng ký: hết 23:59 ngày 25/5/2026
  registrationDeadline: "2026-05-25T23:59:59+07:00",

  duration: "90 phút/buổi",
  totalSessions: 5,
  targetAudience: "Học sinh Tiểu học & THCS",
  targetGrades: "Lớp 1 – 8",
  classroom: "Phòng 201",
  minStudents: 6,
  maxStudents: 15,

  videoUrl: "https://youtu.be/EEVXtrzLTys",

  hotline: "0818.823.720",
  hotlineDigits: "0818823720",
} as const;
