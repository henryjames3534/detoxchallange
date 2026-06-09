import { Suspense } from "react";
import { PortalLoginForm } from "@/components/portal/PortalLoginForm";

export const metadata = {
  title: "Doctor Portal Login | AcuActiv",
};

export default function PortalLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-50 via-white to-teal-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-sky-200/60 bg-white p-8 shadow-xl shadow-sky-900/10">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-[#1e3a5f]">Doctor Portal</h1>
          <p className="mt-2 text-sm text-sky-700">
            Sign in to manage patients, sessions, and invoices
          </p>
        </div>
        <Suspense fallback={<div className="h-40 animate-pulse rounded-xl bg-sky-50" />}>
          <PortalLoginForm />
        </Suspense>
      </div>
    </div>
  );
}
