-- FarmNow ERP initial schema
-- Source: FarmNow_ERP_System.xlsx + VBA modules. See docs/database.md.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.entry_counters (
  prefix text primary key,
  last_value integer not null default 0
);

insert into public.entry_counters (prefix, last_value) values
  ('FLK', 0), ('MORT', 0), ('FEED', 0), ('FPO', 0), ('WGT', 0),
  ('HLTH', 0), ('SALE', 0), ('EXP', 0), ('ENV', 0), ('INC', 0),
  ('RTN', 0), ('MED', 0)
on conflict (prefix) do nothing;

create or replace function public.next_entry_code(p_prefix text)
returns text
language plpgsql
as $$
declare
  n integer;
begin
  insert into public.entry_counters (prefix, last_value)
  values (p_prefix, 1)
  on conflict (prefix)
  do update set last_value = public.entry_counters.last_value + 1
  returning last_value into n;
  return p_prefix || '-' || lpad(n::text, 4, '0');
end;
$$;

-- ---------------------------------------------------------------------------
-- Auth profile
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default 'Administrator',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Settings + lookups
-- ---------------------------------------------------------------------------

create table public.settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

create table public.lookup_options (
  id uuid primary key default gen_random_uuid(),
  list_name text not null,
  value text not null,
  sort_order integer not null default 0,
  unique (list_name, value)
);

-- ---------------------------------------------------------------------------
-- Master data
-- ---------------------------------------------------------------------------

