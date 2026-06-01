import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { CAMPAIGN } from "@/lib/constants/campaign";

export function Locations() {
  return (
    <section id="co-so" className="py-14 md:py-24 bg-white scroll-mt-20">
      <Container>
        <SectionHeading
          eyebrow="Hệ thống cơ sở"
          title="2 cơ sở thuận tiện tại Đà Nẵng"
          description="Trang thiết bị hiện đại, không gian thực hành an toàn cho con."
        />

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {CAMPAIGN.locations.map((loc, idx) => {
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              loc.fullAddress
            )}`;
            return (
              <div
                key={loc.key}
                className="bg-cta-50 rounded-card p-7 md:p-8 border border-[#F5C49A] shadow-soft hover:shadow-card transition-shadow"
              >
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-3xl">📍</span>
                  <div>
                    <h3 className="font-display text-lg md:text-xl font-bold text-gray-900">
                      Cơ sở {idx + 1}
                    </h3>
                    <p className="text-gray-700 mt-1">{loc.address}</p>
                    <p className="text-gray-500 text-sm">
                      {loc.district}, {loc.city}
                    </p>
                  </div>
                </div>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-display font-semibold text-cta-600 hover:text-cta-700 transition-colors"
                >
                  Xem trên Google Maps <span aria-hidden="true">→</span>
                </a>
              </div>
            );
          })}
        </div>

        <p className="text-center mt-10 text-gray-600">
          Cần hỗ trợ? Gọi hotline{" "}
          <a
            href={`tel:${CAMPAIGN.hotlineDigits}`}
            className="font-display font-bold text-cta-600 hover:text-cta-700"
          >
            {CAMPAIGN.hotline}
          </a>{" "}
          hoặc{" "}
          <a
            href={`https://zalo.me/${CAMPAIGN.hotlineDigits}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display font-bold text-cta-600 hover:text-cta-700"
          >
            chat Zalo
          </a>
          .
        </p>
      </Container>
    </section>
  );
}
