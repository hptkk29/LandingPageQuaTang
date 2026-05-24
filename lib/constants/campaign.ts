export const CAMPAIGN = {
  totalSlotsPerLocation: 12,
  totalSlots: 24,

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

  // Lịch học: Thứ 7 hằng tuần. Date hiển thị compute dynamically từ
  // lib/utils/schedule.ts -> getNextSaturday() (luôn là Thứ 7 sắp tới).
  classDayLabel: "Thứ 7 hằng tuần",
  classTime: "15h45-17h15",
  classDuration: "90 phút/buổi",
  totalSessions: 5,

  // Registration deadline = end of upcoming Saturday (computed dynamically).
  // Countdown component sẽ tự reset vào Chủ nhật 00:00 (sau khi Thứ 7
  // 23:59:59 kết thúc) để đếm tới Thứ 7 tuần sau.

  targetAudience: "Học sinh Tiểu học & THCS",
  targetGrades: "Lớp 1 – 8",
  classroom: "Phòng 201",
  minStudents: 6,
  maxStudents: 15,

  videoUrl: "https://youtu.be/EEVXtrzLTys",

  hotline: "0818.823.720",
  hotlineDigits: "0818823720",
} as const;
