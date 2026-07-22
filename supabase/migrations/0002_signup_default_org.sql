-- ClearComply: self-serve signup support.
--
-- Adds a single designated "default" organization that every self-registered
-- user automatically joins, plus a trigger that creates their profiles row
-- at signup time. This does NOT loosen the RLS posture from 0001 — anon and
-- authenticated roles still have zero insert/update/delete policies on
-- organizations or profiles. The trigger function bypasses RLS by running
-- with its owning role's (table-owner) privileges under `security definer`,
-- the same mechanism Supabase's own docs use for this exact pattern — not by
-- adding a policy. This only holds as long as nobody adds
-- `force row level security` to either table; don't do that.
--
-- Run this once, after 0001_organizations_profiles.sql, in the Supabase SQL
-- editor (or `supabase db push`).

-- At most one org may ever be the default. This is a hard DB-level
-- invariant, not a "whichever org was created first" convention — a
-- partial unique index makes a second default org a constraint violation,
-- not a silent ambiguity.
alter table organizations
  add column is_default boolean not null default false;

create unique index organizations_single_default_idx
  on organizations (is_default)
  where is_default;

-- Seed exactly one default org, idempotently (safe to re-run by hand).
insert into organizations (name, is_default)
select 'ClearComply Evaluators', true
where not exists (select 1 from organizations where is_default);

-- Auto-creates a profiles row (assigned to the default org) whenever a new
-- auth.users row is inserted — i.e. on every signUp(). first_name/last_name
-- come from the client's `options.data` passed to signUp(), landing in
-- raw_user_meta_data. role is left to profiles.role's existing
-- default ('Project Manager').
--
-- `after insert` (not `before`) is required: profiles.id references
-- auth.users(id), so the referenced row must already exist.
--
-- If the default org row is ever deleted, this raises and the whole signup
-- transaction rolls back (auth.users insert included) — fails loudly rather
-- than silently mis-assigning. Don't delete the default org row.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  default_org_id uuid;
begin
  select id into default_org_id from public.organizations where is_default limit 1;

  if default_org_id is null then
    raise exception 'No default organization configured; cannot complete signup.';
  end if;

  insert into public.profiles (id, org_id, full_name)
  values (
    new.id,
    default_org_id,
    trim(
      coalesce(new.raw_user_meta_data ->> 'first_name', '') || ' ' ||
      coalesce(new.raw_user_meta_data ->> 'last_name', '')
    )
  );

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
