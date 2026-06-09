"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Calendar,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/portal/patients", label: "Patients", icon: Users },
  { href: "/portal/sessions", label: "Sessions", icon: Calendar },
  { href: "/portal/invoices", label: "Invoices", icon: FileText },
  { href: "/portal/settings", label: "Settings", icon: Settings },
];

interface PortalShellProps {
  doctorName: string;
  children: React.ReactNode;
}

export function PortalShell({ doctorName, children }: PortalShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/portal/auth/logout", { method: "POST" });
    router.push("/portal/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-sky-200/60 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="h-6 w-6 text-teal-600" />
            <div>
              <p className="text-sm font-bold text-[#1e3a5f]">AcuActiv Doctor Portal</p>
              <p className="text-xs text-sky-600">{doctorName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-sky-700 hover:bg-sky-50"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 pb-0 sm:px-6">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition",
                pathname.startsWith(href)
                  ? "border-teal-600 text-teal-700"
                  : "border-transparent text-sky-600 hover:text-teal-700",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
