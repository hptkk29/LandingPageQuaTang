import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { TrustBadges } from "@/components/sections/TrustBadges";
import { CourseInfo } from "@/components/sections/CourseInfo";
import { Problem } from "@/components/sections/Problem";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TrustBadges />
        <CourseInfo />
        <Problem />
        <WhyChooseUs />

        <section className="py-12 bg-brand-50 text-center">
          <p className="text-brand-700 font-display font-semibold text-sm md:text-base">
            🚧 Phase 3.2 done — Phase 3.3 sẽ build: Testimonials + FAQ + Final
            CTA + Footer + Floating Zalo + Exit popup
          </p>
        </section>
      </main>
    </>
  );
}
