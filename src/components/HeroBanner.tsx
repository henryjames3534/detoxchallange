import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "./Button";
import { FEATURE_VIDEO, HERO_VIDEO_POSTER } from "@/lib/videos";

export function HeroBanner() {
  return (
    <section className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-xl border border-sky-200/60 shadow-lg shadow-sky-900/20 sm:rounded-2xl md:rounded-3xl md:shadow-[0_24px_80px_-20px_rgba(0,150,152,0.35)]">
        <div className="relative aspect-video w-full min-h-[220px] sm:min-h-[280px] md:min-h-0">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={HERO_VIDEO_POSTER}
            aria-label="Turquoise ocean waves — detox and hydration visual"
          >
            <source src={FEATURE_VIDEO} type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-sky-950/20" aria-hidden />
          <div
            className="absolute inset-0 bg-gradient-to-b from-white/5 via-sky-950/25 to-sky-950/55"
            aria-hidden
          />

          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 px-4 sm:gap-5 sm:px-6">
            <h1 className="text-center font-serif text-3xl font-bold uppercase tracking-wide text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.65)] sm:text-4xl md:text-5xl">
              Detox Challange
            </h1>
            <Link href="/challenge" className="w-full max-w-xs sm:max-w-none sm:w-auto">
              <Button
                size="lg"
                variant="pill"
                fullWidth
                className="w-full border-2 border-[#009698] bg-white text-sm font-bold uppercase tracking-wide text-[#1e3a5f] shadow-xl hover:bg-teal-50 sm:min-w-[260px] sm:w-auto sm:px-10 sm:py-4 sm:text-base md:py-5 md:text-lg"
              >
                Start Test
                <ArrowRight className="h-4 w-4 shrink-0 text-[#009698] sm:h-5 sm:w-5" />
              </Button>
            </Link>
            <Link
              href="/results"
              className="text-center text-xs font-semibold text-white underline-offset-4 drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)] hover:text-cyan-100 hover:underline sm:text-sm"
            >
              View previous results →
            </Link>
          </div>
        </div>
      </div>

      <p className="mt-4 px-2 text-center text-xs font-medium leading-relaxed text-sky-700/90 sm:mt-6 sm:text-sm">
        ~15 min · 63 questions · 😊 to 😢
        <span className="hidden sm:inline"> · Charts & diet recommendations</span>
      </p>
    </section>
  );
}
