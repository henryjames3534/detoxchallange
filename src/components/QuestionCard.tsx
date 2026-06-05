"use client";

import { FREQUENCY_OPTIONS } from "@/lib/questionnaire";
import type { SymptomFrequency } from "@/lib/types";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  questionNumber: number;
  totalInCategory: number;
  text: string;
  value: SymptomFrequency | undefined;
  onChange: (value: SymptomFrequency) => void;
}

export function QuestionCard({
  questionNumber,
  totalInCategory,
  text,
  value,
  onChange,
}: QuestionCardProps) {
  return (
    <article className="glass-card w-full min-w-0 rounded-2xl border border-sky-200/60 p-4 shadow-lg shadow-sky-900/5 sm:p-6 md:p-8">
      <div className="mb-5 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <span className="w-fit rounded-full bg-gradient-to-r from-cyan-100 to-teal-100 px-3 py-1.5 text-xs font-bold text-teal-800 sm:px-4">
          Q{questionNumber} / {totalInCategory}
        </span>
        <span className="text-xs text-sky-600 sm:text-sm">Tap how you feel</span>
      </div>

      <h3 className="mb-6 text-xl font-semibold leading-snug text-[#1e3a5f] sm:mb-8 sm:text-2xl">
        {text}
      </h3>

      <div className="mb-6 flex flex-col gap-1 rounded-xl bg-sky-50 px-4 py-3 text-xs text-sky-700 sm:mb-8 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5 sm:py-3.5 sm:text-sm">
        <span>😊 Best</span>
        <span className="text-sky-500 sm:text-center">symptom severity →</span>
        <span className="sm:text-right">😢 Worst</span>
      </div>

      <div className="flex flex-col gap-3 sm:gap-4">
        {FREQUENCY_OPTIONS.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                "emoji-option flex w-full items-start gap-3 rounded-xl border-2 p-4 text-left transition sm:items-center sm:gap-5 sm:rounded-2xl sm:p-5 md:p-6",
                selected
                  ? "emoji-option-selected border-teal-500 bg-gradient-to-r from-cyan-50 to-teal-50"
                  : "border-sky-100 bg-white hover:border-sky-300 hover:bg-sky-50/80",
              )}
            >
              <span
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl sm:h-14 sm:w-14 sm:rounded-2xl sm:text-3xl md:h-16 md:w-16 md:text-4xl",
                  selected ? "bg-white ring-2 ring-teal-400" : "bg-sky-50",
                )}
                aria-hidden
              >
                {option.emoji}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-[#1e3a5f] sm:text-base">
                  {option.shortLabel}
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-sky-700 sm:mt-1.5 sm:text-sm">
                  {option.label}
                </span>
              </span>
              {selected && (
                <span className="shrink-0 rounded-full bg-teal-500 px-2.5 py-0.5 text-xs font-bold text-white sm:px-3">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>
    </article>
  );
}
