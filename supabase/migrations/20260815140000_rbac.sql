-- Multi-role profiles, permission helpers, and intentional RLS.
-- See docs/permissions.md and packages/domain/src/permissions.ts.

do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum (
      'superadmin',
      'admin',
      'manager',
      'supervisor',
      'accountant',
      'entry_clerk'
    );
  end if;
end $$;

alter table public.profiles
  add column if not exists full_name text,
  add column if not exists role public.app_role,
  add column if not exists is_active boolean;

update public.profiles
set
  full_name = coalesce(nullif(full_name, ''), display_name, 'Administrator'),
  role = coalesce(role, 'superadmin'::public.app_role),
  is_active = coalesce(is_active, true);

alter table public.profiles
  alter column full_name set default 'Administrator',
  alter column full_name set not null,
  alter column role set default 'entry_clerk'::public.app_role,
  alter column role set not null,
  alter column is_active set default true,
  alter column is_active set not null;

create index if not exists profiles_role_idx on public.profiles (role);
create index if not exists profiles_active_idx on public.profiles (is_active);

create or replace function public.app_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.profiles
  where id = auth.uid()
    and is_active
  limit 1
$$;

create or replace function public.is_app_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and is_active
  )
$$;

create or replace function public.role_in(variadic roles public.app_role[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.app_role() = any (roles)
$$;

grant execute on function public.app_role() to authenticated;
grant execute on function public.is_app_user() to authenticated;
grant execute on function public.role_in(public.app_role[]) to authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  assigned public.app_role;
begin
  -- Never trust client metadata for role. The first user becomes Superadmin;
  -- everyone else starts as Entry Clerk until an authorised admin assigns a role.
  if exists (select 1 from public.profiles where role = 'superadmin') then
    assigned := 'entry_clerk';
  else
    assigned := 'superadmin';
  end if;

  insert into public.profiles (id, display_name, full_name, role, is_active)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    assigned,
    true
  )
  on conflict (id) do update
    set full_name = excluded.full_name,
        display_name = excluded.display_name;
  return new;
end;
$$;

create or replace function public.next_entry_code(p_prefix text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  n integer;
begin
  if not public.is_app_user() then
    raise exception 'Unauthorized';
  end if;
  insert into public.entry_counters (prefix, last_value)
  values (p_prefix, 1)
  on conflict (prefix)
  do update set last_value = public.entry_counters.last_value + 1
  returning last_value into n;
  return p_prefix || '-' || lpad(n::text, 4, '0');
end;
$$;

-- Replace blanket authenticated policies
do $$
declare
  pol record;
begin
  for pol in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and policyname like '%_authenticated_all'
  loop
    execute format('drop policy if exists %I on public.%I', pol.policyname, pol.tablename);
  end loop;
end $$;

-- Profiles: own row, or admin/superadmin directory
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.role_in('superadmin', 'admin'));

-- Profile role/status changes go through the service-role admin client only.

-- Settings: readable by signed-in staff; writable by Superadmin
drop policy if exists settings_select on public.settings;
create policy settings_select on public.settings
  for select to authenticated
  using (public.is_app_user());

drop policy if exists settings_write on public.settings;
create policy settings_write on public.settings
  for all to authenticated
  using (public.role_in('superadmin'))
  with check (public.role_in('superadmin'));

-- Lookups + masters: everyone can read (forms); Superadmin/Admin write
drop policy if exists lookup_select on public.lookup_options;
create policy lookup_select on public.lookup_options
  for select to authenticated
  using (public.is_app_user());

drop policy if exists lookup_write on public.lookup_options;
create policy lookup_write on public.lookup_options
  for all to authenticated
  using (public.role_in('superadmin', 'admin'))
  with check (public.role_in('superadmin', 'admin'));

do $$
declare
  t text;
begin
  foreach t in array array['houses','breeds','feed_types','suppliers','customers','products','employees']
  loop
    execute format('drop policy if exists %I_select on public.%I', t, t);
    execute format(
      'create policy %I_select on public.%I for select to authenticated using (public.is_app_user())',
      t, t
    );
    execute format('drop policy if exists %I_write on public.%I', t, t);
    execute format(
      'create policy %I_write on public.%I for all to authenticated using (public.role_in(''superadmin'', ''admin'')) with check (public.role_in(''superadmin'', ''admin''))',
      t, t
    );
  end loop;
end $$;

-- Flocks: all staff can read; Superadmin/Admin write
drop policy if exists flocks_select on public.flocks;
create policy flocks_select on public.flocks
  for select to authenticated
  using (public.is_app_user());

drop policy if exists flocks_write on public.flocks;
create policy flocks_write on public.flocks
  for all to authenticated
  using (public.role_in('superadmin', 'admin'))
  with check (public.role_in('superadmin', 'admin'));

-- Operational registers (not accountant)
do $$
declare
  t text;
begin
  foreach t in array array[
    'mortality_entries','feed_consumption','weekly_weights','health_entries',
    'medicine_lots','daily_routines','environment_readings'
  ]
  loop
    execute format('drop policy if exists %I_select on public.%I', t, t);
    execute format(
      'create policy %I_select on public.%I for select to authenticated using (public.role_in(''superadmin'', ''admin'', ''manager'', ''supervisor'', ''entry_clerk''))',
      t, t
    );
    execute format('drop policy if exists %I_insert on public.%I', t, t);
    execute format(
      'create policy %I_insert on public.%I for insert to authenticated with check (public.role_in(''superadmin'', ''admin'', ''supervisor'', ''entry_clerk''))',
      t, t
    );
    execute format('drop policy if exists %I_update on public.%I', t, t);
    execute format(
      'create policy %I_update on public.%I for update to authenticated using (public.role_in(''superadmin'', ''admin'')) with check (public.role_in(''superadmin'', ''admin''))',
      t, t
    );
  end loop;
end $$;

-- Financial registers
drop policy if exists feed_purchases_select on public.feed_purchases;
create policy feed_purchases_select on public.feed_purchases
  for select to authenticated
  using (public.role_in('superadmin', 'admin', 'manager', 'supervisor', 'accountant', 'entry_clerk'));

drop policy if exists feed_purchases_insert on public.feed_purchases;
create policy feed_purchases_insert on public.feed_purchases
  for insert to authenticated
  with check (public.role_in('superadmin', 'admin', 'accountant', 'entry_clerk'));

drop policy if exists feed_purchases_update on public.feed_purchases;
create policy feed_purchases_update on public.feed_purchases
  for update to authenticated
  using (public.role_in('superadmin', 'admin'))
  with check (public.role_in('superadmin', 'admin'));

drop policy if exists sales_select on public.sales;
create policy sales_select on public.sales
  for select to authenticated
  using (public.role_in('superadmin', 'admin', 'manager', 'accountant', 'entry_clerk'));

drop policy if exists sales_insert on public.sales;
create policy sales_insert on public.sales
  for insert to authenticated
  with check (public.role_in('superadmin', 'admin', 'accountant', 'entry_clerk'));

drop policy if exists sales_update on public.sales;
create policy sales_update on public.sales
  for update to authenticated
  using (public.role_in('superadmin', 'admin'))
  with check (public.role_in('superadmin', 'admin'));

drop policy if exists expenses_select on public.expenses;
create policy expenses_select on public.expenses
  for select to authenticated
  using (public.role_in('superadmin', 'admin', 'manager', 'accountant', 'entry_clerk'));

drop policy if exists expenses_insert on public.expenses;
create policy expenses_insert on public.expenses
  for insert to authenticated
  with check (public.role_in('superadmin', 'admin', 'accountant', 'entry_clerk'));

drop policy if exists expenses_update on public.expenses;
create policy expenses_update on public.expenses
  for update to authenticated
  using (public.role_in('superadmin', 'admin'))
  with check (public.role_in('superadmin', 'admin'));

drop policy if exists other_income_select on public.other_income;
create policy other_income_select on public.other_income
  for select to authenticated
  using (public.role_in('superadmin', 'admin', 'manager', 'accountant'));

drop policy if exists other_income_insert on public.other_income;
create policy other_income_insert on public.other_income
  for insert to authenticated
  with check (public.role_in('superadmin', 'admin', 'accountant'));

drop policy if exists other_income_update on public.other_income;
create policy other_income_update on public.other_income
  for update to authenticated
  using (public.role_in('superadmin', 'admin'))
  with check (public.role_in('superadmin', 'admin'));

drop policy if exists audit_select on public.audit_logs;
create policy audit_select on public.audit_logs
  for select to authenticated
  using (public.role_in('superadmin', 'admin'));

drop policy if exists audit_insert on public.audit_logs;
create policy audit_insert on public.audit_logs
  for insert to authenticated
  with check (public.is_app_user());

drop policy if exists entry_counters_select on public.entry_counters;
create policy entry_counters_select on public.entry_counters
  for select to authenticated
  using (public.is_app_user());
