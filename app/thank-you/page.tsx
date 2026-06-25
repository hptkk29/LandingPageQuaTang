import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export const metadata = {
  title: "Cảm ơn ba mẹ — Sata Robo",
  description:
    "Đăng ký thành công. Sata Robo sẽ liên hệ ba mẹ trong 24 giờ.",
  robots: { index: false },
};

export default function ThankYouPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-white to-amber-50 px-6">
      <div className="max-w-xl text-center py-16">
        <div className="text-8xl mb-6">🎉</div>
        <h1 className="text-4xl md:text-5xl font-bold text-purple-900 mb-4">
          Cảm ơn ba mẹ!
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Sata Robo đã nhận được đăng ký của ba mẹ.
          <br />
          Đội ngũ tư vấn sẽ <strong>gọi điện hoặc nhắn Zalo</strong> cho ba mẹ
          sớm nhất để sắp xếp lịch học 4 buổi miễn phí.
        </p>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-2 border-purple-100">
          <h2 className="font-semibold text-purple-900 mb-3">
            📞 Cần hỗ trợ ngay?
          </h2>
          <p className="text-gray-700 mb-2">
            Hotline:{" "}
            <a
              href="tel:0818823720"
              className="font-bold text-purple-700 hover:underline"
            >
              0818.823.720
            </a>
          </p>
          <p className="text-gray-700 text-sm">
            Giờ làm việc: 8:00 – 17:30 (T2 – T7)
          </p>
        </div>

        <Link
          href="/"
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          ← Quay về trang chủ
        </Link>

        <p className="mt-12 text-xs text-gray-400">
          Công Ty CP Công Nghệ Giáo Dục Sata Robo
          <br />
          258 Lê Thanh Nghị, Hoà Cường, Đà Nẵng
        </p>
      </div>
    </main>
  );
}
