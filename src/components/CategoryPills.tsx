"use client";

import { getCategoryTestLabel } from "@/lib/questionnaire";
import { cn } from "@/lib/utils";

interface CategoryPillsProps {
  categories: { id: string; name: string }[];
  activeIndex: number;
}

export function CategoryPills({ categories, activeIndex }: CategoryPillsProps) {
  return (
    <div className="relative -mx-1 sm:mx-0">
      <div className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max min-w-full gap-2 pr-4 sm:w-auto sm:flex-wrap sm:pr-0">
          {categories.map((cat, i) => (
            <span
              key={cat.id}
              className={cn(
                "shrink-0 whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium sm:px-4 sm:py-2.5 sm:text-base",
                i === activeIndex
                  ? "bg-gradient-to-r from-cyan-600 to-teal-600 text-base font-semibold text-white shadow-md sm:text-lg"
                  : i < activeIndex
                    ? "bg-teal-100 text-teal-800"
                    : "bg-sky-100 text-sky-600",
              )}
            >
              {getCategoryTestLabel(cat.name)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
