/** Treat unset or blank env values as undefined (Vercel often stores ""). */
export function env(key: string): string | undefined {
  const value = process.env[key]?.trim();
  return value || undefined;
}

export function envOr(key: string, fallback: string): string {
  return env(key) ?? fallback;
}
