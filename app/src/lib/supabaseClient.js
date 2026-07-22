import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Deliberately not thrown here: a throw during module evaluation happens
// before React ever renders, which just produces a blank white screen with
// nothing but a console error — the opposite of "fail loudly." AuthGate
// checks this and renders a real, visible error screen instead.
export const supabaseConfigError = (!url || !anonKey)
  ? 'Missing VITE_SUPABASE_URL and/or VITE_SUPABASE_ANON_KEY. Copy app/.env.example to app/.env.local and fill in your Supabase project values.'
  : null;

export const supabase = supabaseConfigError ? null : createClient(url, anonKey);
