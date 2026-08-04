import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { FourSessions } from "@/components/sections/FourSessions";
import { Problem } from "@/components/sections/Problem";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { Commitments } from "@/components/sections/Commitments";
import { CourseInfo } from "@/components/sections/CourseInfo";
import { Roadmap } from "@/components/sections/Roadmap";
import { TrustBadges } from "@/components/sections/TrustBadges";
import { Testimonials } from "@/components/sections/Testimonials";
import { MidCTA } from "@/components/sections/MidCTA";
import { Locations } from "@/components/sections/Locations";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Footer } from "@/components/sections/Footer";
import { FloatingZalo } from "@/components/sections/FloatingZalo";
import { ExitIntent } from "@/components/sections/ExitIntent";
import { CAMPAIGN } from "@/lib/constants/campaign";
import { getWeekDeadlineEnd } from "@/lib/utils/schedule";

export default function HomePage() {
  const deadline = getWeekDeadlineEnd();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `Tặng ${CAMPAIGN.totalSlots} suất trải nghiệm lập trình robot RoboSim ${CAMPAIGN.trial.format} cùng chuyên gia cho trẻ 6–13 tuổi — Sata Robo`,
    description: `Buổi trải nghiệm miễn phí ${CAMPAIGN.trial.format} trên phần mềm mô phỏng RoboSim cho học sinh 6–13 tuổi tại Đà Nẵng: một chuyên gia kèm riêng một bạn trong ${CAMPAIGN.trial.duration}, cuối buổi ba mẹ nhận phiếu đánh giá năng lực của con. Mỗi đợt ${CAMPAIGN.totalSlots} suất, lịch học linh hoạt ${CAMPAIGN.schedule}.`,
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
      // Lịch linh hoạt (cuối tuần & các buổi tối) → không khai báo byDay/startDate
      courseSchedule: {
        "@type": "Schedule",
        duration: `PT${CAMPAIGN.trial.durationMinutes}M`,
        // Quà tặng là MỘT buổi trải nghiệm 1 kèm 1, không phải chuỗi buổi học
        repeatCount: 1,
      },
      maximumAttendeeCapacity: 1,
    })),
    offers: {
      "@type": "Offer",
      price: 0,
      priceCurrency: "VND",
      availability: "https://schema.org/InStock",
      validThrough: deadline.toISOString(),
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
      <main className="v2-root">
        <Hero />
        <FourSessions />
        <Problem />
        <WhyChooseUs />
        <Commitments />
        <CourseInfo />
        <Roadmap />
        <TrustBadges />
        <Testimonials />
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
