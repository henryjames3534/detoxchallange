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

Open [http://localhost:3000](http://localhost:3000)

## Deploy

```bash
npm run build
npm start
```

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
