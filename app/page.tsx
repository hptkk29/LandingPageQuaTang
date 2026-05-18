export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-white to-amber-50 px-6">
      <div className="max-w-2xl text-center py-16">
        <div className="text-7xl mb-6">🎁</div>
        <h1 className="text-4xl md:text-5xl font-bold text-purple-900 mb-4">
          Landing Page Quà Tặng
        </h1>
        <p className="text-xl text-purple-700 mb-8">
          5 Buổi Học RoboSim MIỄN PHÍ — Sata Robo
        </p>
        <div className="inline-block bg-white rounded-2xl shadow-lg px-8 py-6 border-2 border-purple-200">
          <p className="text-gray-700 mb-2">
            ✅ <strong>Phase 1 setup complete</strong>
          </p>
          <p className="text-sm text-gray-500">
            Next.js 15 + Tailwind v4 + shadcn/ui + UI/UX Pro Max skill ready.
            <br />
            Landing page sẽ được build ở Phase 3.
          </p>
        </div>
        <p className="mt-8 text-xs text-gray-400">
          Repo: github.com/hptkk29/LandingPageQuaTang
        </p>
      </div>
    </main>
  );
}
