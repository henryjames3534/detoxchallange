"use client";

import { useState } from "react";
import { Button } from "@/components/Button";

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/portal/auth/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setError(data.error ?? "Failed to update password");
      return;
    }

    setMessage("Password updated successfully");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md rounded-2xl border border-sky-200/60 bg-white p-6 shadow-sm"
    >
      <h2 className="mb-4 text-lg font-semibold text-[#1e3a5f]">Change password</h2>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      {message && (
        <p className="mb-4 rounded-lg bg-teal-50 px-3 py-2 text-sm text-teal-700">
          {message}
        </p>
      )}

      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-sky-900">
            Current password
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="w-full rounded-xl border border-sky-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-sky-900">
            New password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
            className="w-full rounded-xl border border-sky-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-sky-900">
            Confirm new password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full rounded-xl border border-sky-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500"
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Updating…" : "Update password"}
        </Button>
      </div>
    </form>
  );
}
