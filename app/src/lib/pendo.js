// Pendo guided-tour SDK wiring. This file only makes Pendo "see" the
// logged-in user/org — it writes no tour steps, copy, or sequencing.
// Actual walkthrough content is authored later by the product team in
// Pendo's no-code dashboard (app.pendo.io), not in this codebase.
//
// initPendo() is called once, from AuthGate, only after a session +
// profile/org have resolved — never on the Login screen — so anonymous
// visitors never load a third-party script, and every identified visitor
// has a real, stable id (see below).

let installed = false;

function installSnippet(apiKey) {
  if (installed || typeof window === 'undefined') return;
  installed = true;

  (function (apiKey) {
    (function (p, e, n, d, o) {
      let v, w, x, y, z;
      o = p[d] = p[d] || {};
      o._q = o._q || [];
      v = ['initialize', 'identify', 'updateOptions', 'pageLoad', 'track'];
      for (w = 0, x = v.length; w < x; ++w) {
        (function (m) {
          o[m] = o[m] || function () {
            o._q[m === v[0] ? 'unshift' : 'push']([m].concat([].slice.call(arguments, 0)));
          };
        })(v[w]);
      }
      y = e.createElement(n);
      y.async = true;
      y.src = 'https://cdn.pendo.io/agent/static/' + apiKey + '/pendo.js';
      z = e.getElementsByTagName(n)[0];
      z.parentNode.insertBefore(y, z);
    })(window, document, 'script', 'pendo');
  })(apiKey);
}

/**
 * @param {{visitor: {id: string, email: string}, account: {id: string, name: string}}} params
 * visitor.id MUST be the stable Supabase auth user id, not a per-session
 * random value — a random id would count as a new visitor every session
 * and could silently blow through Pendo's 500-MAU free-tier cap.
 */
export function initPendo({ visitor, account }) {
  const apiKey = import.meta.env.VITE_PENDO_API_KEY;
  if (!apiKey) {
    console.warn('VITE_PENDO_API_KEY is not set — skipping Pendo initialization.');
    return;
  }
  installSnippet(apiKey);
  window.pendo.initialize({ visitor, account });
}
