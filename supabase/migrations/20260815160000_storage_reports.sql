-- Transaction edit/delete stays Superadmin/Admin (existing UPDATE policies).
-- Generated report catalog + private Storage buckets for PDFs and Excel imports.

create table if not exists public.generated_reports (
  id uuid primary key default gen_random_uuid(),
  report_type text not null check (report_type in ('flock', 'mortality', 'financial')),
  flock_id uuid references public.flocks (id) on delete set null,
  storage_path text not null unique,
  file_name text not null,
  generated_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists generated_reports_created_idx on public.generated_reports (created_at desc);

alter table public.generated_reports enable row level security;

drop policy if exists generated_reports_select on public.generated_reports;
create policy generated_reports_select on public.generated_reports
  for select to authenticated
  using (
    public.role_in('superadmin', 'admin', 'manager')
    or (report_type in ('flock', 'mortality') and public.role_in('supervisor'))
    or (report_type = 'financial' and public.role_in('accountant'))
  );

drop policy if exists generated_reports_insert on public.generated_reports;
create policy generated_reports_insert on public.generated_reports
  for insert to authenticated
  with check (
    public.role_in('superadmin', 'admin', 'manager')
    or (report_type in ('flock', 'mortality') and public.role_in('supervisor'))
    or (report_type = 'financial' and public.role_in('accountant'))
  );

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('reports', 'reports', false, 10485760, array['application/pdf']::text[]),
  ('imports', 'imports', false, 20971520, array[
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel.sheet.macroEnabled.12',
    'application/octet-stream'
  ]::text[])
on conflict (id) do nothing;

drop policy if exists reports_storage_select on storage.objects;
create policy reports_storage_select on storage.objects
  for select to authenticated
  using (
    bucket_id = 'reports'
    and public.role_in('superadmin', 'admin', 'manager', 'supervisor', 'accountant')
  );

drop policy if exists reports_storage_insert on storage.objects;
create policy reports_storage_insert on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'reports'
    and public.role_in('superadmin', 'admin', 'manager', 'supervisor', 'accountant')
  );

drop policy if exists imports_storage_select on storage.objects;
create policy imports_storage_select on storage.objects
  for select to authenticated
  using (bucket_id = 'imports' and public.role_in('superadmin', 'admin'));

drop policy if exists imports_storage_insert on storage.objects;
create policy imports_storage_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'imports' and public.role_in('superadmin', 'admin'));
