export const CAMPAIGN = {
  totalSlotsPerLocation: 12,
  locations: [
    {
      key: "co-so-1",
      address: "211 Nguyễn Hữu Thọ",
      city: "Đà Nẵng",
      khaiGiang: "2026-05-23T17:30:00+07:00",
      khaiGiangLabel: "Thứ 7, 23/5/2026 | 17h30",
    },
    {
      key: "co-so-2",
      address: "114 Hoàng Diệu",
      city: "Đà Nẵng",
      khaiGiang: "2026-05-25T17:30:00+07:00",
      khaiGiangLabel: "Thứ 2, 25/5/2026 | 17h30",
    },
  ],
  // Deadline đăng ký: hết 23:59:59 ngày 25/5/2026 (theo yêu cầu user)
  registrationDeadline: "2026-05-25T23:59:59+07:00",

  duration: "90 phút/buổi",
  totalSessions: 5,
  targetAudience: "Học sinh Tiểu học & THCS",
  targetGrades: "Lớp 1 – 8",

  videoUrl: "https://youtu.be/EEVXtrzLTys",

  hotline: "0818.823.720",
  hotlineDigits: "0818823720",
} as const;
