"use client";

import Link from "next/link";
import { Download, ArrowLeft } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/Button";
import { ResultsCharts } from "@/components/ResultsCharts";
import { DietRecommendations } from "@/components/DietRecommendations";
import { PackageRecommendationTable } from "@/components/PackageRecommendationTable";
import { getToxicLevelColor } from "@/lib/scoring";
import { usePrintMode } from "@/hooks/usePrintMode";
import type { ChallengeResults } from "@/lib/types";
import { formatDateTime } from "@/lib/portal-format";
import headerLogo from "@/assets/acuactiv-logo.png";

interface AssessmentResultsViewProps {
  results: ChallengeResults;
  patientId: string;
  patientName: string;
  packageNumber: number;
  packageSessions: number;
}

export function AssessmentResultsView({
  results,
  patientId,
  patientName,
  packageNumber,
  packageSessions,
}: AssessmentResultsViewProps) {
  const { printMode, printDocument } = usePrintMode();
  const toxicColor = getToxicLevelColor(results.toxicLevelPercent);

  return (
    <div className="results-print-document flex w-full flex-col gap-8 sm:gap-10 print:gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Link
          href={`/portal/patients/${patientId}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-teal-700 hover:text-teal-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {patientName}
        </Link>
        <Button variant="secondary" onClick={printDocument}>
          <Download className="h-4 w-4" />
          Save / Print PDF
        </Button>
      </div>

      <div className="hidden print:mb-4 print:flex print:items-center print:justify-between print:border-b print:border-sky-200 print:pb-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={headerLogo.src} alt="AcuActiv" className="h-10 w-auto" />
        <p className="text-sm font-medium text-sky-700">Detox Assessment Report</p>
      </div>

      <div className="results-print-hero print-avoid-break overflow-hidden rounded-2xl border border-sky-200/60 bg-gradient-to-r from-[#1e3a5f] to-cyan-800 p-6 text-center text-white shadow-lg sm:p-8 print:rounded-xl print:p-6 print:shadow-none">
        <p className="text-xs font-medium uppercase tracking-wider text-white/80">
          Patient assessment
        </p>
        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Complete Detox Results</h1>
        <p className="mt-2 text-sm text-white/90">
          {patientName} · {formatDateTime(results.completedAt)}
        </p>
        <p className="mt-3 text-sm text-white/90">
          Recommended Package {packageNumber} — {packageSessions} sessions
        </p>
      </div>

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
          <p
            className="mt-3 text-4xl font-bold sm:mt-4 sm:text-5xl"
            style={{ color: toxicColor }}
          >
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
        </GlassCard>
      </div>

      <GlassCard className="print-avoid-break">
        <h2 className="mb-6 text-xl font-semibold text-[#1e3a5f]">System Breakdown</h2>
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
          Visual Analytics
        </h2>
        <ResultsCharts categories={results.categories} printMode={printMode} />
      </div>

      <div className="print-section-break">
        <h2 className="mb-8 text-center text-2xl font-bold text-[#1e3a5f] sm:text-3xl print:mb-4 print:text-xl">
          Detox Diet & Recommendations
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
          Diet suggestions are educational and do not replace care from Dr. Shlomi
          Gavish DOM, AP. Detox products require an established patient
          consultation.
        </p>
      </GlassCard>
    </div>
  );
}
