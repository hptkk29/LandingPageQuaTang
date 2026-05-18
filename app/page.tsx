import { LeadForm } from "@/components/forms/LeadForm";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎁</div>
          <h1 className="text-4xl md:text-5xl font-bold text-purple-900 mb-3">
            Tặng 5 Buổi Học RoboSim MIỄN PHÍ
          </h1>
          <p className="text-lg text-gray-700">
            Dành cho học sinh lớp 1 – 8 | 2 cơ sở Sata Robo Đà Nẵng
          </p>
          <p className="mt-2 text-sm text-purple-700 font-medium">
            🚧 [Phase 3.1 — Test form] Full landing page sẽ build ở Phase 3.2/3.3
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-md mx-auto border-2 border-purple-100">
          <h2 className="text-2xl font-bold text-purple-900 mb-1">
            🎯 Đăng ký nhận quà
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Sata Robo sẽ liên hệ ba mẹ trong 24 giờ.
          </p>
          <LeadForm />
        </div>
      </div>
    </main>
  );
}
