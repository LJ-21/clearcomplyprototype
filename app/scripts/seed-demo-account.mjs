// One-time (or re-runnable) seed script: creates a fallback Supabase Auth
// user + linking profile row in the single migration-seeded default
// organization, so an evaluator can log in with real, hand-delivered
// credentials without going through self-serve signup. Self-serve signup
// (see supabase/migrations/0002_signup_default_org.sql) joins the same
// default org automatically via a database trigger — this script does NOT
// create or choose an org itself, so the two paths can never disagree
// about which org is "the" org.
//
// SECURITY: this script needs your Supabase SERVICE ROLE key, which
// bypasses Row Level Security entirely. That key must NEVER be prefixed
// with VITE_ (Vite would inline it into the shipped browser bundle) and
// must NEVER be committed anywhere. Supply it only as a shell env var at
// run time — see the example invocation below.
//
// This file is never imported by anything under app/src/, so it is not
// part of the Vite build and never ships to the browser.
//
// Usage (run 0001 and 0002 migrations first, so a default org exists):
//   SUPABASE_URL=https://xxxx.supabase.co \
//   SUPABASE_SERVICE_ROLE_KEY=eyJ... \
//   DEMO_USER_EMAIL=eval@example.com \
//   DEMO_USER_PASSWORD='choose-a-real-password' \
//   DEMO_USER_FULL_NAME="Dana Ruiz" \
//   DEMO_USER_ROLE="Project Manager" \
//   node scripts/seed-demo-account.mjs

import { createClient } from '@supabase/supabase-js';

const {
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  DEMO_USER_EMAIL,
  DEMO_USER_PASSWORD,
  DEMO_USER_FULL_NAME,
  DEMO_USER_ROLE,
} = process.env;

const required = {
  SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
  DEMO_USER_EMAIL, DEMO_USER_PASSWORD, DEMO_USER_FULL_NAME, DEMO_USER_ROLE,
};
const missing = Object.entries(required).filter(([, v]) => !v).map(([k]) => k);
if (missing.length) {
  console.error('Missing required env vars: ' + missing.join(', '));
  console.error('See the usage comment at the top of this script.');
  process.exit(1);
}

if (SUPABASE_SERVICE_ROLE_KEY.startsWith('VITE_') || 'VITE_SUPABASE_SERVICE_ROLE_KEY' in process.env) {
  console.error('Refusing to run: a VITE_-prefixed service role key was detected in the environment.');
  console.error('Vite inlines VITE_-prefixed vars into the shipped browser bundle — never name a secret that way.');
  process.exit(1);
}

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  // Look up the single migration-seeded default org — never create one here.
  const { data: defaultOrg, error: orgLookupErr } = await admin
    .from('organizations')
    .select('id, name')
    .eq('is_default', true)
    .maybeSingle();
  if (orgLookupErr) throw orgLookupErr;
  if (!defaultOrg) {
    console.error('No default organization found. Run supabase/migrations/0001_organizations_profiles.sql');
    console.error('and supabase/migrations/0002_signup_default_org.sql first.');
    process.exit(1);
  }
  const orgId = defaultOrg.id;
  console.log('Using default organization "' + defaultOrg.name + '" (' + orgId + ')');

  // Idempotent: reuse an existing auth user with this email, or create one.
  let userId;
  const { data: userList, error: listErr } = await admin.auth.admin.listUsers();
  if (listErr) throw listErr;
  const existingUser = userList.users.find((u) => u.email === DEMO_USER_EMAIL);

  if (existingUser) {
    userId = existingUser.id;
    console.log('Reusing existing auth user ' + DEMO_USER_EMAIL + ' (' + userId + ')');
  } else {
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email: DEMO_USER_EMAIL,
      password: DEMO_USER_PASSWORD,
      email_confirm: true, // credentials are hand-delivered out-of-band, not self-registered
    });
    if (createErr) throw createErr;
    userId = created.user.id;
    console.log('Created auth user ' + DEMO_USER_EMAIL + ' (' + userId + ')');
  }

  // If this createUser() call above just created the auth user, the
  // handle_new_user() trigger (0002 migration) already inserted a transient
  // profiles row for them (full_name '', joined to the same default org).
  // This upsert overwrites it with the real name/role by primary-key
  // conflict — expected, not a bug.
  const { error: profileErr } = await admin
    .from('profiles')
    .upsert({ id: userId, org_id: orgId, full_name: DEMO_USER_FULL_NAME, role: DEMO_USER_ROLE });
  if (profileErr) throw profileErr;

  console.log('Linked profile: ' + DEMO_USER_FULL_NAME + ' (' + DEMO_USER_ROLE + ') → ' + defaultOrg.name);
  console.log('');
  console.log('Done. Hand the evaluator this login (out-of-band, not via git/chat logs):');
  console.log('  email: ' + DEMO_USER_EMAIL);
  console.log('  password: [not printed — use the value you set DEMO_USER_PASSWORD to]');
}

main().catch((err) => {
  console.error('Seed failed:', err.message || err);
  process.exit(1);
});
