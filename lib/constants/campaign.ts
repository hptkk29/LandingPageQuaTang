export const CAMPAIGN = {
  // Quà tặng đợt này: suất trải nghiệm 1 kèm 1 cùng chuyên gia (90 phút).
  // 29 suất tính cho CẢ 2 CƠ SỞ, không chia đều theo từng cơ sở.
  totalSlots: 29,

  trial: {
    format: "1 kèm 1",
    duration: "90 phút",
    durationMinutes: 90,
  },

  locations: [
    {
      key: "co-so-1",
      name: "Cơ sở 1",
      address: "211 Nguyễn Hữu Thọ",
      district: "Hoà Cường",
      city: "Đà Nẵng",
      fullAddress: "211 Nguyễn Hữu Thọ, Hoà Cường, Đà Nẵng",
      phone: "0818.823.720",
      phoneDigits: "0818823720",
    },
    {
      key: "co-so-2",
      name: "Cơ sở 2",
      address: "114 Hoàng Diệu",
      district: "Hải Châu",
      city: "Đà Nẵng",
      fullAddress: "114 Hoàng Diệu, Hải Châu, Đà Nẵng",
      phone: "0702.193.933",
      phoneDigits: "0702193933",
    },
  ],

  // Lịch học linh hoạt — KHÔNG còn ca cố định Thứ 7. Khi phụ huynh đăng ký,
  // trung tâm xếp ca phù hợp theo cơ sở đã chọn.
  schedule: "cuối tuần & các buổi tối",
  classDuration: "90 phút/buổi",

  // Hạn đăng ký mỗi đợt = hết Chủ nhật tuần này (tính động trong
  // lib/utils/schedule.ts → getWeekDeadlineEnd, tự reset sang tuần sau).

  targetAudience: "Học sinh Tiểu học & THCS",
  targetGrades: "Lớp 1 – 8",
  classroom: "Phòng 201",
  minStudents: 6,
  // Sĩ số tối đa — trùng với con số "≤12" dùng trong toàn bộ nội dung trang
  maxStudents: 12,

  videoUrl: "https://youtu.be/EEVXtrzLTys",

  hotline: "0818.823.720",
  hotlineDigits: "0818823720",
} as const;
