"use client";

import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "./Button";
import { FEATURE_VIDEO, HERO_VIDEO_POSTER } from "@/lib/videos";
import { GlassCard } from "./GlassCard";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export function VideoFeatureSection() {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-14">
      <div className="order-2 space-y-5 md:order-1 md:space-y-6">
        <span className="inline-flex items-center gap-2 rounded-full bg-cyan-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-cyan-900">
          <Play className="h-3.5 w-3.5 shrink-0" />
          {t.video.badge}
        </span>
        <h2 className="text-2xl font-bold leading-tight text-[#1e3a5f] sm:text-3xl md:text-4xl">
          {t.video.title}
        </h2>
        <p className="text-base leading-relaxed text-sky-800/90 sm:text-lg">
          {t.video.description}
        </p>
        <Link href="/challenge" className="block w-full pt-1 sm:inline-block sm:w-auto">
          <Button size="lg" fullWidth className="sm:w-auto">
            {t.video.cta}
            <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>
      </div>

      <GlassCard className="order-1 overflow-hidden p-2 sm:p-3 md:order-2 md:p-4">
        <div className="relative aspect-video w-full min-h-[200px] overflow-hidden rounded-lg sm:rounded-xl">
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={HERO_VIDEO_POSTER}
            aria-label="Turquoise ocean waves — detox and hydration visual"
          >
            <source src={FEATURE_VIDEO} type="video/mp4" />
          </video>
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-cyan-900/30 to-transparent"
            aria-hidden
          />
        </div>
      </GlassCard>
    </div>
  );
}
