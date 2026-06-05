"use client";

import { Calendar, Droplets, Gift, Sparkles, Star } from "lucide-react";
import {
  DETOX_PACKAGES,
  getPointRangeLabel,
  getRecommendedPackage,
  isPackageMatch,
} from "@/lib/packages";
import { cn } from "@/lib/utils";

interface PackageRecommendationTableProps {
  grandTotal: number;
  toxicLevelPercent: number;
  maxTotal: number;
}

export function PackageRecommendationTable({
  grandTotal,
  toxicLevelPercent,
  maxTotal,
}: PackageRecommendationTableProps) {
  const recommended = getRecommendedPackage(grandTotal);

  return (
    <section className="w-full">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-[#1e3a5f] sm:text-3xl">
          Package by Point Count and Toxic Level
        </h2>
        <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-cyan-500 to-teal-600" />
      </div>

      <div className="mb-8 overflow-hidden rounded-2xl border-2 border-teal-500/30 bg-gradient-to-br from-cyan-50 via-white to-teal-50 p-5 shadow-lg shadow-cyan-900/10 sm:p-6 md:p-8">
        <div className="mb-4 flex items-center gap-2 text-teal-700">
          <Sparkles className="h-5 w-5 shrink-0" />
          <p className="text-sm font-bold uppercase tracking-wider sm:text-base">
            Your recommended detox package
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">
              Package
            </p>
            <p className="mt-1 text-3xl font-bold text-[#1e3a5f] sm:text-4xl">
              {recommended.package}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">
              Sessions
            </p>
            <p className="mt-1 text-3xl font-bold text-[#1e3a5f] sm:text-4xl">
              {recommended.sessions}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">
              Toxic Level
            </p>
            <p className="mt-1 text-2xl font-bold text-[#1e3a5f] sm:text-3xl">
              {toxicLevelPercent.toFixed(1)}%
            </p>
            <p className="text-xs text-sky-600 sm:text-sm">
              Range {recommended.toxicLevelLabel}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">
              Point Count
            </p>
            <p className="mt-1 text-2xl font-bold text-[#1e3a5f] sm:text-3xl">
              {grandTotal}
            </p>
            <p className="text-xs text-sky-600 sm:text-sm">
              Range {getPointRangeLabel(recommended)} / {maxTotal}
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-sky-200/80 bg-white shadow-lg shadow-sky-900/5">
        <table className="w-full min-w-[520px] border-collapse text-center">
          <thead>
            <tr>
              <th className="rounded-tl-2xl bg-gradient-to-br from-[#009698] to-[#007a7c] px-4 py-4 text-sm font-bold text-white sm:px-6 sm:py-5 sm:text-base">
                <span className="inline-flex items-center justify-center gap-2">
                  <Gift className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
                  Package
                </span>
              </th>
              <th className="bg-gradient-to-br from-[#007a8a] to-[#006878] px-4 py-4 text-sm font-bold text-white sm:px-6 sm:py-5 sm:text-base">
                <span className="inline-flex items-center justify-center gap-2">
                  <Calendar className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
                  Sessions
                </span>
              </th>
              <th className="bg-gradient-to-br from-[#1e6b8a] to-[#1e5a7a] px-4 py-4 text-sm font-bold text-white sm:px-6 sm:py-5 sm:text-base">
                <span className="inline-flex items-center justify-center gap-2">
                  <Droplets className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
                  Toxic Level %
                </span>
              </th>
              <th className="rounded-tr-2xl bg-gradient-to-br from-[#1e3a5f] to-[#152d4a] px-4 py-4 text-sm font-bold text-white sm:px-6 sm:py-5 sm:text-base">
                <span className="inline-flex items-center justify-center gap-2">
                  <Star className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
                  Point Counts
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {DETOX_PACKAGES.map((pkg, index) => {
              const active = isPackageMatch(pkg, grandTotal);
              const isLast = index === DETOX_PACKAGES.length - 1;

              return (
                <tr
                  key={pkg.package}
                  className={cn(
                    "border-t border-sky-100 transition-colors",
                    active &&
                      "bg-gradient-to-r from-cyan-100 via-teal-50 to-cyan-100 ring-2 ring-inset ring-teal-500",
                  )}
                >
                  <td
                    className={cn(
                      "px-4 py-4 text-base text-[#1e3a5f] sm:px-6 sm:py-5 sm:text-lg",
                      isLast && "rounded-bl-2xl",
                      active && "font-bold",
                    )}
                  >
                    {pkg.package}
                    {active && (
                      <span className="ml-2 inline-block rounded-full bg-teal-600 px-2 py-0.5 text-xs font-bold text-white">
                        You
                      </span>
                    )}
                  </td>
                  <td
                    className={cn(
                      "px-4 py-4 text-base text-[#1e3a5f] sm:px-6 sm:py-5 sm:text-lg",
                      active && "font-bold",
                    )}
                  >
                    {pkg.sessions}
                  </td>
                  <td
                    className={cn(
                      "px-4 py-4 text-base text-[#1e3a5f] sm:px-6 sm:py-5 sm:text-lg",
                      active && "font-bold",
                    )}
                  >
                    {pkg.toxicLevelLabel}
                  </td>
                  <td
                    className={cn(
                      "px-4 py-4 text-base text-[#1e3a5f] sm:px-6 sm:py-5 sm:text-lg",
                      isLast && "rounded-br-2xl",
                      active && "font-bold",
                    )}
                  >
                    {getPointRangeLabel(pkg)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-center text-xs leading-relaxed text-sky-600 sm:text-sm">
        Your score of{" "}
        <strong className="text-[#1e3a5f]">{grandTotal}</strong> points places
        you in{" "}
        <strong className="text-[#1e3a5f]">Package {recommended.package}</strong>{" "}
        with{" "}
        <strong className="text-[#1e3a5f]">{recommended.sessions} sessions</strong>{" "}
        recommended for your toxic burden level.
      </p>
    </section>
  );
}
