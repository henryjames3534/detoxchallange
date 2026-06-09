import { requireDoctor } from "@/lib/portal-auth";
import { ChangePasswordForm } from "@/components/portal/ChangePasswordForm";

export default async function SettingsPage() {
  const doctor = await requireDoctor();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1e3a5f]">Settings</h1>
        <p className="mt-1 text-sm text-sky-700">
          Manage your portal account
        </p>
      </div>

      <div className="mb-8 rounded-2xl border border-sky-200/60 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-sky-600">
          Account
        </h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-sky-600">Name</dt>
            <dd className="font-medium text-[#1e3a5f]">{doctor?.name}</dd>
          </div>
          <div>
            <dt className="text-sky-600">Username</dt>
            <dd className="font-medium text-[#1e3a5f]">{doctor?.username}</dd>
          </div>
          <div>
            <dt className="text-sky-600">Email</dt>
            <dd className="font-medium text-[#1e3a5f]">{doctor?.email ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-sky-600">Clinic</dt>
            <dd className="font-medium text-[#1e3a5f]">{doctor?.clinicName}</dd>
          </div>
        </dl>
      </div>

      <ChangePasswordForm />

      <div className="mt-8 rounded-2xl border border-sky-100 bg-sky-50/50 p-5 text-sm text-sky-700">
        <p className="font-medium text-[#1e3a5f]">Portal URL</p>
        <p className="mt-1">
          Doctors sign in at{" "}
          <code className="rounded bg-white px-1.5 py-0.5 text-teal-700">
            /portal/login
          </code>
        </p>
      </div>
    </div>
  );
}
