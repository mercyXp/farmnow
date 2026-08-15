# FarmNow ERP Architecture

Single-user, cloud broiler farm ERP. Re-engineers the Excel/VBA system (`FarmNow_ERP_System.xlsx`) into a Next.js + Supabase application. Not a visual clone of the workbook.

## Stack

| Layer | Choice |
|---|---|
| App | Next.js App Router, TypeScript (`strict`) |
| UI | Tailwind CSS, shadcn/ui, Lucide |
| Forms | React Hook Form + Zod (client and server) |
| Charts | Recharts |
| Data | Supabase PostgreSQL + Auth |
| Access | Supabase JS client (no second ORM) |
| PDF | `@react-pdf/renderer` on the server |
| Excel import | ExcelJS parse → Zod validate → preview → insert |
| Tests | Vitest (domain calculations + business rules) |
| Monorepo | pnpm + Turborepo |
| Deploy | Vercel (app) + Supabase (DB/Auth) |

No Docker, Kubernetes, FastAPI, or microservices.

## Repository

```
farmnow/
  apps/web/                 Next.js application
  packages/domain/          Zod schemas + Excel-parity calculations
  packages/database/        Generated Supabase TypeScript types
  supabase/migrations/      Schema, views, RLS, functions
  supabase/seed.sql         Demo data (marked as development)
  docs/                     Mapping, rules, this file, database.md
```

shadcn/ui lives in `apps/web` (one app; no extra UI package).

## Data access

- Server Components and Server Actions call `createClient()` from `apps/web/lib/supabase/server.ts` (user session, RLS).
- Privileged admin tasks (if any) use a server-only service client that is **never** imported from client components.
- Feature modules own queries, actions, schemas, and UI:

```
apps/web/features/<module>/
  components/
  actions/
  queries/
  schemas.ts
  types.ts
```

Shared Excel-parity math lives in `packages/domain` so tests do not need React or a database.

## Auth

- `/login` with email/password via Supabase Auth.
- Middleware + server layout guard all `/` app routes except `/login`.
- `profiles` row (1:1 with `auth.users`) holds display name. Single administrator for v1.
- RLS: authenticated users may read/write operational tables. Anon has no access.
- Schema is user-id-ready (`created_by`) so additional users can be added later without a rewrite. No multi-tenant org table.

## Transaction integrity

1. Validate with Zod (shared schemas).
2. Re-check in a Postgres function or action against current balances.
3. Insert the transaction row.
4. Balances and KPIs are **derived** from history (`v_flock_kpis`, `v_feed_stock`). Totals are not stored on the flock row.
5. Write `audit_logs`.

Critical checks run in SQL (check constraints + RPC) so they cannot be bypassed by a malformed client payload.

## Derived views (not tables)

- `v_flock_kpis` — Excel `calc_KPI_Engine`
- `v_feed_stock` — Excel `calc_FeedStockSummary`
- Medicine expiry status is a SQL expression on `medicine_lots` (or a small view)

## Modules (justified by the workbook)

| Nav group | Routes |
|---|---|
| Dashboard | `/dashboard` |
| Farm | `/flocks`, `/flocks/[id]`, `/performance`, `/routines`, `/environment` |
| Transactions | `/mortality`, `/feed`, `/medicine`, `/inventory`, `/sales`, `/purchases`, `/expenses`, `/income` |
| Reports | `/reports`, PDF download routes |
| Settings | master data, lookups, company/KPI settings, audit, Excel import |

`/purchases` is feed purchases (the only purchase register in Excel). `/inventory` combines feed stock + medicine lots + alerts.

## Environment

See `.env.example`. `SUPABASE_SERVICE_ROLE_KEY` is server-only. Never commit `.env.local`.

## Deployment

```
GitHub → Vercel (Next.js) → Supabase (Postgres, Auth, Storage)
```
