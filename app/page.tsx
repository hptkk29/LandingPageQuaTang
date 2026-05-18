import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { TrustBadges } from "@/components/sections/TrustBadges";
import { CourseInfo } from "@/components/sections/CourseInfo";
import { Problem } from "@/components/sections/Problem";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Footer } from "@/components/sections/Footer";
import { FloatingZalo } from "@/components/sections/FloatingZalo";
import { ExitIntent } from "@/components/sections/ExitIntent";

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
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <FloatingZalo />
      <ExitIntent />
    </>
  );
}
