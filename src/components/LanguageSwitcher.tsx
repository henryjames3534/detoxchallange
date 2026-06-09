"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import { LOCALE_LABELS, type Locale } from "@/lib/i18n/types";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

const OPTIONS: Locale[] = ["en", "es", "ht"];

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div
      ref={rootRef}
      className="fixed bottom-0 left-0 z-[70] print:hidden"
      aria-label="Language translator"
    >
      {open && (
        <div
          className="mb-0 min-w-[220px] overflow-hidden rounded-tr-xl border border-teal-200/80 bg-white shadow-2xl shadow-teal-900/15"
          role="menu"
        >
          {OPTIONS.map((code) => (
            <button
              key={code}
              type="button"
              role="menuitemradio"
              aria-checked={locale === code}
              onClick={() => {
                setLocale(code);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium transition",
                locale === code
                  ? "bg-gradient-to-r from-cyan-50 to-teal-50 text-teal-900"
                  : "text-sky-900 hover:bg-sky-50",
              )}
            >
              <span>{LOCALE_LABELS[code]}</span>
              {locale === code && (
                <span className="text-xs font-bold uppercase tracking-wide text-teal-600">
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 bg-gradient-to-r from-[#009698] to-teal-600 px-5 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-[0_-4px_24px_rgba(0,150,152,0.35)] transition hover:from-teal-700 hover:to-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300"
      >
        {t.lang.translate}
        <ChevronRight
          className={cn(
            "h-4 w-4 transition-transform",
            open && "rotate-90",
          )}
          aria-hidden
        />
        <ChevronRight className="-ml-3 h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}