create table public.houses (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  capacity integer not null check (capacity > 0),
  location_zone text not null,
  status text not null check (status in ('Active', 'Inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.breeds (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  standard_fcr numeric(8, 3) not null check (standard_fcr > 0),
  standard_adg_g numeric(8, 2) not null check (standard_adg_g > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.feed_types (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  stage text not null,
  unit_cost_per_kg numeric(14, 2) not null check (unit_cost_per_kg >= 0),
  standard_bag_weight_kg numeric(12, 3) not null check (standard_bag_weight_kg > 0),
  min_stock_kg numeric(12, 3) not null check (min_stock_kg >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.suppliers (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  contact text,
  email text,
  category text not null,
  lead_time_days integer not null default 0 check (lead_time_days >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  contact text,
  address text,
  price_tier text not null,
  payment_terms text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  type text not null,
  dosage_unit text not null,
  withdrawal_days integer not null default 0 check (withdrawal_days >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.employees (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  position text not null,
  contact_number text,
  nrc text,
  date_hired date,
  salary_zmw numeric(14, 2) check (salary_zmw is null or salary_zmw >= 0),
  status text not null check (status in ('Active', 'Inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Flocks
-- ---------------------------------------------------------------------------

create table public.flocks (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  house_id uuid not null references public.houses (id),
  breed_id uuid not null references public.breeds (id),
  supplier_id uuid not null references public.suppliers (id),
  placed_date date not null,
  initial_bird_count integer not null check (initial_bird_count between 1 and 1000000),
  expected_dispatch_date date not null,
  status text not null default 'Active' check (status in ('Active', 'Closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users (id),
  check (expected_dispatch_date >= placed_date)
);

create index flocks_status_idx on public.flocks (status);
create index flocks_house_idx on public.flocks (house_id);

-- ---------------------------------------------------------------------------
-- Transactions
-- ---------------------------------------------------------------------------

create table public.mortality_entries (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  flock_id uuid not null references public.flocks (id),
  entry_date date not null,
  mortality_count integer not null check (mortality_count >= 0),
  cause text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users (id),
  unique (flock_id, entry_date)
);

create index mortality_flock_date_idx on public.mortality_entries (flock_id, entry_date);

create table public.feed_consumption (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  flock_id uuid not null references public.flocks (id),
  feed_type_id uuid not null references public.feed_types (id),
  entry_date date not null,
  kg_used numeric(12, 3) not null check (kg_used >= 0.1 and kg_used <= 100000),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users (id)
);

create index feed_consumption_flock_idx on public.feed_consumption (flock_id, entry_date);
create index feed_consumption_type_idx on public.feed_consumption (feed_type_id);

create table public.feed_purchases (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  purchase_date date not null,
  supplier_id uuid not null references public.suppliers (id),
  feed_type_id uuid not null references public.feed_types (id),
  number_of_bags integer not null check (number_of_bags between 1 and 100000),
  bag_weight_kg numeric(12, 3) not null check (bag_weight_kg > 0),
  unit_cost_per_bag numeric(14, 2) not null check (unit_cost_per_bag >= 0),
  invoice_no text not null,
  payment_method text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users (id)
);

create index feed_purchases_type_idx on public.feed_purchases (feed_type_id);

create table public.weekly_weights (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  flock_id uuid not null references public.flocks (id),
  entry_date date not null,
  week_no integer not null check (week_no between 1 and 20),
  sample_size integer not null check (sample_size >= 1),
  avg_body_weight_g numeric(10, 2) not null check (avg_body_weight_g between 10 and 6000),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users (id)
);

create table public.health_entries (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  flock_id uuid not null references public.flocks (id),
  product_id uuid not null references public.products (id),
  entry_date date not null,
  dosage_given text not null,
  route text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users (id)
);

create table public.medicine_lots (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  flock_id uuid not null references public.flocks (id),
  product_id uuid not null references public.products (id),
  supplier_id uuid not null references public.suppliers (id),
  lot_number text not null,
  expiry_date date not null,
  quantity_received integer not null check (quantity_received >= 0),
  quantity_used integer not null check (quantity_used >= 0),
  unit_cost numeric(14, 2) not null check (unit_cost >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users (id),
  check (quantity_used <= quantity_received)
);

create table public.sales (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  flock_id uuid not null references public.flocks (id),
  customer_id uuid not null references public.customers (id),
  entry_date date not null,
  birds_dispatched integer not null check (birds_dispatched >= 1),
  live_weight_kg numeric(12, 3) not null check (live_weight_kg > 0),
  price_per_kg numeric(14, 2) not null check (price_per_kg >= 0),
  price_per_bird numeric(14, 2) not null default 0 check (price_per_bird >= 0),
  transport_cost numeric(14, 2) not null default 0 check (transport_cost >= 0),
  amount_paid numeric(14, 2) not null default 0 check (amount_paid >= 0),
  invoice_no text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users (id)
);

create index sales_flock_idx on public.sales (flock_id);

create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  flock_id uuid references public.flocks (id),
  supplier_id uuid references public.suppliers (id),
  entry_date date not null,
  category text not null,
  quantity numeric(12, 3) not null check (quantity > 0),
  unit_cost numeric(14, 2) not null check (unit_cost >= 0),
  payment_method text not null,
  payment_ref text not null default '',
  approved_by text not null default '',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users (id)
);

create index expenses_flock_idx on public.expenses (flock_id);

create table public.other_income (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  entry_date date not null,
  source text not null,
  description text not null,
  amount numeric(14, 2) not null check (amount >= 0.01 and amount <= 10000000),
  payment_method text not null,
  received_by text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users (id)
);

create table public.environment_readings (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  house_id uuid not null references public.houses (id),
  entry_date date not null,
  reading_time time not null,
  temperature_c numeric(6, 2) not null,
  humidity_pct numeric(6, 2) not null check (humidity_pct between 0 and 100),
  ammonia_ppm numeric(8, 2) not null check (ammonia_ppm >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users (id)
);

create table public.daily_routines (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  flock_id uuid not null references public.flocks (id),
  employee_id uuid references public.employees (id),
  entry_date date not null,
  temperature_c numeric(6, 2) not null,
  humidity_pct numeric(6, 2) not null check (humidity_pct between 0 and 100),
  water_available text not null check (water_available in ('Yes', 'No')),
  feed_available text not null check (feed_available in ('Yes', 'No')),
  drinkers_cleaned text not null check (drinkers_cleaned in ('Yes', 'No')),
  litter_condition text not null,
  ventilation text not null,
  sick_birds_observed integer not null default 0 check (sick_birds_observed >= 0),
  notes text not null default '',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users (id)
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id),
  action text not null,
  entity_type text not null,
  entity_id text,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz not null default now()
);

create index audit_logs_created_idx on public.audit_logs (created_at desc);
create index audit_logs_entity_idx on public.audit_logs (entity_type, entity_id);

-- updated_at triggers
do $$
declare
  t text;
begin
  foreach t in array array[
    'houses','breeds','feed_types','suppliers','customers','products','employees',
    'flocks','mortality_entries','feed_consumption','feed_purchases','weekly_weights',
    'health_entries','medicine_lots','sales','expenses','other_income',
    'environment_readings','daily_routines','settings'
  ]
  loop
    execute format(
      'create trigger %I_updated_at before update on public.%I for each row execute function public.set_updated_at()',
      t, t
    );
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- Views (Excel calc sheets)
-- ---------------------------------------------------------------------------

create or replace view public.v_feed_stock as
select
  ft.id as feed_type_id,
  ft.name as feed_name,
  0::numeric(12, 3) as opening_kg,
  coalesce(p.purchased_kg, 0)::numeric(12, 3) as purchased_kg,
  coalesce(c.used_kg, 0)::numeric(12, 3) as used_kg,
  (0 + coalesce(p.purchased_kg, 0) - coalesce(c.used_kg, 0))::numeric(12, 3) as balance_kg,
  ft.min_stock_kg,
  case
    when (0 + coalesce(p.purchased_kg, 0) - coalesce(c.used_kg, 0)) < ft.min_stock_kg then 'LOW STOCK'
    else 'OK'
  end as alert
from public.feed_types ft
left join (
  select feed_type_id, sum(number_of_bags * bag_weight_kg) as purchased_kg
  from public.feed_purchases
  where is_active
  group by feed_type_id
) p on p.feed_type_id = ft.id
left join (
  select feed_type_id, sum(kg_used) as used_kg
  from public.feed_consumption
  where is_active
  group by feed_type_id
) c on c.feed_type_id = ft.id;

create or replace view public.v_flock_kpis as
select
  f.id as flock_id,
  f.code as flock_code,
  h.code as house_code,
  b.name as breed_name,
  b.standard_fcr,
  b.standard_adg_g,
  f.placed_date,
  f.status,
  (current_date - f.placed_date) as days_on_farm,
  f.initial_bird_count as initial_birds,
  coalesce(m.total_mortality, 0) as total_mortality,
  (f.initial_bird_count - coalesce(m.total_mortality, 0)) as current_birds,
  (f.initial_bird_count - coalesce(m.total_mortality, 0) - coalesce(s.birds_sold, 0)) as remaining_birds,
  case when f.initial_bird_count = 0 then 0
       else (f.initial_bird_count - coalesce(m.total_mortality, 0))::numeric / f.initial_bird_count
  end as livability_pct,
  coalesce(fc.total_feed_kg, 0) as total_feed_kg,
  coalesce(fc.total_feed_cost, 0) as total_feed_cost,
  w.latest_weight_date,
  coalesce(w.latest_avg_weight_g, 0) as latest_avg_weight_g,
  case
    when (f.initial_bird_count - coalesce(m.total_mortality, 0)) = 0 or coalesce(w.latest_avg_weight_g, 0) = 0 then 0
    else coalesce(fc.total_feed_kg, 0) / (((f.initial_bird_count - coalesce(m.total_mortality, 0)) * coalesce(w.latest_avg_weight_g, 0)) / 1000.0)
  end as fcr,
  case
    when (current_date - f.placed_date) = 0 then 0
    else coalesce(w.latest_avg_weight_g, 0) / (current_date - f.placed_date)
  end as adg_g,
  coalesce(e.total_expenses, 0) as total_expenses,
  coalesce(med.medicine_cost, 0) as medicine_cost,
  coalesce(s.total_sales_value, 0) as total_sales_value,
  coalesce(s.birds_sold, 0) as birds_sold,
  case when f.initial_bird_count = 0 then 0
       else (coalesce(e.total_expenses, 0) + coalesce(fc.total_feed_cost, 0) + coalesce(med.medicine_cost, 0)) / f.initial_bird_count
  end as cost_per_bird,
  case
    when (f.initial_bird_count - coalesce(m.total_mortality, 0)) = 0 or coalesce(w.latest_avg_weight_g, 0) = 0 then 0
    else (coalesce(e.total_expenses, 0) + coalesce(fc.total_feed_cost, 0) + coalesce(med.medicine_cost, 0))
         / (((f.initial_bird_count - coalesce(m.total_mortality, 0)) * coalesce(w.latest_avg_weight_g, 0)) / 1000.0)
  end as cost_per_kg,
  (coalesce(s.total_sales_value, 0) - coalesce(e.total_expenses, 0) - coalesce(fc.total_feed_cost, 0) - coalesce(med.medicine_cost, 0)) as estimated_profit,
  case
    when coalesce(s.birds_sold, 0) > 0 then
      (coalesce(e.total_expenses, 0) + coalesce(fc.total_feed_cost, 0) + coalesce(med.medicine_cost, 0)) / s.birds_sold
    when f.initial_bird_count = 0 then 0
    else (coalesce(e.total_expenses, 0) + coalesce(fc.total_feed_cost, 0) + coalesce(med.medicine_cost, 0)) / f.initial_bird_count
  end as breakeven_price_per_bird
from public.flocks f
join public.houses h on h.id = f.house_id
join public.breeds b on b.id = f.breed_id
left join (
  select flock_id, sum(mortality_count) as total_mortality
  from public.mortality_entries
  where is_active
  group by flock_id
) m on m.flock_id = f.id
left join (
  select
    c.flock_id,
    sum(c.kg_used) as total_feed_kg,
    sum(round(c.kg_used * ft.unit_cost_per_kg, 2)) as total_feed_cost
  from public.feed_consumption c
  join public.feed_types ft on ft.id = c.feed_type_id
  where c.is_active
  group by c.flock_id
) fc on fc.flock_id = f.id
left join (
  select distinct on (flock_id)
    flock_id,
    entry_date as latest_weight_date,
    avg_body_weight_g as latest_avg_weight_g
  from public.weekly_weights
  where is_active
  order by flock_id, entry_date desc
) w on w.flock_id = f.id
left join (
  select flock_id, sum(round(quantity * unit_cost, 2)) as total_expenses
  from public.expenses
  where is_active
  group by flock_id
) e on e.flock_id = f.id
left join (
  select flock_id, sum(round(quantity_received * unit_cost, 2)) as medicine_cost
  from public.medicine_lots
  where is_active
  group by flock_id
) med on med.flock_id = f.id
left join (
  select
    flock_id,
    sum(birds_dispatched) as birds_sold,
    sum(
      round(
        (case when price_per_bird > 0 then birds_dispatched * price_per_bird else live_weight_kg * price_per_kg end)
        + transport_cost
      , 2)
    ) as total_sales_value
  from public.sales
  where is_active
  group by flock_id
) s on s.flock_id = f.id;

create or replace view public.v_medicine_lots as
select
  ml.*,
  (ml.quantity_received - ml.quantity_used) as balance,
  round(ml.quantity_received * ml.unit_cost, 2) as total_cost,
  case
    when current_date > ml.expiry_date then 'EXPIRED'
    when ml.expiry_date - current_date <= coalesce(
      (select value::integer from public.settings where key = 'MedicineExpiryWarningDays'),
      30
    ) then 'EXPIRING SOON'
    else 'OK'
  end as expiry_status
from public.medicine_lots ml;

-- ---------------------------------------------------------------------------
-- Integrity triggers
-- ---------------------------------------------------------------------------

create or replace function public.assert_not_future(p_date date)
returns void
language plpgsql
as $$
begin
  if p_date > current_date then
    raise exception 'Date cannot be in the future.';
  end if;
end;
$$;

create or replace function public.flock_remaining(p_flock_id uuid, p_exclude_mortality uuid default null, p_exclude_sale uuid default null)
returns integer
language sql
stable
as $$
  select
    f.initial_bird_count
    - coalesce((
        select sum(mortality_count) from public.mortality_entries
        where flock_id = p_flock_id and is_active and (p_exclude_mortality is null or id <> p_exclude_mortality)
      ), 0)
    - coalesce((
        select sum(birds_dispatched) from public.sales
        where flock_id = p_flock_id and is_active and (p_exclude_sale is null or id <> p_exclude_sale)
      ), 0)
  from public.flocks f
  where f.id = p_flock_id;
$$;

create or replace function public.enforce_mortality()
returns trigger
language plpgsql
as $$
declare
  flock_status text;
  remaining integer;
begin
  perform public.assert_not_future(new.entry_date);
  select status into flock_status from public.flocks where id = new.flock_id;
  if flock_status is null then
    raise exception 'Flock not found.';
  end if;
  if flock_status <> 'Active' then
    raise exception 'That flock is not Active.';
  end if;
  remaining := public.flock_remaining(new.flock_id, new.id, null);
  if new.is_active and new.mortality_count > remaining then
    raise exception 'Mortality count exceeds the number of birds remaining in this flock.';
  end if;
  return new;
end;
$$;

create trigger mortality_enforce
  before insert or update on public.mortality_entries
  for each row execute function public.enforce_mortality();

create or replace function public.enforce_sale()
returns trigger
language plpgsql
as $$
declare
  flock_status text;
  remaining integer;
begin
  perform public.assert_not_future(new.entry_date);
  select status into flock_status from public.flocks where id = new.flock_id;
  if flock_status <> 'Active' then
    raise exception 'That flock is not Active.';
  end if;
  remaining := public.flock_remaining(new.flock_id, null, new.id);
  if new.is_active and new.birds_dispatched > remaining then
    raise exception 'Birds dispatched exceed the number of birds remaining in this flock.';
  end if;
  return new;
end;
$$;

create trigger sales_enforce
  before insert or update on public.sales
  for each row execute function public.enforce_sale();

create or replace function public.enforce_feed_consumption()
returns trigger
language plpgsql
as $$
declare
  flock_status text;
  balance numeric;
begin
  perform public.assert_not_future(new.entry_date);
  select status into flock_status from public.flocks where id = new.flock_id;
  if flock_status <> 'Active' then
    raise exception 'That flock is not Active.';
  end if;
  select
    coalesce(sum(fp.number_of_bags * fp.bag_weight_kg), 0)
    - coalesce((
        select sum(kg_used) from public.feed_consumption
        where feed_type_id = new.feed_type_id and is_active and (tg_op = 'INSERT' or id <> new.id)
      ), 0)
  into balance
  from public.feed_purchases fp
  where fp.feed_type_id = new.feed_type_id and fp.is_active;
  if new.is_active and new.kg_used > coalesce(balance, 0) then
    raise exception 'Feed usage exceeds available stock for this feed type.';
  end if;
  return new;
end;
$$;

create trigger feed_consumption_enforce
  before insert or update on public.feed_consumption
  for each row execute function public.enforce_feed_consumption();

create or replace function public.enforce_active_flock()
returns trigger
language plpgsql
as $$
declare
  flock_status text;
begin
  if tg_table_name in ('weekly_weights', 'health_entries', 'medicine_lots', 'daily_routines', 'feed_consumption') then
    perform public.assert_not_future(new.entry_date);
  end if;
  if to_jsonb(new) ? 'flock_id' then
    select status into flock_status from public.flocks where id = new.flock_id;
    if flock_status is distinct from 'Active' then
      raise exception 'That flock is not Active.';
    end if;
  end if;
  return new;
end;
$$;

-- weekly_weights / health / medicine / daily_routine: active flock + not-future
create or replace function public.enforce_flock_txn()
returns trigger
language plpgsql
as $$
declare
  flock_status text;
  d date;
begin
  d := case
    when tg_table_name = 'medicine_lots' then current_date
    else new.entry_date
  end;
  if tg_table_name <> 'medicine_lots' then
    perform public.assert_not_future(new.entry_date);
  end if;
  select status into flock_status from public.flocks where id = new.flock_id;
  if flock_status is distinct from 'Active' then
    raise exception 'That flock is not Active.';
  end if;
  return new;
end;
$$;

create trigger weekly_weights_enforce
  before insert or update on public.weekly_weights
  for each row execute function public.enforce_flock_txn();
create trigger health_entries_enforce
  before insert or update on public.health_entries
  for each row execute function public.enforce_flock_txn();
create trigger medicine_lots_enforce
  before insert or update on public.medicine_lots
  for each row execute function public.enforce_flock_txn();
create trigger daily_routines_enforce
  before insert or update on public.daily_routines
  for each row execute function public.enforce_flock_txn();

create or replace function public.enforce_medicine_lot()
returns trigger
language plpgsql
as $$
declare
  flock_status text;
begin
  select status into flock_status from public.flocks where id = new.flock_id;
  if flock_status is distinct from 'Active' then
    raise exception 'That flock is not Active.';
  end if;
  return new;
end;
$$;

drop trigger if exists medicine_lots_enforce on public.medicine_lots;
create trigger medicine_lots_enforce
  before insert or update on public.medicine_lots
  for each row execute function public.enforce_medicine_lot();

alter view public.v_flock_kpis set (security_invoker = true);
alter view public.v_feed_stock set (security_invoker = true);
alter view public.v_medicine_lots set (security_invoker = true);

grant usage on schema public to authenticated;
grant execute on function public.next_entry_code(text) to authenticated;
grant execute on function public.flock_remaining(uuid, uuid, uuid) to authenticated;

create or replace function public.enforce_flock_house()
returns trigger
language plpgsql
as $$
declare
  house_status text;
begin
  select status into house_status from public.houses where id = new.house_id;
  if house_status is distinct from 'Active' then
    raise exception 'House is not Active.';
  end if;
  perform public.assert_not_future(new.placed_date);
  return new;
end;
$$;

create trigger flocks_enforce
  before insert or update on public.flocks
  for each row execute function public.enforce_flock_house();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.settings enable row level security;
alter table public.lookup_options enable row level security;
alter table public.houses enable row level security;
alter table public.breeds enable row level security;
alter table public.feed_types enable row level security;
alter table public.suppliers enable row level security;
alter table public.customers enable row level security;
alter table public.products enable row level security;
alter table public.employees enable row level security;
alter table public.entry_counters enable row level security;
alter table public.flocks enable row level security;
alter table public.mortality_entries enable row level security;
alter table public.feed_consumption enable row level security;
alter table public.feed_purchases enable row level security;
alter table public.weekly_weights enable row level security;
alter table public.health_entries enable row level security;
alter table public.medicine_lots enable row level security;
alter table public.sales enable row level security;
alter table public.expenses enable row level security;
alter table public.other_income enable row level security;
alter table public.environment_readings enable row level security;
alter table public.daily_routines enable row level security;
alter table public.audit_logs enable row level security;

do $$
declare
  t text;
begin
  foreach t in array array[
    'profiles','settings','lookup_options','houses','breeds','feed_types','suppliers',
    'customers','products','employees','entry_counters','flocks','mortality_entries',
    'feed_consumption','feed_purchases','weekly_weights','health_entries','medicine_lots',
    'sales','expenses','other_income','environment_readings','daily_routines','audit_logs'
  ]
  loop
    execute format('create policy %I_authenticated_all on public.%I for all to authenticated using (true) with check (true)', t, t);
  end loop;
end $$;
