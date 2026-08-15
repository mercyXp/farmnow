# FarmNow ERP

Production-oriented broiler farm management system for **FarmNow Limited** (Lusaka, Zambia). It re-engineers the Excel/VBA workbook `FarmNow_ERP_System.xlsx` into a Next.js + Supabase application. The workbook remains the functional reference; PostgreSQL is the source of truth.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Supabase PostgreSQL + Auth
- pnpm + Next.js (App Router)
- Zod + React Hook Form patterns
- Recharts, `@react-pdf/renderer`, ExcelJS
- Vitest for Excel-parity calculations

No Docker, Kubernetes, or separate Python API.

## Monorepo

```
apps/web              Next.js application
packages/domain       Excel-parity math + Zod schemas
packages/database     Supabase TypeScript types
supabase/migrations   Schema, views, RLS
supabase/seed.sql     Demo data from the workbook
docs/                 Mapping, business rules, architecture
```

## Local setup

1. Copy `.env.example` to `apps/web/.env.local` and fill in Supabase keys.
2. `pnpm install`
3. Apply schema + seed to your Supabase project:

```bash
npx supabase db push
npx supabase db query -f supabase/seed.sql
```

Or paste `supabase/migrations/20260815120000_init.sql`, then `supabase/migrations/20260815140000_rbac.sql`, then `supabase/seed.sql` into the Supabase SQL editor (seed after schema).

4. Create the first Auth user in the Supabase dashboard (email/password). That account becomes **Superadmin**. Additional staff are created in-app at `/users`.
5. Set `SUPABASE_SERVICE_ROLE_KEY` in `apps/web/.env.local` (server-only) so user management works.
6. `pnpm dev` and open http://localhost:3000 — you will be sent to `/login`.

## Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm test
```

## Excel migration

The bundled workbook is analysed in `docs/excel-mapping.md`. Demo rows are in `supabase/seed.sql`. The in-app importer (`Settings → Import historical Excel data`) parses and validates a FarmNow `.xlsx` before you confirm.

## Deployment

- App: Vercel (root `apps/web`, include `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`; set `SUPABASE_SERVICE_ROLE_KEY` as a **server-only** env var — it must never be prefixed with `NEXT_PUBLIC_`).
- Database: Supabase project, run migrations, then seed if you want demo data.

## Troubleshooting

- **pnpm install times out on Next.js / SWC:** pnpm 11 reads network settings from `pnpm-workspace.yaml` (`fetchTimeout`), not `.npmrc`. This repo already sets a 10-minute fetch timeout.
- **Unauthorized on every page:** check env vars and that the Auth user exists and the profile is active.
- **Forbidden after login:** that module is not in your role’s permission set. See `docs/permissions.md`.
- **Cannot create users:** confirm `SUPABASE_SERVICE_ROLE_KEY` is set on the server.
- **Feed usage rejected:** stock is purchases minus usage; record purchases first.
- **Mortality/sales rejected:** flock must be Active; quantity cannot exceed remaining birds (initial − mortality − sales).
- **KPI mismatch vs Excel:** see `docs/business-rules.md` for documented Excel discrepancies (current birds ignore sales; profit ignores other income).
