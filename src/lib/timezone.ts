/** AcuActiv app timezone — Miami clinic (US Eastern). */
export const APP_TIMEZONE = "America/New_York";

const WEEKDAY_MAP: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

export interface EasternParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  weekday: number;
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export function toDate(value: string | Date): Date {
  return typeof value === "string" ? new Date(value) : value;
}

export function getEasternParts(date: Date): EasternParts {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: APP_TIMEZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
    weekday: "short",
  });

  const parts = Object.fromEntries(
    fmt
      .formatToParts(date)
      .filter((p) => p.type !== "literal")
      .map((p) => [p.type, p.value]),
  );

  const weekdayKey = (parts.weekday ?? "Sun").slice(0, 3);

  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour) % 24,
    minute: Number(parts.minute),
    weekday: WEEKDAY_MAP[weekdayKey] ?? 0,
  };
}

/** Wall-clock Eastern time → UTC Date for storage. */
export function easternToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
): Date {
  let utc = Date.UTC(year, month - 1, day, hour, minute);

  for (let i = 0; i < 6; i++) {
    const p = getEasternParts(new Date(utc));
    const dayDiff = day - p.day;
    const minuteDiff = hour * 60 + minute - (p.hour * 60 + p.minute);
    const totalDiffMin = dayDiff * 24 * 60 + minuteDiff;

    if (
      totalDiffMin === 0 &&
      p.year === year &&
      p.month === month &&
      p.day === day
    ) {
      break;
    }

    utc -= totalDiffMin * 60 * 1000;
  }

  return new Date(utc);
}

export function addEasternDays(date: Date, days: number): Date {
  const p = getEasternParts(date);
  const noonUtc = Date.UTC(p.year, p.month - 1, p.day + days, 12, 0, 0);
  const next = getEasternParts(new Date(noonUtc));
  return easternToUtc(next.year, next.month, next.day, p.hour, p.minute);
}

export function formatInEastern(
  value: string | Date,
  options: Intl.DateTimeFormatOptions = {},
): string {
  return toDate(value).toLocaleString("en-US", {
    timeZone: APP_TIMEZONE,
    ...options,
  });
}

export function formatDateTimeEastern(value: string | Date): string {
  return formatInEastern(value, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

export function formatDateEastern(value: string | Date): string {
  return formatInEastern(value, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatSessionWhenEastern(sessionDate: Date): string {
  return formatInEastern(sessionDate, {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

export function formatCompletedAtEastern(value: string | Date): string {
  return formatInEastern(value, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

/** YYYY-MM-DD for date inputs, in Eastern. */
export function getEasternDateInputValue(value: string | Date = new Date()): string {
  const p = getEasternParts(toDate(value));
  return `${p.year}-${pad2(p.month)}-${pad2(p.day)}`;
}

/** datetime-local value interpreted as Eastern wall time. */
export function toDateTimeLocalValueEastern(value: string | Date): string {
  const p = getEasternParts(toDate(value));
  return `${p.year}-${pad2(p.month)}-${pad2(p.day)}T${pad2(p.hour)}:${pad2(p.minute)}`;
}

export function fromDateTimeLocalValueEastern(value: string): Date {
  const [datePart, timePart] = value.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);
  return easternToUtc(year, month, day, hour, minute);
}

/** Eastern calendar date as YYYYMMDD (e.g. invoice numbers). */
export function getEasternCompactDate(date: Date = new Date()): string {
  const p = getEasternParts(date);
  return `${p.year}${pad2(p.month)}${pad2(p.day)}`;
}

export function nowIsoUtc(): string {
  return new Date().toISOString();
}
