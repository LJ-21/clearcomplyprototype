import { useEffect, useState } from 'react';
import { supabase, supabaseConfigError } from './lib/supabaseClient.js';
import { initPendo } from './lib/pendo.js';
import Login from './components/Login.jsx';
import App from './App.jsx';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// The subcontractor upload portal (#/upload/<subId>/<token>) is a PUBLIC
// route reached via a secure link — subcontractors never log in. It must
// render without auth (and even without Supabase configured, since it uses
// only the in-memory store). Everything else is the PM app, behind login.
const isUploadRoute = () => /^#\/upload\//.test(window.location.hash || '');

// Fetches the caller's profile+org row, retrying with backoff. In normal
// operation there's no race to protect against — the profiles row is
// created by a Postgres trigger inside the SAME transaction as the
// auth.users insert, so it's already committed by the time signUp()/
// getSession() resolve in the browser. This retry is cheap defense-in-depth
// against future changes to that flow, not a fix for an observed race.
async function fetchProfile(userId) {
  const delays = [0, 300, 600];
  let last;
  for (const delay of delays) {
    if (delay) await sleep(delay);
    last = await supabase
      .from('profiles')
      .select('full_name, role, organizations(name)')
      .eq('id', userId)
      .single();
    if (!last.error && last.data) return last;
  }
  return last;
}

function ErrorScreen({ message, action }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, background: '#F7F6F3', color: '#1C2B39', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 14, padding: 24, textAlign: 'center' }}>
      <div style={{ maxWidth: 460, whiteSpace: 'pre-wrap' }}>{message}</div>
      {action}
    </div>
  );
}

// Gates the whole product behind a real Supabase session. <App> (and the
// in-memory Store it instantiates via useStore()) is not mounted at all
// until a session AND its profile/org have resolved — so no change to
// Store's lifecycle is needed elsewhere; it's just created later than
// before, and naturally discarded on sign-out when <App> unmounts.
export default function AuthGate() {
  const [status, setStatus] = useState('loading'); // 'loading' | 'signedOut' | 'ready' | 'error'
  const [identity, setIdentity] = useState(null);
  const [error, setError] = useState('');
  const [uploadRoute, setUploadRoute] = useState(isUploadRoute());

  useEffect(() => {
    const onHashChange = () => setUploadRoute(isUploadRoute());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    if (supabaseConfigError) return; // nothing to do — render path below shows the config error
    let cancelled = false;

    async function loadIdentity(session) {
      const { data, error: profileError } = await fetchProfile(session.user.id);

      if (cancelled) return;

      if (profileError || !data) {
        setError('Signed in, but no organization profile was found for this account.');
        setStatus('error');
        return;
      }

      const resolved = {
        userId: session.user.id,
        email: session.user.email,
        name: data.full_name,
        role: data.role,
        orgName: data.organizations?.name || 'Unknown organization',
      };
      setIdentity(resolved);
      setStatus('ready');
      initPendo({
        visitor: { id: resolved.userId, email: resolved.email, full_name: resolved.name, role: resolved.role },
        account: { id: session.user.id, name: resolved.orgName },
      });
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return;
      if (session) loadIdentity(session);
      else setStatus('signedOut');
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return;
      if (session) {
        setStatus('loading');
        loadIdentity(session);
      } else {
        setIdentity(null);
        setStatus('signedOut');
      }
    });

    return () => {
      cancelled = true;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const onSignOut = async () => {
    await supabase.auth.signOut();
  };

  // Public subcontractor upload portal — no auth, no Supabase needed.
  if (uploadRoute) {
    return <App />;
  }

  if (supabaseConfigError) {
    return <ErrorScreen message={supabaseConfigError} />;
  }

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F7F6F3', color: '#5A6B7A', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 14 }}>
        Loading…
      </div>
    );
  }

  if (status === 'signedOut') {
    return <Login />;
  }

  if (status === 'error') {
    return (
      <ErrorScreen
        message={error}
        action={
          <button
            onClick={onSignOut}
            style={{ background: '#fff', color: '#1C2B39', border: '1px solid #E3E1DB', borderRadius: 3, padding: '9px 16px', fontWeight: 600, fontSize: '13.5px', cursor: 'pointer' }}
          >
            Sign out
          </button>
        }
      />
    );
  }

  return <App identity={identity} onSignOut={onSignOut} />;
}
