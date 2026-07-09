# ClearComply — 60-Day MVP Scope & Build Plan

**Branch:** `MVP60` · **Baseline:** the prototype on `main`

This document scopes a realistic 60-day MVP. It is deliberately narrower than
what the prototype demonstrates. The prototype (on `main`) proves the *workflow
and UX* cheaply; this plan defines the *buildable product* underneath it and
draws a hard line around what ships in v1 vs. what waits.

---

> **This branch (`MVP60`) also strips the prototype down to the v1 scope below.**
> The deferred features (simulated AI review, GC/PM directory reuse, per-project
> variable requirement sets, multi-project PM scoping) have been removed from the
> app so the working prototype reflects what one builder would actually ship.

## Assumptions

- **Team:** 1 product engineer / builder (AI-assisted). Single-threaded — no parallelism, so scope discipline is everything.
- **60 days = ~8 weeks**, with a feature freeze at week 6 and 2 weeks of hardening.
- With one builder, the plan below is aggressive but achievable **only** because AI, integrations, and the prototype's extra features are all deferred. Any scope added back pushes past 60 days.
- **Users at launch:** internal compliance professionals / PMs (single org, few seats). Subcontractors interact only through a public secure-link portal — no accounts.
- The prototype's `Store` view-model is treated as the **product spec** (data model + interactions), which removes most design ambiguity.

## MVP goal (what we are proving)

Let one compliance professional carry far more projects without adding headcount, by automating the clerical loop: **collect → track → chase → human review → report**. We are proving that the chasing/tracking burden can be removed while a human keeps sign-off. We are **not** proving AI document understanding in v1.

**Success = the core loop works on real data, over real calendar time, for real files, with a real human approving — and the accuracy guardrail (no doc wrongly marked compliant) holds.**

---

## Scope philosophy — the callouts, baked in

These five decisions shape everything below:

1. **Defer all AI.** Document classification/extraction/validation is the flashiest and riskiest work and is explicitly post-MVP. v1 review is human-only. Keeping AI in scope is the fastest way to miss 60 days.
2. **Email deliverability + the scheduler are the real risk — not the UI.** The reminder/escalation ladder must run over real calendar time (weekly payroll, monthly workforce). This is a job-queue + transactional-email problem and gets a real time budget.
3. **File upload/storage is unavoidable core.** It is the central artifact of the product and cannot be stubbed the way the prototype stubs it. Includes storage, access control, and virus scanning.
4. **Push the prototype's scope-creep to v1.1.** The prototype added projects, a GC/PM directory with reuse, per-project variable requirement sets, an onboarding wizard, and multi-project PM scoping. Great for a demo; several expand the build. See the mapping table.
5. **Escalation = notifications + a payment-hold flag only.** No integration with GC/accounting systems in v1. The prototype already stops at the right boundary ("flag a payment hold").

---

## In scope — MVP v1

| Area | v1 scope | Prototype status |
|---|---|---|
| **Auth / org** | Email+password (or magic link) via a managed auth provider; single org; PM role only. | Absent (hardcoded `loggedPm`). |
| **Data + persistence** | Postgres: projects, subcontractors, documents, requirement sets, reminders, audit events. | In-memory `Store`, resets on refresh. |
| **Onboarding** | Add a project (name, PM, GC contact); add a subcontractor to it; auto-generate the fixed 4-document requirement set + audit trail. | Full wizard exists (UI). |
| **Secure upload portal** | Signed, expiring tokenized link (no account); subcontractor uploads real files. | Hash route + fake token; status flip only. |
| **File handling** | Upload → object storage (S3/equiv) → virus scan → routed to review. | None. |
| **Status + dashboard** | Deterministic status (missing / received / approved / rejected / expired / expiring), KPIs, action queue, roster. | Built (UI, computed client-side). |
| **Human review** | PM approves / rejects-with-reason; state + audit updated. | Built (UI). |
| **Reminders + escalation** | Real transactional email; scheduler drives day-0→+10 ladder and recurring cadence; stop-on-receipt; escalate to GC + flag payment hold. | Simulated (counters, modal). |
| **Audit trail** | Server-side, append-only, per subcontractor/document. | In-memory array. |

## Explicitly out of scope

**Deferred to v1.1 (fast-follow):**
- AI-assisted document review (classification, extraction, validation flags).
- GC/PM **directory reuse** and dropdowns across projects.
- **Per-project variable requirement sets** (v1 uses the fixed 4 docs for everyone).
- Multi-project **PM scoping** / "my items vs. all items."
- Real-time project reporting shared with GC/project teams.

**Deferred to v2+:**
- Subcontractor mobile app.
- Compliance Q&A chatbot / assistant.
- Integrations (Procore/Textura, accounting/payment-hold systems).
- Multi-org / multi-tenant hardening beyond a single customer.

---

## Prototype → MVP mapping (reuse / build / defer)

