-- ClearComply: minimal auth/org identity schema.
--
-- Scope is deliberately small: this only backs login + "which org am I in."
-- Projects/subcontractors/documents/audit trail stay in-memory in the app
-- (app/src/store.js) — not modeled here. See the plan doc for why.
--
-- Run this once in the Supabase SQL editor (or `supabase db push`) after
-- creating the project, before running app/scripts/seed-demo-account.mjs.

create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

-- 1:1 with auth.users — profiles.id IS the Supabase auth user id.
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  org_id uuid not null references organizations(id) on delete restrict,
  full_name text not null,
  role text not null default 'Project Manager',
  created_at timestamptz not null default now()
);

create index profiles_org_id_idx on profiles(org_id);

alter table organizations enable row level security;
alter table profiles enable row level security;

-- A user may read only their own profile row.
create policy "profiles_select_own"
  on profiles for select
  using (id = auth.uid());

-- A user may read only the single org referenced by their own profile row.
-- This re-derives the allowed org id from the CALLER's row on every request
-- (via auth.uid()) — it is not "any authenticated user may read all orgs."
create policy "organizations_select_own"
  on organizations for select
  using (
    id in (select org_id from profiles where profiles.id = auth.uid())
  );

-- Deliberately no insert/update/delete policies for anon or authenticated
-- roles on either table. With RLS enabled and zero permissive policies for
-- those operations, writes are impossible from the client, full stop. The
-- only writer is the seed script's service_role key, which bypasses RLS by
-- Supabase's design and is never used from the browser.
