"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { HeroBanner } from "@/components/HeroBanner";
import { VideoFeatureSection } from "@/components/VideoFeatureSection";
import {
  ArrowRight,
  Brain,
  ClipboardList,
  Droplets,
  Heart,
  Leaf,
  Shield,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/Button";
import { WaveDivider } from "@/components/WaveDivider";
import { GlassCard } from "@/components/GlassCard";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const categoryMeta = [
  { id: "emotions", icon: Heart, count: 10, emoji: "💚" },
  { id: "skin", icon: Sparkles, count: 9, emoji: "✨" },
  { id: "ent", icon: Stethoscope, count: 9, emoji: "👂" },
  { id: "brain", icon: Brain, count: 10, emoji: "🧠" },
  { id: "digestive", icon: Leaf, count: 9, emoji: "🌿" },
  { id: "kidney", icon: Droplets, count: 5, emoji: "💧" },
  { id: "joints", icon: Heart, count: 5, emoji: "🦴" },
  { id: "metabolism", icon: Sparkles, count: 6, emoji: "⚡" },
] as const;

const featureIcons = [ClipboardList, Sparkles, Droplets] as const;

export function HomePageClient() {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen flex-col page-bg">
      <header className="border-b border-sky-200/50 bg-white/90 backdrop-blur-lg">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-3 py-3 sm:gap-4 sm:px-6 sm:py-4 md:py-5">
          <Logo />
          <a
            href="https://acuactiv.com"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-xs font-medium text-sky-800 hover:text-teal-600 sm:text-sm"
          >
            acuactiv.com
          </a>
        </div>
      </header>

      <div className="pt-6 sm:pt-8 lg:pt-10">
        <HeroBanner />
      </div>

      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-300/60 bg-white/80 px-5 py-2 text-sm font-medium text-teal-800 shadow-sm">
            <Stethoscope className="h-4 w-4" />
            {t.home.badge}
          </span>
          <h1 className="mt-6 text-3xl font-bold text-[#1e3a5f] sm:text-4xl lg:text-5xl">
            {t.home.title}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-sky-800/90">
            {t.home.subtitle}
          </p>
        </div>

        <div className="mt-16 lg:mt-20">
          <VideoFeatureSection />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:mt-16 sm:grid-cols-2 md:grid-cols-3 lg:mt-20 lg:gap-8">
          {t.home.features.map((f, i) => {
            const Icon = featureIcons[i] ?? Shield;
            return (
              <GlassCard key={f.title} className="text-center sm:text-left">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-100 to-teal-100 text-teal-700 sm:mx-0">
                  <Icon className="h-8 w-8" />
                </span>
                <h3 className="mt-6 text-lg font-semibold text-[#1e3a5f]">
                  {f.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-sky-800/85">
                  {f.description}
                </p>
              </GlassCard>
            );
          })}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-4 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
        <h2 className="text-center text-2xl font-bold text-[#1e3a5f] sm:text-3xl">
          {t.home.systemsTitle}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-sky-700">
          {t.home.systemsSubtitle}
        </p>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:grid-cols-4 sm:gap-5 lg:mt-12 lg:gap-6">
          {categoryMeta.map((c) => (
            <div
              key={c.id}
              className="glass-card flex flex-col items-center rounded-2xl border border-sky-200/60 p-5 text-center sm:p-6"
            >
              <span className="text-3xl">{c.emoji}</span>
              <c.icon className="mt-3 h-6 w-6 text-teal-600" />
              <p className="mt-3 text-sm font-semibold text-[#1e3a5f]">
                {t.categories[c.id]}
              </p>
              <p className="mt-1 text-xs text-sky-600">
                {c.count} {t.home.questions}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center lg:mt-14">
          <Link href="/challenge">
            <Button size="lg" variant="pill">
              {t.home.cta}
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <WaveDivider />
      <Footer />
    </div>
  );
}
