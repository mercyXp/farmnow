# Database design

PostgreSQL on Supabase. UUIDs for primary keys; Excel-style codes (`FLK-0001`) as unique business identifiers. Monetary columns are `numeric(14,2)`. Masses are `numeric(12,3)`. Counts are integers. No floating-point money.

Balances and KPIs are **views**, not stored totals.

## ER overview

```
houses, breeds, suppliers, customers, products, feed_types, employees, lookup_options, settings
        │
        ▼
     flocks ──────── mortality_entries
        │─────────── feed_consumption ──► feed_types
        │─────────── weekly_weights
        │─────────── health_entries ────► products
        │─────────── sales ─────────────► customers
        │─────────── expenses ──────────► suppliers (optional)
        │─────────── daily_routines ────► employees (optional)
        │─────────── medicine_lots ─────► products, suppliers
        │
feed_purchases ────► feed_types, suppliers
environment_readings ► houses
other_income
audit_logs, profiles, generated_reports
```

## Conventions

- `id uuid primary key default gen_random_uuid()`
- `code text unique` where Excel had EntryID / FlockID
- `created_at`, `updated_at` timestamptz
- `created_by uuid references auth.users` (nullable for seed)
- `is_active boolean not null default true`
- Soft-delete by `is_active = false`
- Excel `"Overhead"` expenses → `expenses.flock_id is null`
- Status strings match Excel: `Active`, `Closed`, `Inactive`
- `profiles.role` is `public.app_role` (`superadmin` | `admin` | `manager` | `supervisor` | `accountant` | `entry_clerk`)

## Views

### `v_flock_kpis`

Excel `calc_KPI_Engine`. See `docs/excel-mapping.md` for formulas.

Also exposes `remaining_birds = initial - mortality - sold` for operational validation. Excel `current_birds` remains `initial - mortality` for KPI parity.

### `v_feed_stock`

Excel `calc_FeedStockSummary`. Opening stock is 0.

## RLS

Enabled on all application tables. Policies are role-aware (see `supabase/migrations/20260815140000_rbac.sql`). Anon has no access. The service role bypasses RLS and is used only on the server for user administration. Views use `security_invoker` so underlying table policies apply.

Profile `role` and `is_active` are not updatable by the authenticated role; those changes go through the service-role admin client after permission checks.

## Sequences

`entry_counters(prefix, last_value)` generates the next Excel-style code (`MORT-0001`).

## Storage

Private buckets (see `supabase/migrations/20260815160000_storage_reports.sql`):

- `reports` — generated flock / mortality / financial PDFs, catalogued in `generated_reports`
- `imports` — uploaded Excel workbooks (Superadmin / Admin only)
