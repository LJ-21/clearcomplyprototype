# ClearComply

A construction subcontractor compliance tracker — dashboard, action queue, subcontractor roster, document review, and reminder workflows, built as a fully interactive client-side prototype (React + Vite).

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Outputs static files to `dist/`. Deploys to Netlify via the `netlify.toml` at the repo root (base directory `app`, publish directory `dist`).

## State

All data is seeded in-memory (`src/store.js`) — there is no backend. Reminders, approvals/rejections, and escalations mutate local state and log to each subcontractor's audit trail, but nothing persists across a page reload.
