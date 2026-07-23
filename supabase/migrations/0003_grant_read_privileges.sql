-- ClearComply: base table read privileges for the app's logged-in role.
--
-- Postgres access is two gates: a role needs the table-level SELECT
-- privilege (GRANT), AND row-level security then filters which rows it
-- sees. The 0001 policies handle the row filtering, but the `authenticated`
-- role also needs the base GRANT — without it, the app's reads fail with
-- "permission denied for table profiles" (SQLSTATE 42501) before RLS is
-- even evaluated.
--
-- This is needed because these tables were created via raw SQL in the SQL
-- editor, which does not inherit the auto-grants Supabase applies to tables
-- made through the Table Editor. RLS still applies on top of these grants,
-- so a logged-in user can still only read their own profile/org row.
--
-- Run after 0001 and 0002. Only the `authenticated` role is granted — anon
-- (logged-out) users never read these tables, and the signup trigger
-- (security definer) and seed script (service_role) bypass grants entirely.

grant select on public.profiles to authenticated;
grant select on public.organizations to authenticated;
