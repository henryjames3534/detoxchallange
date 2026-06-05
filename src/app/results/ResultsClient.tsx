"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  Home,
  RotateCcw,
} from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/Button";
import { ResultsCharts } from "@/components/ResultsCharts";
import { DietRecommendations } from "@/components/DietRecommendations";
import { PackageRecommendationTable } from "@/components/PackageRecommendationTable";
import { loadResults, clearChallengeData } from "@/lib/storage";
import { getToxicLevelColor } from "@/lib/scoring";
import { usePrintMode } from "@/hooks/usePrintMode";
import headerLogo from "@/assets/acuactiv-logo.png";

export function ResultsClient() {
  const [results, setResults] = useState(
    null as ReturnType<typeof loadResults>,
  );
  const [mounted, setMounted] = useState(false);
  const { printMode, printDocument } = usePrintMode();

  useEffect(() => {
    setResults(loadResults());
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="page-bg flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
      </div>
    );
  }

  if (!results) {
    return (
      <PageShell>
        <div className="mx-auto flex max-w-lg flex-col items-center py-16 text-center">
          <AlertTriangle className="mb-4 h-12 w-12 text-amber-500" />
          <h1 className="text-2xl font-bold text-[#1e3a5f]">No results found</h1>
          <p className="mt-2 text-sky-700">
            Complete the detox challenge to unlock charts and your diet plan.
          </p>
          <Link href="/challenge" className="mt-6">
            <Button size="lg">Start Assessment</Button>
          </Link>
        </div>
      </PageShell>
    );
  }

  const toxicColor = getToxicLevelColor(results.toxicLevelPercent);

  const handleRestart = () => {
    clearChallengeData();
    window.location.href = "/challenge";
  };

  return (
    <PageShell wide>
      <div className="results-print-document flex w-full flex-col gap-8 sm:gap-10 print:gap-6 print:py-0">
        <div className="hidden print:mb-4 print:flex print:items-center print:justify-between print:border-b print:border-sky-200 print:pb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={headerLogo.src}
            alt="AcuActiv"
            className="h-10 w-auto"
          />
          <p className="text-sm font-medium text-sky-700">
            Detox Assessment Report
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="results-print-hero print-avoid-break overflow-hidden rounded-2xl border border-sky-200/60 bg-gradient-to-r from-[#1e3a5f] to-cyan-800 p-6 text-center text-white shadow-lg sm:p-8 md:p-10 print:rounded-xl print:p-6 print:shadow-none"
        >
          <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Assessment Complete
          </span>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Your Detox Results</h1>
          <p className="mt-2 text-sm text-white/90">
            {results.personal.firstName} {results.personal.lastName} ·{" "}
            {new Date(results.completedAt).toLocaleDateString()}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 print:grid-cols-2 print:gap-4">
          <GlassCard className="print-avoid-break text-center sm:text-left">
            <p className="text-xs font-bold uppercase tracking-wider text-sky-600">
              Grand Total
            </p>
            <p className="mt-3 text-4xl font-bold text-[#1e3a5f] sm:mt-4 sm:text-5xl">
              {results.grandTotal}
              <span className="text-xl font-normal text-sky-400 sm:text-2xl">
                /{results.maxTotal}
              </span>
            </p>
          </GlassCard>

          <GlassCard className="print-avoid-break">
            <p className="text-xs font-bold uppercase tracking-wider text-sky-600">
              Toxic Burden
            </p>
            <p className="mt-3 text-4xl font-bold sm:mt-4 sm:text-5xl" style={{ color: toxicColor }}>
              {results.toxicLevelPercent.toFixed(1)}%
            </p>
            <p className="font-semibold" style={{ color: toxicColor }}>
              {results.toxicLevelLabel}
            </p>
            <div className="mt-6 h-4 overflow-hidden rounded-full bg-sky-100">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min(100, results.toxicLevelPercent)}%`,
                  background:
                    "linear-gradient(to right, #22c55e, #eab308, #f97316, #ef4444)",
                }}
              />
            </div>
            <div className="mt-1 flex justify-between text-xs text-sky-500">
              <span>😊 Low</span>
              <span>😢 High</span>
            </div>
          </GlassCard>
        </div>

        {/* Category progress bars */}
        <GlassCard className="print-avoid-break">
          <h2 className="mb-6 text-xl font-semibold text-[#1e3a5f]">
            System Breakdown
          </h2>
          <div className="space-y-6">
            {results.categories.map((cat) => (
              <div key={cat.categoryId}>
                <div className="mb-2 flex flex-col gap-0.5 text-sm sm:flex-row sm:justify-between sm:gap-4">
                  <span className="font-medium text-sky-900">{cat.name}</span>
                  <span className="shrink-0 text-sky-600">
                    {cat.score}/{cat.maxScore} ({cat.percent.toFixed(0)}%)
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-sky-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-teal-500"
                    style={{ width: `${Math.min(100, cat.percent)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <div className="print-section-break print-avoid-break">
          <h2 className="mb-8 text-center text-2xl font-bold text-[#1e3a5f] sm:text-3xl print:mb-4 print:text-xl">
            📊 Visual Analytics
          </h2>
          <ResultsCharts categories={results.categories} printMode={printMode} />
        </div>

        <div className="print-section-break">
          <h2 className="mb-8 text-center text-2xl font-bold text-[#1e3a5f] sm:text-3xl print:mb-4 print:text-xl">
            🥗 Your Detox Diet & Recommendations
          </h2>
          <DietRecommendations results={results} />
        </div>

        <GlassCard className="print-section-break print-avoid-break overflow-hidden p-4 sm:p-6 md:p-8 print:p-5">
          <PackageRecommendationTable
            grandTotal={results.grandTotal}
            toxicLevelPercent={results.toxicLevelPercent}
            maxTotal={results.maxTotal}
          />
        </GlassCard>

        <GlassCard className="print-avoid-break border-amber-200/80 bg-amber-50/50">
          <p className="font-semibold text-amber-950">Medical disclaimer</p>
          <p className="mt-3 text-sm leading-relaxed text-amber-900/90">
            Diet suggestions are educational and do not replace care from Dr.
            Shlomi Gavish DOM, AP. Detox products require an established patient
            consultation.{" "}
            <a href="mailto:acuactiv@gmail.com" className="font-medium underline">
              acuactiv@gmail.com
            </a>{" "}
            · (888) 770-6887
          </p>
        </GlassCard>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4 print:hidden">
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="secondary" fullWidth className="sm:w-auto">
              <Home className="h-4 w-4" />
              Home
            </Button>
          </Link>
          <Button variant="secondary" fullWidth className="sm:w-auto" onClick={printDocument}>
            <Download className="h-4 w-4" />
            Save / Print PDF
          </Button>
          <Button variant="ghost" fullWidth className="sm:w-auto" onClick={handleRestart}>
            <RotateCcw className="h-4 w-4" />
            Retake
          </Button>
        </div>
      </div>
    </PageShell>
  );
}
