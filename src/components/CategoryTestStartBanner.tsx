"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getCategoryBanner } from "@/lib/category-banners";
import { getCategoryTestLabel } from "@/lib/questionnaire";
import type { Category } from "@/lib/types";

const DURATION_MS = 5000;

interface CategoryTestStartBannerProps {
  category: Category;
  open: boolean;
  onComplete: () => void;
}

export function CategoryTestStartBanner({
  category,
  open,
  onComplete,
}: CategoryTestStartBannerProps) {
  const banner = getCategoryBanner(category.id);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!open) {
      setProgress(0);
      return;
    }

    const started = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const elapsed = now - started;
      const next = Math.min(100, (elapsed / DURATION_MS) * 100);
      setProgress(next);

      if (elapsed >= DURATION_MS) {
        onComplete();
        return;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [open, category.id, onComplete]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key={category.id}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="category-test-banner-title"
        >
          <div className="absolute inset-0 bg-sky-950/70 backdrop-blur-sm" aria-hidden />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/20 bg-white shadow-2xl shadow-sky-950/40 sm:max-w-xl sm:rounded-3xl"
          >
            <div className="relative aspect-[16/10] w-full min-h-[180px] sm:min-h-[220px]">
              <img
                src={banner.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-br ${banner.gradient} opacity-75 mix-blend-multiply`}
                aria-hidden
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-sky-950/80 via-sky-950/25 to-transparent"
                aria-hidden
              />
              <div className="absolute inset-0 flex flex-col items-center justify-end px-6 pb-8 pt-12 text-center text-white sm:px-8 sm:pb-10">
                <span className="mb-3 text-5xl drop-shadow-lg sm:text-6xl" aria-hidden>
                  {banner.emoji}
                </span>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-100/90 sm:text-sm">
                  Starting next section
                </p>
                <h2
                  id="category-test-banner-title"
                  className="mt-2 font-serif text-3xl font-bold tracking-tight drop-shadow-md sm:text-4xl"
                >
                  {getCategoryTestLabel(category.name)}
                </h2>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/90 sm:text-base">
                  {banner.subtitle}
                </p>
              </div>
            </div>

            <div className="border-t border-sky-100 bg-gradient-to-r from-cyan-50 to-teal-50 px-6 py-4 sm:px-8 sm:py-5">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="font-medium text-sky-800">
                  {category.questions.length} questions in this section
                </span>
                <span className="tabular-nums font-semibold text-teal-700">
                  {Math.max(0, Math.ceil(((100 - progress) / 100) * (DURATION_MS / 1000)))}s
                </span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-sky-200/80">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-teal-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
