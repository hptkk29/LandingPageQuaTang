"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LeadForm } from "@/components/forms/LeadForm";

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

    // Mobile fallback: 30s nếu form chưa hiển thị trong viewport
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
            className="relative bg-white rounded-card shadow-2xl border border-[#F5C49A] max-w-md w-full max-h-[90vh] overflow-y-auto p-5 md:p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Đóng"
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 flex items-center justify-center text-xl transition-colors z-10 cursor-pointer"
            >
              ×
            </button>

            <div className="text-center mb-5">
              <div className="text-4xl mb-2">🎁</div>
              <h3 className="font-display text-xl md:text-2xl font-extrabold text-gray-900 leading-tight">
                Khoan đã, ba mẹ ơi!
              </h3>
              <p className="text-gray-600 text-sm md:text-base mt-1">
                Để lại thông tin để nhận tư vấn miễn phí cho con
              </p>
            </div>

            <LeadForm />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
