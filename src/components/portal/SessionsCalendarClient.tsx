"use client";

import { useMemo, useState } from "react";
import { Calendar, Search, X } from "lucide-react";
import { patientName } from "@/lib/portal-format";
import {
  addEasternDays,
  getEasternDateInputValue,
  getEasternParts,
} from "@/lib/timezone";
import { QuickBookClient } from "@/components/portal/QuickBookClient";
import { SessionsListClient } from "@/components/portal/SessionsListClient";

type Session = {
  id: string;
  scheduledAt: string | Date;
  durationMins: number;
  notes: string | null;
  status: string;
  sessionIndex: number | null;
  patientReminderSentAt: string | Date | null;
  doctorReminderSentAt: string | Date | null;
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
};

type PatientOption = {
  id: string;
  firstName: string;
  lastName: string;
};

interface SessionsCalendarClientProps {
  sessions: Session[];
  patients: PatientOption[];
}

function matchesSessionSearch(session: Session, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const { patient } = session;
  const fullName = patientName(patient.firstName, patient.lastName).toLowerCase();

  return (
    fullName.includes(q) ||
    patient.firstName.toLowerCase().includes(q) ||
    patient.lastName.toLowerCase().includes(q) ||
    patient.email.toLowerCase().includes(q)
  );
}

function matchesSessionDateRange(
  session: Session,
  fromDate: string,
  toDate: string,
) {
  if (!fromDate && !toDate) return true;

  const sessionDate = getEasternDateInputValue(session.scheduledAt);

  if (fromDate && sessionDate < fromDate) return false;
  if (toDate && sessionDate > toDate) return false;
  return true;
}

export function SessionsCalendarClient({
  sessions,
  patients,
}: SessionsCalendarClientProps) {
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const hasFilters = Boolean(search || fromDate || toDate);

  const filtered = useMemo(
    () =>
      sessions.filter(
        (s) =>
          matchesSessionSearch(s, search) &&
          matchesSessionDateRange(s, fromDate, toDate),
      ),
    [sessions, search, fromDate, toDate],
  );

  const now = new Date();
  const upcoming = filtered.filter(
    (s) => s.status !== "cancelled" && new Date(s.scheduledAt) >= now,
  );
  const past = filtered.filter(
    (s) => s.status === "cancelled" || new Date(s.scheduledAt) < now,
  );

  function setTodayFilter() {
    const today = getEasternDateInputValue(new Date());
    setFromDate(today);
    setToDate(today);
  }

  function setThisWeekFilter() {
    const today = new Date();
    const { weekday } = getEasternParts(today);
    const weekStart = addEasternDays(today, -weekday);
    setFromDate(getEasternDateInputValue(weekStart));
    setToDate(getEasternDateInputValue(today));
  }

  function clearFilters() {
    setSearch("");
    setFromDate("");
    setToDate("");
  }

  return (
    <>
      <div className="mb-6 rounded-2xl border border-sky-200/60 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#1e3a5f]">
          <Calendar className="h-4 w-4 text-teal-600" />
          Filter sessions
        </div>

        <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-500" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by patient name or email…"
              className="w-full rounded-xl border border-sky-200 py-2.5 pl-10 pr-3 text-sm text-[#1e3a5f] outline-none placeholder:text-sky-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
              aria-label="Search sessions by patient"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-sky-700">
              From date
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full rounded-xl border border-sky-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 lg:w-auto"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-sky-700">
              To date
            </label>
            <input
              type="date"
              value={toDate}
              min={fromDate || undefined}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full rounded-xl border border-sky-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 lg:w-auto"
            />
          </div>

          {hasFilters && (
            <div className="flex items-end">
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 rounded-xl border border-sky-200 px-3 py-2.5 text-sm font-medium text-sky-700 hover:bg-sky-50"
              >
                <X className="h-4 w-4" />
                Clear
              </button>
            </div>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-sky-600">Quick filters:</span>
          <button
            type="button"
            onClick={setTodayFilter}
            className="rounded-lg border border-sky-200 px-2.5 py-1 text-xs font-medium text-sky-700 hover:bg-sky-50"
          >
            Today
          </button>
          <button
            type="button"
            onClick={setThisWeekFilter}
            className="rounded-lg border border-sky-200 px-2.5 py-1 text-xs font-medium text-sky-700 hover:bg-sky-50"
          >
            This week
          </button>
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-lg border border-sky-200 px-2.5 py-1 text-xs font-medium text-sky-700 hover:bg-sky-50"
          >
            All dates
          </button>
          <span className="ml-auto text-xs text-sky-600">
            {filtered.length} session{filtered.length === 1 ? "" : "s"} match
          </span>
        </div>
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <h2 className="mb-4 text-lg font-semibold text-[#1e3a5f]">Quick book</h2>
          {patients.length === 0 ? (
            <p className="text-sm text-sky-700">No patients available yet.</p>
          ) : (
            <QuickBookClient patients={patients} />
          )}
        </div>
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-[#1e3a5f]">
            Upcoming ({upcoming.length})
          </h2>
          {upcoming.length === 0 ? (
            <p className="text-sm text-sky-700">
              {hasFilters
                ? "No upcoming sessions match your filters."
                : "No upcoming sessions."}
            </p>
          ) : (
            <SessionsListClient sessions={upcoming} />
          )}
        </div>
      </div>

      {(past.length > 0 || hasFilters) && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-[#1e3a5f]">
            Past & cancelled ({past.length})
          </h2>
          {past.length === 0 ? (
            <p className="text-sm text-sky-700">
              No past or cancelled sessions match your filters.
            </p>
          ) : (
            <SessionsListClient sessions={past} />
          )}
        </div>
      )}
    </>
  );
}
