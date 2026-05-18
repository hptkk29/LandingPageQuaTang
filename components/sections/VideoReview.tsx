"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { getYouTubeEmbedUrl, getYouTubeId } from "@/lib/utils/youtube";
import { CAMPAIGN } from "@/lib/constants/campaign";

export function VideoReview() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoId = getYouTubeId(CAMPAIGN.videoUrl);
  const embedUrl = getYouTubeEmbedUrl(CAMPAIGN.videoUrl);
  const thumbnailUrl = videoId
    ? `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`
    : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="my-8 md:my-12"
    >
      <div className="text-center mb-5 md:mb-6">
        <div className="inline-flex items-center gap-2 bg-cta-50 text-cta-700 font-semibold text-xs md:text-sm px-4 py-1.5 rounded-pill border-2 border-cta-200 mb-3">
          🎥 Xem thực tế
        </div>
        <h3 className="font-display text-xl md:text-2xl font-bold text-gray-900">
          Trải nghiệm 1 buổi học thực tế tại Sata Robo
        </h3>
      </div>

      <div className="relative aspect-video rounded-card overflow-hidden shadow-card border-2 border-brand-100 group bg-gray-900">
        {!isPlaying ? (
          <button
            type="button"
            onClick={() => setIsPlaying(true)}
            className="absolute inset-0 w-full h-full cursor-pointer"
            aria-label="Phát video"
          >
            {thumbnailUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumbnailUrl}
                alt="Trải nghiệm 1 buổi học tại Sata Robo"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-cta-500 rounded-full animate-pulse-glow" />
                <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-cta-500 group-hover:bg-cta-600 flex items-center justify-center shadow-cta-glow transition-all group-hover:scale-110">
                  <svg
                    className="w-6 h-6 md:w-8 md:h-8 text-white ml-1"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 text-white text-left">
              <p className="font-display font-bold text-sm md:text-base">
                ▶ Click để xem video
              </p>
              <p className="text-xs md:text-sm opacity-90">
                Khám phá không khí lớp học Robotics tại Sata Robo
              </p>
            </div>
          </button>
        ) : (
          <iframe
            src={`${embedUrl}&autoplay=1`}
            title="Trải nghiệm Sata Robo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full"
          />
        )}
      </div>
    </motion.div>
  );
}