| Prototype capability | v1 disposition | Note |
|---|---|---|
| React components + `Store` view-model | **Reuse** | Biggest head start — becomes the frontend + a schema spec. |
| Dashboard, KPIs, roster, action queue | **Reuse (rewire to API)** | Move computations server-side or fetch from API. |
| Detail drawer / page, review modal | **Reuse (rewire)** | Approve/reject hit real endpoints. |
| Reminder email modal | **Rebuild for real** | Wire to transactional email + logging. |
| Escalation ladder | **Rebuild for real** | Needs the scheduler; keep the ladder semantics. |
| Secure upload portal | **Rebuild for real** | Signed/expiring token + real file upload. |
| Onboarding wizard | **Reuse (trim)** | Keep add-sub-to-project; simplify GC to a single contact in v1. |
| GC/PM dropdown directory + reuse | **Defer (v1.1)** | v1: type the GC contact per project. |
| Per-project `requiredDocs` | **Defer (v1.1)** | v1: fixed 4-doc set. |
| Simulated AI review modal | **Defer (v1.1)** | Human-only review in v1. |

---

## Target architecture (boring on purpose)

- **Frontend:** the existing React/Vite app, rewired from the in-memory `Store` to an API client. Keep the component tree and view-model shape.
- **Backend:** a managed BaaS (e.g., Supabase) or a thin Node/Express service — chosen to minimize undifferentiated plumbing (auth, DB, storage, row-level security out of the box).
- **DB:** Postgres. Tables mirror the `Store`: `projects`, `subcontractors`, `documents`, `requirements`, `reminders`, `audit_events`, `users`.
- **File storage:** S3-compatible object storage + a virus-scan step on upload.
- **Scheduler/worker:** a cron/queue worker that evaluates due/overdue items daily and sends reminders / advances the escalation ladder.
- **Email:** a transactional provider (Postmark/SES) with templates, bounce handling, and quiet-hours/dedup logic.
- **Auth:** managed (Supabase Auth / Auth0) — do not hand-roll.

The rule: **buy/manage everything that isn't the compliance workflow.** The differentiator is the workflow logic, not auth or mail infrastructure.

---

## Week-by-week plan

| Week | Focus | Milestone / definition of done |
|---|---|---|
| **1** | Foundations | Repo, CI, hosting, managed auth wired, DB schema migrated, a PM can log in. |
| **2** | Data + CRUD | Projects & subcontractors persisted; requirement sets auto-generated on add; frontend reads real data. |
| **3** | File upload core | Secure signed upload link; subcontractor uploads a real file; stored + virus-scanned; lands in "received." |
| **4** | Review + dashboard | Human approve/reject with reason; deterministic status; dashboard/queue/roster on live data; audit trail server-side. |
| **5** | Notifications engine | Transactional email live; scheduler sends day-0 reminders; stop-on-receipt; audit logging of every send. |
| **6** | Escalation ladder + **FEATURE FREEZE** | +3/+7/+10 escalation, recurring cadence (weekly/monthly), escalate-to-GC + payment-hold flag. Scope locked. |
| **7** | Hardening | Access-control review on upload tokens, email deliverability tuning, edge cases (expired/rejected/resubmit), error states, seed→real data migration. |
| **8** | Pilot readiness | End-to-end run with a real compliance pro on 1–2 real projects; fix blockers; ship to pilot. |

**Cut line:** anything not merged by end of week 6 is v1.1, no exceptions. Weeks 7–8 are non-negotiable hardening — compliance software that's buggy is worse than none.

---

## Risks & mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Email deliverability / the scheduler are under-scoped | Slips the timeline; reminders are the core value | Give it a full week (wk 5); use a managed provider; test bounces/quiet hours early. |
| File upload security (malware, access control) | Real liability | Managed storage + virus scan + signed expiring URLs; security pass in wk 7. |
| **Accuracy guardrail** — a doc wrongly marked compliant | Undermines the entire product | Human sign-off required on every consequential doc in v1; deterministic rules only; no AI. |
| Scope creep from the prototype's extra features | Blows 60 days | Mapping table above is the contract; defer list is explicit. |
| "Just send emails" trap | Silent failures | Treat notifications as a first-class subsystem, not a UI button. |

## MVP success metrics (and guardrails)

- **Driver:** analyst-minutes per subcontractor per cycle drops sharply; % of follow-ups that happen without human effort.
- **Guardrail (must hold flat):** zero increase in documents wrongly marked compliant; audit trail complete and defensible.
- **Adoption:** a real compliance pro prefers this to their spreadsheet by end of pilot.

## Non-goals for v1 (say the quiet part out loud)

Not building: AI review, mobile app, chatbot, external integrations, multi-org tenancy, per-project variable requirements, cross-project PM scoping, GC/PM directory reuse. All are real and valuable — none are required to prove the core thesis in 60 days.
