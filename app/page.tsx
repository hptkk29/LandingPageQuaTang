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
import { CAMPAIGN } from "@/lib/constants/campaign";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Khoá học miễn phí 5 buổi RoboSim — Sata Robo",
  description:
    "5 buổi học Robotics đại cương miễn phí trên phần mềm RoboSim cho học sinh lớp 1-8 tại Đà Nẵng. Hành trang chinh phục Cuộc thi Sáng tạo Robotics 2026.",
  provider: {
    "@type": "Organization",
    name: "Sata Robo",
    sameAs: "https://satarobo.vn",
    address: CAMPAIGN.locations.map((loc) => ({
      "@type": "PostalAddress",
      streetAddress: loc.address,
      addressLocality: loc.district,
      addressRegion: loc.city,
      addressCountry: "VN",
    })),
  },
  hasCourseInstance: CAMPAIGN.batches.flatMap((batch) =>
    CAMPAIGN.locations.map((loc) => ({
      "@type": "CourseInstance",
      courseMode: "OnSite",
      location: loc.fullAddress,
      startDate: batch.khaiGiang.slice(0, 10),
      courseSchedule: {
        "@type": "Schedule",
        duration: "PT90M",
        repeatCount: CAMPAIGN.totalSessions,
      },
    }))
  ),
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "VND",
    availability: "https://schema.org/InStock",
    validThrough: CAMPAIGN.registrationDeadline,
  },
  educationalLevel: "Elementary and Secondary School",
  audience: {
    "@type": "EducationalAudience",
    educationalRole: "student",
    audienceType: "Students grades 1-8",
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
