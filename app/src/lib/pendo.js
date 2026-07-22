// Pendo guided-tour wiring. The agent LOADER lives in index.html (a <script>
// in <head> that loads the agent on every page and stubs window.pendo). This
// module's only job is to call pendo.initialize() once we know who the user
// is — after login, from AuthGate — so the visitor is identified with a
// stable id. It writes no tour steps, copy, or sequencing; that's authored
// later in Pendo's no-code dashboard (app.pendo.io).

/**
 * @param {{visitor: {id: string, email: string}, account: {id: string, name: string}}} params
 * visitor.id MUST be the stable Supabase auth user id, not a per-session
 * random value — a random id would count as a new visitor every session
 * and could silently blow through Pendo's 500-MAU free-tier cap.
 */
export function initPendo({ visitor, account }) {
  if (typeof window === 'undefined' || !window.pendo) {
    // Loader (index.html) not present or blocked — nothing to initialize.
    return;
  }
  window.pendo.initialize({ visitor, account });
}
