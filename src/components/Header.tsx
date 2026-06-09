"use client";

import Link from "next/link";
import { Logo } from "./Logo";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

interface HeaderProps {
  showHome?: boolean;
}

export function Header({ showHome = true }: HeaderProps) {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-sky-200/50 bg-white/85 backdrop-blur-lg">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-3 py-3 sm:gap-4 sm:px-6 sm:py-4 md:py-5">
        <Logo />
        <nav className="flex shrink-0 items-center gap-3 sm:gap-6">
          <Link
            href="/challenge"
            className="text-xs font-medium text-sky-800 hover:text-[#009698] sm:text-sm"
          >
            {t.nav.assessment}
          </Link>
          {showHome && (
            <Link
              href="/"
              className="text-xs font-medium text-sky-800 hover:text-[#009698] sm:text-sm"
            >
              {t.nav.home}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
