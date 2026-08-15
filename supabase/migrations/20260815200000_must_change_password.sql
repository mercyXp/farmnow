-- Force a private password after Superadmin issues a temporary one.
-- Existing staff keep must_change_password = false so they are not locked out.

alter table public.profiles
  add column if not exists must_change_password boolean not null default false;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  assigned public.app_role;
begin
  if exists (select 1 from public.profiles where role = 'superadmin') then
    assigned := 'entry_clerk';
  else
    assigned := 'superadmin';
  end if;

  insert into public.profiles (id, display_name, full_name, role, is_active, must_change_password)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    assigned,
    true,
    true
  )
  on conflict (id) do update
    set full_name = excluded.full_name,
        display_name = excluded.display_name;
  return new;
end;
$$;

create or replace function public.clear_must_change_password()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Unauthorized';
  end if;
  update public.profiles
  set must_change_password = false
  where id = auth.uid()
    and is_active;
end;
$$;

revoke all on function public.clear_must_change_password() from public;
grant execute on function public.clear_must_change_password() to authenticated;
