import { useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { PASSWORD_RULES, validatePassword } from '../lib/passwordPolicy.js';

const inputStyle = { border: '1px solid #E3E1DB', borderRadius: 3, padding: '10px 12px', fontSize: '13.5px', width: '100%', boxSizing: 'border-box' };
const labelTextStyle = { fontSize: 12, color: '#5A6B7A', fontWeight: 600 };

function Field({ label, pendoId, ...inputProps }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
      <span style={labelTextStyle}>{label}</span>
      <input data-pendo-id={pendoId} style={inputStyle} {...inputProps} />
    </label>
  );
}

function PasswordChecklist({ password }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, margin: '2px 0 14px' }}>
      {PASSWORD_RULES.map((rule) => {
        const ok = rule.test(password);
        return (
          <div key={rule.id} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '11.5px', color: ok ? '#1E7F4F' : '#8A93A0' }}>
            <span style={{ width: 14, textAlign: 'center', fontWeight: 700 }}>{ok ? '✓' : '·'}</span>
            {rule.label}
          </div>
        );
      })}
    </div>
  );
}

export default function Login() {
  const [mode, setMode] = useState('signIn'); // 'signIn' | 'signUp'
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const switchMode = (next) => {
    setMode(next);
    setError('');
    setPassword('');
    setConfirmPassword('');
  };

  const onSignIn = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }
    setLoading(true);
    setError('');
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (signInError) {
      setError('Could not sign in — check your email and password and try again.');
    }
    // On success, the auth state change is picked up by AuthGate's
    // onAuthStateChange listener; nothing else to do here.
  };

  const passwordErrors = validatePassword(password);
  const signUpValid = firstName.trim() && lastName.trim() && email.trim()
    && passwordErrors.length === 0 && password === confirmPassword;

  const onSignUp = async (e) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setError('Enter your first name, last name, and email.');
      return;
    }
    if (passwordErrors.length > 0) {
      setError('Your password doesn’t meet the requirements below yet.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords don’t match.');
      return;
    }
    setLoading(true);
    setError('');
    const { error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { first_name: firstName.trim(), last_name: lastName.trim() } },
    });
    setLoading(false);
    if (signUpError) {
      setError(signUpError.message || 'Could not create your account — please try again.');
    }
    // On success, a session is returned immediately (no email confirmation
    // required) and AuthGate's onAuthStateChange listener picks it up.
  };

  const isSignIn = mode === 'signIn';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F7F6F3', fontFamily: 'Inter,system-ui,sans-serif', padding: 24 }}>
      <form onSubmit={isSignIn ? onSignIn : onSignUp} style={{ width: '100%', maxWidth: 380, background: '#fff', border: '1px solid #E3E1DB', borderRadius: 8, boxShadow: '0 20px 60px rgb(28 43 57 / 0.12)', padding: '28px 28px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
          <div style={{ width: 28, height: 28, borderRadius: 5, background: '#0E5FD8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: "'Barlow Semi Condensed',sans-serif", fontWeight: 700, fontSize: 17 }}>C</div>
          <div style={{ fontFamily: "'Barlow Semi Condensed',sans-serif", fontWeight: 700, fontSize: 19, letterSpacing: '0.01em', color: '#1C2B39' }}>ClearComply</div>
        </div>

        {isSignIn ? (
          <>
            <div style={{ fontFamily: "'Barlow Semi Condensed',sans-serif", fontWeight: 700, fontSize: 22, color: '#1C2B39', marginBottom: 4 }}>Sign in</div>
            <div style={{ fontSize: '13.5px', color: '#5A6B7A', marginBottom: 20 }}>Use the credentials from your invite email.</div>

            <Field label="Email" pendoId="login-email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />
            <div style={{ marginBottom: 18 }}>
              <Field label="Password" pendoId="login-password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </>
        ) : (
          <>
            <div style={{ fontFamily: "'Barlow Semi Condensed',sans-serif", fontWeight: 700, fontSize: 22, color: '#1C2B39', marginBottom: 4 }}>Create your account</div>
            <div style={{ fontSize: '13.5px', color: '#5A6B7A', marginBottom: 20 }}>Join your organization on ClearComply.</div>

            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Field label="First name" pendoId="signup-first-name" type="text" autoComplete="given-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Field label="Last name" pendoId="signup-last-name" type="text" autoComplete="family-name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
            </div>
            <Field label="Email" pendoId="signup-email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Field label="Password" pendoId="signup-password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <PasswordChecklist password={password} />
            <div style={{ marginBottom: 18 }}>
              <Field label="Confirm password" pendoId="signup-confirm-password" type="password" autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
          </>
        )}

        {error && (
          <div style={{ background: '#FBEAE8', border: '1px solid #B3261E', color: '#B3261E', borderRadius: 6, padding: '9px 12px', fontSize: '12.5px', marginBottom: 14 }}>{error}</div>
        )}

        <button
          type="submit"
          disabled={loading || (!isSignIn && !signUpValid)}
          data-pendo-id={isSignIn ? 'login-submit' : 'signup-submit'}
          className="cc-primary-btn"
          style={{ width: '100%', background: '#0E5FD8', color: '#fff', border: '1px solid #0E5FD8', borderRadius: 3, padding: '10px 16px', fontWeight: 600, fontSize: '13.5px', opacity: (loading || (!isSignIn && !signUpValid)) ? 0.6 : 1 }}
        >
          {loading ? (isSignIn ? 'Signing in…' : 'Creating account…') : (isSignIn ? 'Sign in' : 'Create account')}
        </button>

        <div style={{ fontSize: '12.5px', color: '#5A6B7A', marginTop: 16, textAlign: 'center' }}>
          {isSignIn ? (
            <>New here? <a href="#" data-pendo-id="auth-mode-to-signup" onClick={(e) => { e.preventDefault(); switchMode('signUp'); }}>Create an account</a></>
          ) : (
            <>Already have an account? <a href="#" data-pendo-id="auth-mode-to-signin" onClick={(e) => { e.preventDefault(); switchMode('signIn'); }}>Sign in</a></>
          )}
        </div>
      </form>
    </div>
  );
}
