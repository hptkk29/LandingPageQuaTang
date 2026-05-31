import Image from "next/image";
import heroBanner from "@/public/hero-banner.jpg";

export function Banner() {
  return (
    <section className="bg-white">
      <a
        href="#dang-ky"
        aria-label="Đăng ký học thử miễn phí"
        className="block"
      >
        <Image
          src={heroBanner}
          alt="Lập trình Robot RoboSim cơ bản cho trẻ 6–13 tuổi — Sata Robo"
          priority
          sizes="100vw"
          className="w-full h-auto"
        />
      </a>
    </section>
  );
}
