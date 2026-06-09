# AcuActiv Detox Challenge (Enhanced)

Professional rebuild of the [AcuActiv Detox Challenge](https://detox.acuactiv.com/) — a multi-step symptom assessment that calculates toxic burden across 8 body systems.

## Features

- **Landing page** with program overview and CTA
- **Personal information** form (imperial/metric height & weight)
- **63-question questionnaire** across 8 categories with 5-point frequency scale
- **Step-by-step wizard** with progress tracking and category pills
- **Review screen** before submission
- **Results dashboard** with grand total, toxic burden %, bar chart, and category breakdown
- **Print / save** results
- **Legacy URL redirects** (`/callenge-question` → `/challenge`)
- Optional webhook for email/API integration

## Scoring (matches original)

| Score | Meaning |
|-------|---------|
| 0 | Never or almost never |
| 1 | Occasionally |
| 2 | Occasionally, severe effect |
| 3 | Frequently, not severe |
| 4 | Frequently, severe |

**Max total:** 252 points · **Toxic level:** `(grandTotal / 252) × 100%`

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3002](http://localhost:3002)

### Doctor portal

```bash
cp .env.example .env   # if needed
npm run db:setup       # create SQLite DB + seed doctor account
```

Sign in at **[http://localhost:3002/portal/login](http://localhost:3002/portal/login)**

Default credentials (change after first login via Settings):

| Field | Value |
|-------|-------|
| Username | `doctor` |
| Password | `AcuActiv2026!` |

Portal features:

- **Patients** — all challenge submissions, date-sorted, with scores and package recommendations
- **Sessions** — auto-created weekly from package (e.g. Package 4 = 15 sessions); doctor can edit any date/time
- **Automation** — patient + doctor reminders 24h before; invoice generated and emailed 12h before each session
- **Invoices** — manual or auto-generated, printable for patients
- **Settings** — change doctor password

Run session automation manually from the Sessions tab (or schedule hourly cron):

```bash
curl -X POST http://localhost:3002/api/portal/reminders \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## Deploy

```bash
npm run build
npm start
```

### Production (Vercel + Neon PostgreSQL)

Set these in **Vercel → Project → Settings → Environment Variables**:

| Variable | Value |
|----------|--------|
| `DATABASE_URL` | Neon **pooler** connection string (`...-pooler...neon.tech/neondb?sslmode=require`) |
| `PORTAL_SESSION_SECRET` | Long random string |
| `DOCTOR_USERNAME` | `doctor` |
| `DOCTOR_PASSWORD` | Your portal password |
| `DOCTOR_NAME` | `Dr. Shlomi Gavish` |
| `DOCTOR_EMAIL` | `info@acuactiv.com` |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | Gmail address |
| `SMTP_PASS` | Gmail app password |
| `SMTP_FROM` | `AcuActiv <your@gmail.com>` |
| `CLINIC_NAME` | `AcuActiv` |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` |
| `CRON_SECRET` | Long random string (for hourly session reminders) |

After first deploy, run locally once (with production `DATABASE_URL` in `.env`):

```bash
npm run db:setup
```

Or run `npm run db:push` and `npm run db:seed` against Neon.

Verify locally:

```bash
npx tsx scripts/verify-setup.ts
```

Set Gmail SMTP in `.env` (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`) for all emails:
challenge thank-you to patient, doctor notification, session reminders, and invoices.

Set `DETOX_EMAIL_WEBHOOK` in production to forward submissions to your backend.

## Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts
- React Hook Form + Zod

## Credit

All rights reserved to **Dr. Shlomi Gavish DOM, AP** — AcuActiv Medical Detoxification Program.
