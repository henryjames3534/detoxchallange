"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-sky-200/40 bg-white/70 px-5 py-8 text-center text-sm text-sky-900/80 backdrop-blur-sm sm:px-8 sm:py-10">
      <p>
        {t.footer.rights}{" "}
        <span className="font-semibold text-[#1e3a5f]">
          Dr. Shlomi Gavish DOM, AP
        </span>
      </p>
      <p className="mt-2 text-xs text-sky-700/70">
        {t.footer.tagline}{" "}
        <a href="tel:8887706887" className="hover:underline">
          (888) 770-6887
        </a>
      </p>
    </footer>
  );
}
