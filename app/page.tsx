import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { Commitments } from "@/components/sections/Commitments";
import { CourseInfo } from "@/components/sections/CourseInfo";
import { Roadmap } from "@/components/sections/Roadmap";
import { TrustBadges } from "@/components/sections/TrustBadges";
import { MidCTA } from "@/components/sections/MidCTA";
import { Locations } from "@/components/sections/Locations";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Footer } from "@/components/sections/Footer";
import { FloatingZalo } from "@/components/sections/FloatingZalo";
import { ExitIntent } from "@/components/sections/ExitIntent";
import { CAMPAIGN } from "@/lib/constants/campaign";
import { getNextSaturday, getNextSaturdayEnd } from "@/lib/utils/schedule";

export default function HomePage() {
  const nextSat = getNextSaturday();
  const nextSatEnd = getNextSaturdayEnd();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Lập trình Robot RoboSim cơ bản cho trẻ 6–13 tuổi — Sata Robo",
    description:
      "Khoá học lập trình robot RoboSim cho học sinh 6–13 tuổi tại Đà Nẵng. Lộ trình 3 cấp, lớp ≤12 học viên, cam kết hoàn tiền 100%, hành trang chinh phục giải đấu RoboSim 2026.",
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
    hasCourseInstance: CAMPAIGN.locations.map((loc) => ({
      "@type": "CourseInstance",
      courseMode: "OnSite",
      location: loc.fullAddress,
      startDate: nextSat.toISOString().slice(0, 10),
      courseSchedule: {
        "@type": "Schedule",
        duration: "PT90M",
        repeatFrequency: "P1W",
        byDay: "https://schema.org/Saturday",
        repeatCount: CAMPAIGN.totalSessions,
      },
    })),
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      validThrough: nextSatEnd.toISOString(),
    },
    educationalLevel: "Elementary and Secondary School",
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "student",
      audienceType: "Students aged 6-13",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <Hero />
        <Problem />
        <WhyChooseUs />
        <Commitments />
        <CourseInfo />
        <Roadmap />
        <TrustBadges />
        <MidCTA />
        <Locations />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <FloatingZalo />
      <ExitIntent />
    </>
  );
}
