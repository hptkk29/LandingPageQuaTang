"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CAMPAIGN } from "@/lib/constants/campaign";

const STORAGE_KEY = "quatang-exit-intent-shown";

export function ExitIntent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const alreadyShown = sessionStorage.getItem(STORAGE_KEY);
    if (alreadyShown) return;

    let hasTriggered = false;

    function onMouseLeave(e: MouseEvent) {
      if (hasTriggered) return;
      if (e.clientY <= 0) {
        hasTriggered = true;
        setShow(true);
        sessionStorage.setItem(STORAGE_KEY, "1");
      }
    }

    // Mobile fallback: 30s if form not yet visible
    let mobileTimer: ReturnType<typeof setTimeout> | null = null;
    if (window.innerWidth < 768) {
      mobileTimer = setTimeout(() => {
        if (hasTriggered) return;
        const form = document.getElementById("dang-ky");
        if (!form) return;
        const rect = form.getBoundingClientRect();
        if (rect.top > window.innerHeight || rect.bottom < 0) {
          hasTriggered = true;
          setShow(true);
          sessionStorage.setItem(STORAGE_KEY, "1");
        }
      }, 30000);
    }

    document.addEventListener("mouseleave", onMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", onMouseLeave);
      if (mobileTimer) clearTimeout(mobileTimer);
    };
  }, []);

  function close() {
    setShow(false);
  }

  function scrollToForm() {
    setShow(false);
    setTimeout(() => {
      document
        .getElementById("dang-ky")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 200);
  }

  const totalSlots =
    CAMPAIGN.totalSlotsPerLocation * CAMPAIGN.locations.length;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 30 }}
            transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
            className="relative bg-white rounded-card shadow-2xl max-w-md w-full p-6 md:p-8 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              aria-hidden="true"
              className="absolute -top-16 -right-16 w-40 h-40 bg-cta-100 rounded-full opacity-50"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-16 -left-16 w-32 h-32 bg-brand-100 rounded-full opacity-50"
            />

            <button
              type="button"
              onClick={close}
              aria-label="Đóng"
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 flex items-center justify-center text-xl transition-colors z-10 cursor-pointer"
            >
              ×
            </button>

            <div className="relative text-center">
              <div className="text-5xl md:text-6xl mb-3 animate-bounce-in">
                🎁
              </div>

              <h3 className="font-display text-2xl md:text-3xl font-extrabold text-gray-900 mb-2 leading-tight">
                Khoan đã, ba mẹ ơi!
              </h3>

              <p className="text-base md:text-lg text-gray-700 mb-1">
                Còn{" "}
                <span className="font-bold text-cta-600">
                  {totalSlots} suất
                </span>{" "}
                miễn phí
              </p>
              <p className="text-base md:text-lg text-gray-700 mb-5">
                cho 5 buổi RoboSim — <strong>Không thu phí ẩn</strong>
              </p>

              <div className="bg-cta-50 border-2 border-cta-200 rounded-button p-3 mb-5">
                <p className="text-sm md:text-base text-cta-800 font-display font-semibold">
                  💯 Ưu đãi chỉ áp dụng đến
                  <br />
                  <span className="text-cta-600 font-bold">
                    23:59 ngày 25/5/2026
                  </span>
                </p>
              </div>

              <div className="flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={scrollToForm}
                  className="w-full bg-gradient-to-r from-cta-500 to-cta-600 hover:from-cta-600 hover:to-cta-700 text-white font-display font-extrabold text-base py-4 rounded-button shadow-cta animate-shimmer transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  🎁 Đăng ký ngay cho con →
                </button>

                <button
                  type="button"
                  onClick={close}
                  className="w-full text-gray-500 hover:text-gray-700 text-sm font-medium py-2 transition-colors cursor-pointer"
                >
                  Để xem lại sau
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
