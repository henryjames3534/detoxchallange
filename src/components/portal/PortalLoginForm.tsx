"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/Button";

export function PortalLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/portal/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setError(data.error ?? "Login failed");
      return;
    }

    const next = searchParams.get("next") ?? "/portal/patients";
    router.push(next);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-sky-900">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-xl border border-sky-200 px-4 py-3 text-[#1e3a5f] outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
          autoComplete="username"
          required
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-sky-900">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-sky-200 px-4 py-3 text-[#1e3a5f] outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
          autoComplete="current-password"
          required
        />
      </div>
      <Button type="submit" fullWidth disabled={loading}>
        {loading ? "Signing in…" : "Sign in to portal"}
      </Button>
    </form>
  );
}
