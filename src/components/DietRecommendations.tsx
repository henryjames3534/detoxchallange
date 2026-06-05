"use client";

import { Apple, Droplets, Salad, XCircle } from "lucide-react";
import {
  getCategoryAdvice,
  getDietPlan,
  getWellnessSummary,
  type CategoryAdvice,
} from "@/lib/recommendations";
import type { ChallengeResults } from "@/lib/types";
import { GlassCard } from "./GlassCard";

interface DietRecommendationsProps {
  results: ChallengeResults;
}

function CategoryFocusCard({ advice }: { advice: CategoryAdvice }) {
  return (
    <div className="rounded-xl border border-teal-200/60 bg-gradient-to-br from-white to-cyan-50/50 p-4 sm:p-5">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h4 className="font-semibold text-[#1e3a5f]">{advice.name}</h4>
        <span className="w-fit rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
          {advice.percent.toFixed(0)}% burden
        </span>
      </div>
      <p className="text-sm font-medium text-teal-700">{advice.focus}</p>
      <ul className="mt-3 space-y-1.5">
        {advice.foods.map((food) => (
          <li
            key={food}
            className="flex items-start gap-2 text-sm text-sky-900/90"
          >
            <span className="text-teal-500">✦</span>
            {food}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DietRecommendations({ results }: DietRecommendationsProps) {
  const plan = getDietPlan(results);
  const categoryAdvice = getCategoryAdvice(results.categories);
  const summary = getWellnessSummary(results);

  return (
    <div className="space-y-10">
      <GlassCard className="border-teal-200/80 bg-gradient-to-r from-cyan-50/90 to-teal-50/90">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <span className="text-4xl sm:text-5xl" aria-hidden>
            🥗
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-700 sm:text-sm">
              Your Personalized Plan
            </p>
            <h2 className="mt-1 text-xl font-bold text-[#1e3a5f] sm:text-2xl">
              {plan.title}
            </h2>
            <p className="mt-2 leading-relaxed text-sky-800">{summary}</p>
            <p className="mt-2 text-sm text-sky-700">{plan.summary}</p>
          </div>
        </div>
      </GlassCard>

      {categoryAdvice.length > 0 && (
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-[#1e3a5f]">
            <span>🎯</span> Priority Systems to Support
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categoryAdvice.map((a) => (
              <CategoryFocusCard key={a.categoryId} advice={a} />
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <GlassCard>
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-emerald-800">
            <Salad className="h-5 w-5" />
            Eat More Of
          </h3>
          <ul className="space-y-3">
            {plan.eat.map((item) => (
              <li
                key={item.name}
                className="flex gap-3 rounded-xl bg-emerald-50/80 p-3"
              >
                <span className="text-2xl" aria-hidden>
                  {item.icon}
                </span>
                <div>
                  <p className="font-semibold text-emerald-900">{item.name}</p>
                  <p className="text-sm text-emerald-700/90">{item.benefit}</p>
                </div>
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard>
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-red-800">
            <XCircle className="h-5 w-5" />
            Reduce or Avoid
          </h3>
          <ul className="space-y-2">
            {plan.avoid.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 rounded-lg bg-red-50/60 px-3 py-2 text-sm text-red-900/90"
              >
                <span className="text-red-400">✕</span>
                {item}
              </li>
            ))}
          </ul>

          <h3 className="mb-3 mt-6 flex items-center gap-2 text-lg font-semibold text-sky-800">
            <Droplets className="h-5 w-5" />
            Hydration
          </h3>
          <ul className="space-y-2">
            {plan.hydration.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-sm text-sky-800"
              >
                <span>💧</span>
                {item}
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>

      <GlassCard>
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[#1e3a5f]">
          <Apple className="h-5 w-5 text-amber-600" />
          Daily Wellness Tips
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {plan.dailyTips.map((tip, i) => (
            <div
              key={tip}
              className="flex gap-3 rounded-xl border border-sky-100 bg-sky-50/50 p-4"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 text-sm font-bold text-white">
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed text-sky-900">{tip}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
