// ClearComply app state + view-model logic.
// Ported from the Claude Design prototype (ClearComply.dc.html) — same seed
// data, same computations, same behavior — adapted from the DC runtime's
// forceUpdate() pattern to a plain subscribable store React can consume.

const ACCENT = '#0E5FD8';

export class Store {
  constructor() {
    this._min = 8;
    this.PER = 10;
    this.loggedPm = 'Dana Ruiz';
    this.DOCS = [
      { key: 'insurance', label: 'Insurance Certificate', cadence: 'One-time · expires' },
      { key: 'w9', label: 'W-9', cadence: 'One-time' },
      { key: 'payroll', label: 'Certified Payroll', cadence: 'Weekly' },
      { key: 'workforce', label: 'Workforce Report', cadence: 'Monthly' },
    ];
    this.PM = {
      'Riverside Tower': 'Dana Ruiz',
      'Midtown Transit Hub': 'Marcus Bell',
      'Harbor Point Ph. 2': 'Priya Nair',
    };
    this.state = {
      view: 'dashboard', returnView: 'dashboard', selectedSubId: null, selectedDocKey: null, drawerOpen: false,
      projectFilter: 'All projects', missingOnly: false, queueFilter: 'all', scope: 'mine', queuePage: 0, rosterPage: 0,
      toast: '', emailOpen: false, email: null,
      reviewOpen: false, review: null, rejectReason: '',
      projects: Object.entries(this.PM).map(([name, pm]) => ({ name, pm })),
      subs: this.makeSeed(),
      route: null,
      onboardOpen: false, onboardMode: 'sub', onboardError: '', onboardCreatedLink: null,
      onboardSub: { name: '', trade: '', project: '', email: '' },
      onboardProject: { name: '', pm: '' },
    };
    this._listeners = new Set();

    // Public subcontractor upload portal is reached via the URL hash
    // (#/upload/<subId>/<token>) so a single deployed build serves both the
    // PM app and the sub-facing upload page. Parse it now and on every change.
    if (typeof window !== 'undefined') {
      this.state.route = this.parseHash();
      window.addEventListener('hashchange', () => this.set({ route: this.parseHash(), drawerOpen: false }));
    }
  }

  subscribe(fn) { this._listeners.add(fn); return () => this._listeners.delete(fn); }
  forceUpdate() { this._listeners.forEach((fn) => fn()); }
  set(patch) { Object.assign(this.state, patch); this.forceUpdate(); }

  C() {
    const accent = ACCENT;
    return {
      paper: '#F7F6F3', surface: '#FFFFFF', ink: '#1C2B39', inkSoft: '#5A6B7A', line: '#E3E1DB',
      accent, accentDark: '#0B4FB4',
      ok: '#1E7F4F', okTint: '#E7F4EC', pending: '#8A6D00', pendingTint: '#FBF3D9',
      warn: '#B45309', warnTint: '#FDEFDF', danger: '#B3261E', dangerTint: '#FBEAE8',
      neutral: '#5A6B7A', neutralTint: '#EEF0F2',
    };
  }

  makeSeed() {
    const d = (status, extra) => Object.assign({ status, overdueDays: null, expiringDays: null, expiry: null, reason: null, period: null, escalation: 0 }, extra || {});
    const P1 = 'Riverside Tower', P2 = 'Midtown Transit Hub', P3 = 'Harbor Point Ph. 2';
    const raw = [
      ['Ironworks LLC', 'Structural Steel', P1, 'billing@ironworksllc.com',
        d('missing', { overdueDays: 12, escalation: 2 }), d('approved'), d('needs_review', { period: 'Week of Jun 30' }), d('missing', { overdueDays: 4, escalation: 1 })],
      ['Apex Electric', 'Electrical', P1, 'ap@apexelectric.com',
        d('expiring', { expiringDays: 9, expiry: 'Jul 17, 2026' }), d('approved'), d('needs_review', { period: 'Week of Jun 30' }), d('approved', { period: 'June' })],
      ['Cornerstone Concrete', 'Concrete', P2, 'office@cornerstonecc.com',
        d('rejected', { reason: 'General liability limit $1M is below the $2M contract requirement.' }), d('approved'), d('approved', { period: 'Week of Jun 30' }), d('needs_review', { period: 'June' })],
      ['Summit Plumbing', 'Plumbing', P3, 'admin@summitplumbing.com',
        d('approved', { expiry: 'Mar 2, 2027' }), d('approved'), d('approved', { period: 'Week of Jun 30' }), d('approved', { period: 'June' })],
      ['Vertex HVAC', 'Mechanical / HVAC', P1, 'billing@vertexhvac.com',
        d('approved', { expiry: 'Nov 20, 2026' }), d('missing', { overdueDays: 3, escalation: 1 }), d('submitted', { period: 'Week of Jun 30' }), d('approved', { period: 'June' })],
      ['Meridian Drywall', 'Drywall', P2, 'accounts@meridiandrywall.com',
        d('approved', { expiry: 'Jan 9, 2027' }), d('approved'), d('missing', { overdueDays: 8, escalation: 2, period: 'Week of Jun 30' }), d('missing', { period: 'June' })],
      ['Coastal Roofing', 'Roofing', P3, 'pm@coastalroofing.com',
        d('expiring', { expiringDays: 21, expiry: 'Jul 29, 2026' }), d('approved'), d('approved', { period: 'Week of Jun 30' }), d('needs_review', { period: 'June' })],
      ['Granite Masonry', 'Masonry', P2, 'office@granitemasonry.com',
        d('approved', { expiry: 'Aug 14, 2026' }), d('approved'), d('approved', { period: 'Week of Jun 30' }), d('approved', { period: 'June' })],
      ['ClearView Glazing', 'Glazing', P1, 'ar@clearviewglazing.com',
        d('approved', { expiry: 'Dec 1, 2026' }), d('approved'), d('needs_review', { period: 'Week of Jun 30' }), d('missing', { dueInDays: 2, period: 'June' })],
      ['Precision Painting', 'Painting', P3, 'hello@precisionpaint.com',
        d('missing', { overdueDays: 5, escalation: 1 }), d('missing'), d('missing', { dueInDays: 2, period: 'Week of Jun 30' }), d('missing', { dueInDays: 1, period: 'June' })],
      ['Keystone Framing', 'Framing', P2, 'billing@keystoneframing.com',
        d('approved', { expiry: 'Sep 28, 2026' }), d('approved'), d('approved', { period: 'Week of Jun 30' }), d('approved', { period: 'June' })],
      ['Terra Excavation', 'Excavation', P1, 'ap@terraexcavation.com',
        d('expired', { expiry: 'Jun 30, 2026' }), d('approved'), d('approved', { period: 'Week of Jun 30' }), d('missing', { overdueDays: 2, escalation: 1, period: 'June' })],
      ['Evergreen Landscaping', 'Landscaping', P3, 'office@evergreenland.com',
        d('approved', { expiry: 'Feb 11, 2027' }), d('approved'), d('submitted', { period: 'Week of Jun 30' }), d('approved', { period: 'June' })],
      ['Sentinel Fire Protection', 'Fire Protection', P2, 'compliance@sentinelfp.com',
        d('approved', { expiry: 'Oct 3, 2026' }), d('approved'), d('needs_review', { period: 'Week of Jun 30' }), d('approved', { period: 'June' })],
      ['Summit Elevator', 'Elevator', P1, 'ap@summitelevator.com',
        d('approved', { expiry: 'May 6, 2027' }), d('approved'), d('approved', { period: 'Week of Jun 30' }), d('missing', { overdueDays: 6, escalation: 1, period: 'June' })],
    ];
    return raw.map((r, i) => {
      const sub = {
        id: 's' + i, name: r[0], trade: r[1], project: r[2], email: r[3],
        docs: { insurance: r[4], w9: r[5], payroll: r[6], workforce: r[7] }, audit: [],
      };
      const trail = [];
      trail.push({ actor: 'SYSTEM', ts: 'Jun 24 · 08:00', text: 'Subcontractor added to ' + sub.project + '. Requirement set auto-generated (Insurance, W-9, weekly Payroll, monthly Workforce).' });
      this.DOCS.forEach((def) => {
        const doc = sub.docs[def.key];
        if (doc.status === 'approved') trail.push({ actor: 'YOU', ts: 'Jun 27 · 10:15', text: 'Approved ' + def.label + '.' });
        else if (doc.status === 'rejected') trail.push({ actor: 'YOU', ts: 'Jun 29 · 14:22', text: 'Rejected ' + def.label + ': ' + doc.reason });
        else if (doc.status === 'missing' && doc.overdueDays) trail.push({ actor: 'SYSTEM', ts: 'Jul 2 · 09:00', text: 'Reminder (level ' + (doc.escalation || 1) + ') sent for ' + def.label + '.' });
        else if (doc.status === 'needs_review' || doc.status === 'submitted') trail.push({ actor: 'SYSTEM', ts: 'Jul 6 · 11:40', text: def.label + ' received from subcontractor — routed to review.' });
        else if (doc.status === 'expiring') trail.push({ actor: 'SYSTEM', ts: 'Jul 5 · 07:30', text: 'Expiry warning: ' + def.label + ' expires in ' + doc.expiringDays + ' days.' });
        else if (doc.status === 'expired') trail.push({ actor: 'SYSTEM', ts: 'Jul 1 · 07:30', text: def.label + ' expired — renewal reminder sent.' });
      });
      sub.audit = trail.reverse();
      return sub;
    });
  }

  // ---- helpers ----
  findSub(id) { return this.state.subs.find((s) => s.id === id); }
  pmFor(project) { const p = this.state.projects.find((x) => x.name === project); return p ? p.pm : (this.PM[project] || 'Unassigned'); }
  projectNames() { return Array.from(new Set([...this.state.projects.map((p) => p.name), ...this.state.subs.map((s) => s.project)])); }
  parseHash() { const h = (window.location.hash || '').replace(/^#/, ''); const m = h.match(/^\/upload\/([^/]+)\/([^/?]+)/); return m ? { name: 'upload', subId: decodeURIComponent(m[1]), token: m[2] } : null; }
  uploadLink(subId) { if (typeof window === 'undefined') return ''; const { origin, pathname } = window.location; return origin + pathname + '#/upload/' + subId + '/' + this.tok(subId); }
  nextTime() { this._min += 7; const h = 9 + Math.floor(this._min / 60); const m = this._min % 60; return 'Jul 8 · ' + String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0'); }
  addAudit(sub, actor, text) { sub.audit.unshift({ actor, text, ts: this.nextTime() }); }
  showToast(msg) { this.set({ toast: msg }); clearTimeout(this._t); this._t = setTimeout(() => this.set({ toast: '' }), 3800); }
  tok(s) { let h = 0; for (let i = 0; i < s.length; i++) { h = (h * 31 + s.charCodeAt(i)) >>> 0; } return ('00000000' + h.toString(16)).slice(-8); }
  secureLink(subId, docKey) { return 'https://portal.clearcomply.com/u/' + subId + '/' + docKey + '?t=' + this.tok(subId + docKey); }

  stampMeta(doc) {
    const C = this.C();
    switch (doc.status) {
      case 'approved': return { label: 'Approved', color: C.ok, tint: C.okTint };
      case 'submitted': return { label: 'Submitted', color: C.pending, tint: C.pendingTint };
      case 'needs_review': return { label: 'Needs review', color: C.pending, tint: C.pendingTint };
      case 'expiring': return { label: 'Expiring · ' + doc.expiringDays + 'd', color: C.warn, tint: C.warnTint };
      case 'expired': return { label: 'Expired', color: C.danger, tint: C.dangerTint };
      case 'rejected': return { label: 'Rejected', color: C.danger, tint: C.dangerTint };
      case 'missing':
        if (doc.overdueDays) return { label: 'Overdue · ' + doc.overdueDays + 'd', color: C.danger, tint: C.dangerTint };
        if (doc.dueInDays != null) return { label: doc.dueInDays === 0 ? 'Due today' : 'Due · ' + doc.dueInDays + 'd', color: C.warn, tint: C.warnTint };
        return { label: 'Missing', color: C.neutral, tint: C.neutralTint };
      default: return { label: doc.status, color: C.neutral, tint: C.neutralTint };
    }
  }
  stampStyle(meta, small) {
    return { fontFamily: "'Barlow Semi Condensed',sans-serif", fontWeight: 600, fontSize: small ? '10.5px' : '11px', letterSpacing: '0.04em', textTransform: 'uppercase', border: '2px solid ' + meta.color, background: meta.tint, color: meta.color, borderRadius: '3px', padding: '2px 8px', display: 'inline-block', whiteSpace: 'nowrap', lineHeight: 1.35 };
  }
  btn(kind) {
    const C = this.C();
    const base = { borderRadius: '3px', padding: '8px 14px', fontWeight: 600, fontSize: '13px', whiteSpace: 'nowrap', border: '1px solid transparent' };
    if (kind === 'primary') return Object.assign({}, base, { background: C.accent, color: '#fff', borderColor: C.accent });
    return Object.assign({}, base, { background: '#fff', color: C.ink, borderColor: C.line });
  }
  chipStyle(actor) {
    const C = this.C();
    const m = { SYSTEM: [C.neutral, C.neutralTint], AI: [C.accent, '#E4EEFC'], YOU: [C.ok, C.okTint] }[actor] || [C.neutral, C.neutralTint];
    return { fontFamily: "'Barlow Semi Condensed',sans-serif", fontWeight: 600, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', color: m[0], background: m[1], border: '1px solid ' + m[0], borderRadius: '3px', padding: '1px 6px' };
  }
  escFor(doc, cat) {
    const C = this.C();
    const dot = (c) => ({ width: '8px', height: '8px', borderRadius: '999px', background: c, flexShrink: 0, marginTop: '5px' });
    if (cat === 'due') return { dotStyle: dot(C.warn), text: 'Upcoming deadline · due in ' + doc.dueInDays + 'd', next: 'auto-reminder at due date → CC PM if unmet' };
    if (doc.status === 'expired') return { dotStyle: dot(C.danger), text: 'Coverage lapsed', next: 'renewal reminder sent · PM notified' };
    if (cat === 'overdue') {
      const od = doc.overdueDays || 0;
      if (od >= 10) return { dotStyle: dot(C.danger), text: 'L4 · Escalated to GC / PM — payment hold', next: 'awaiting GC action' };
      if (od >= 7) return { dotStyle: dot(C.danger), text: 'L3 · Flagged to you — non-responsive', next: 'escalate to GC / PM at +10d' };
      if (od >= 3) return { dotStyle: dot(C.warn), text: 'L2 · Reminder + CC primary contact', next: 'flag to compliance at +7d' };
      return { dotStyle: dot(C.pending), text: 'L1 · Friendly reminder sent', next: 'CC primary contact at +3d' };
    }
    return null;
  }
  extraction(key, doc) {
    if (key === 'insurance') {
      return {
        fields: [{ label: 'Document type', value: 'ACORD 25 — Certificate of Insurance' }, { label: 'Policy expiration', value: doc.expiry || 'Jul 31, 2026' }, { label: 'General liability', value: doc.status === 'rejected' ? '$1,000,000' : '$2,000,000' }],
        checks: [{ ok: true, text: 'Document type matches the requirement.' }, { ok: !(doc.status === 'expired' || doc.status === 'expiring'), text: 'Coverage does not lapse before contract end (Dec 15, 2026).' }, { ok: doc.status !== 'rejected', text: 'Meets the $2M general-liability minimum.' }],
      };
    }
    if (key === 'payroll') {
      return {
        fields: [{ label: 'Document type', value: 'WH-347 — Certified Payroll' }, { label: 'Period', value: doc.period || 'Week of Jun 30' }, { label: 'Workers reported', value: '14' }, { label: 'Lowest wage rate', value: '$43.60 / hr' }],
        checks: [{ ok: true, text: 'Document type matches the requirement.' }, { ok: true, text: 'All classifications meet the $42.10 prevailing-wage floor.' }, { ok: true, text: 'Hours and gross wages reconcile.' }],
      };
    }
    if (key === 'workforce') {
      return {
        fields: [{ label: 'Document type', value: 'Monthly Workforce Report' }, { label: 'Month', value: doc.period || 'June' }, { label: 'Total workers', value: '22' }, { label: 'Apprentice ratio', value: '18%' }],
        checks: [{ ok: true, text: 'Document type matches the requirement.' }, { ok: true, text: 'Headcount totals reconcile with payroll.' }],
      };
    }
    return {
      fields: [{ label: 'Document type', value: 'IRS Form W-9' }, { label: 'TIN', value: '**-***4821' }, { label: 'Signature', value: 'Present' }],
      checks: [{ ok: true, text: 'Required fields are present.' }, { ok: true, text: 'Signature block is completed.' }],
    };
  }

  // ---- navigation ----
  goHome = () => this.set({ view: 'dashboard', drawerOpen: false });
  setNav = (v) => this.set({ view: v, drawerOpen: false, queuePage: 0, rosterPage: 0 });
  openDrawer = (subId, docKey) => this.set({ selectedSubId: subId, selectedDocKey: docKey || null, drawerOpen: true });
  closeDrawer = () => this.set({ drawerOpen: false });
  viewFullPage = () => this.set({ drawerOpen: false, returnView: this.state.view, view: 'detail' });
  backFromDetail = () => this.set({ view: this.state.returnView || 'dashboard' });
  onProjectChange = (e) => this.set({ projectFilter: e.target.value, queuePage: 0, rosterPage: 0 });
  toggleMissingOnly = () => this.set({ missingOnly: !this.state.missingOnly, rosterPage: 0 });
  setQueueFilter = (cat) => this.set({ queueFilter: cat, queuePage: 0 });
  setScope = (sc) => this.set({ scope: sc, queuePage: 0 });
  escalateToGC = (subId, docKey) => {
    const sub = this.findSub(subId), doc = sub.docs[docKey], def = this.DOCS.find((d) => d.key === docKey);
    doc.escalation = Math.max(doc.escalation || 0, 4);
    this.addAudit(sub, 'YOU', 'Escalated ' + def.label + ' to GC / PM — payment hold flagged.');
    this.forceUpdate();
    this.showToast('Escalated to GC / PM · payment hold flagged for ' + sub.name);
  };
  closeModal = () => this.set({ emailOpen: false, reviewOpen: false });
  stop = (e) => e.stopPropagation();

  queuePrev = () => this.set({ queuePage: Math.max(0, this.state.queuePage - 1) });
  queueNext = () => { const t = this.filteredQueue().length; const max = Math.max(0, Math.ceil(t / this.PER) - 1); this.set({ queuePage: Math.min(max, this.state.queuePage + 1) }); };
  rosterPrev = () => this.set({ rosterPage: Math.max(0, this.state.rosterPage - 1) });
  rosterNext = () => { const t = this.rosterList().length; const max = Math.max(0, Math.ceil(t / this.PER) - 1); this.set({ rosterPage: Math.min(max, this.state.rosterPage + 1) }); };

  // ---- actions ----
  openEmail = (subId, docKey) => {
    const sub = this.findSub(subId), doc = sub.docs[docKey], def = this.DOCS.find((d) => d.key === docKey);
    const link = this.secureLink(subId, docKey);
    const subject = 'Action needed: ' + def.label + ' — ' + sub.project;
    let body;
    if (doc.status === 'rejected') body = 'Hi ' + sub.name + ' team,\n\nYour ' + def.label + ' for ' + sub.project + ' could not be accepted:\n"' + doc.reason + '"\n\nPlease upload a corrected document via your secure link:\n' + link + '\n\nReply here with any questions.\n\n— ClearComply, on behalf of the compliance team';
    else if (doc.status === 'expiring') body = 'Hi ' + sub.name + ' team,\n\nYour ' + def.label + ' for ' + sub.project + ' expires in ' + doc.expiringDays + ' days (' + doc.expiry + '). Please upload a renewed certificate before it lapses to avoid a work-eligibility hold.\n\nUpload securely here:\n' + link + '\n\n— ClearComply';
    else if (doc.status === 'expired') body = 'Hi ' + sub.name + ' team,\n\nOur records show your ' + def.label + ' for ' + sub.project + ' has expired. Coverage must be current to remain eligible to work on site. Please upload a renewed certificate as soon as possible.\n\nUpload securely here:\n' + link + '\n\n— ClearComply';
    else body = 'Hi ' + sub.name + ' team,\n\nOur records show your ' + def.label + ' for ' + sub.project + ' is ' + (doc.overdueDays ? ('overdue by ' + doc.overdueDays + ' days') : 'outstanding') + '. Please upload it via your secure link so we can keep your compliance current.\n\nUpload securely here:\n' + link + '\n\n— ClearComply';
    this.set({ email: { subId, docKey, subName: sub.name, to: sub.email, subject, body }, emailOpen: true });
  };
  onEmailSubject = (e) => { this.state.email.subject = e.target.value; this.forceUpdate(); };
  onEmailBody = (e) => { this.state.email.body = e.target.value; this.forceUpdate(); };
  sendEmail = () => {
    const { subId, docKey } = this.state.email, sub = this.findSub(subId), doc = sub.docs[docKey], def = this.DOCS.find((d) => d.key === docKey);
    const lvl = (doc.escalation || 0) + 1; doc.escalation = lvl;
    this.addAudit(sub, 'YOU', 'Reminder (level ' + lvl + ') sent to ' + sub.email + ' for ' + def.label + '.');
    this.set({ emailOpen: false });
    this.showToast('Reminder sent to ' + sub.name + ' · logged to activity');
  };

  markReceived = (subId, docKey) => {
    const sub = this.findSub(subId), doc = sub.docs[docKey], def = this.DOCS.find((d) => d.key === docKey);
    doc.status = 'needs_review'; doc.overdueDays = null;
    this.addAudit(sub, 'YOU', 'Marked ' + def.label + ' received — routed to review.');
    this.forceUpdate();
    this.showToast(def.label + ' marked received · now waiting on your review');
  };
  simulateUpload = (subId) => {
    const sub = this.findSub(subId);
    const key = ['insurance', 'w9', 'payroll', 'workforce'].find((k) => ['missing', 'rejected', 'expired'].includes(sub.docs[k].status));
    if (!key) { this.showToast('Nothing outstanding to upload for this subcontractor.'); return; }
    const def = this.DOCS.find((d) => d.key === key), doc = sub.docs[key];
    doc.status = 'needs_review'; doc.overdueDays = null;
    this.addAudit(sub, 'SYSTEM', def.label + ' uploaded by subcontractor — routed to review.');
    this.set({ review: { subId, docKey: key, rejecting: false }, reviewOpen: true, rejectReason: '' });
  };

  openReview = (subId, docKey) => this.set({ review: { subId, docKey, rejecting: false }, reviewOpen: true, rejectReason: '' });
  approve = () => {
    const { subId, docKey } = this.state.review, sub = this.findSub(subId), doc = sub.docs[docKey], def = this.DOCS.find((d) => d.key === docKey);
    doc.status = 'approved'; doc.reason = null; doc.expiringDays = null; doc.overdueDays = null;
    this.addAudit(sub, 'YOU', 'Approved ' + def.label + '.');
    this.set({ reviewOpen: false });
    this.showToast(def.label + ' approved for ' + sub.name + ' · compliance updated');
  };
  startReject = () => { this.state.review.rejecting = true; this.set({ rejectReason: '' }); };
  cancelReject = () => { this.state.review.rejecting = false; this.forceUpdate(); };
  onRejectReason = (e) => { this.state.rejectReason = e.target.value; this.forceUpdate(); };
  confirmReject = () => {
    const { subId, docKey } = this.state.review, sub = this.findSub(subId), doc = sub.docs[docKey], def = this.DOCS.find((d) => d.key === docKey);
    const reason = (this.state.rejectReason || '').trim() || 'Does not meet the requirement.';
    doc.status = 'rejected'; doc.reason = reason; doc.overdueDays = null;
    this.addAudit(sub, 'YOU', 'Rejected ' + def.label + ': ' + reason);
    this.set({ reviewOpen: false });
    this.showToast(def.label + ' rejected · resubmit notice ready for ' + sub.name);
  };

  visibleSubs() { const f = this.state.projectFilter; return this.state.subs.filter((s) => f === 'All projects' || s.project === f); }
  runSweep = () => {
    let rem = 0, esc = 0, exp = 0;
    this.visibleSubs().forEach((sub) => {
      this.DOCS.forEach((def) => {
        const doc = sub.docs[def.key];
        if (doc.status === 'missing') { const lvl = (doc.escalation || 0) + 1; doc.escalation = lvl; if (lvl >= 3) { esc++; this.addAudit(sub, 'SYSTEM', 'Escalated to GC/PM — ' + def.label + ' non-responsive (level ' + lvl + ').'); } else { rem++; this.addAudit(sub, 'SYSTEM', 'Reminder (level ' + lvl + ') sent for ' + def.label + '.'); } }
        else if (doc.status === 'expiring') { exp++; this.addAudit(sub, 'SYSTEM', 'Expiry warning sent — ' + def.label + ' expires in ' + doc.expiringDays + 'd.'); }
        else if (doc.status === 'expired') { rem++; this.addAudit(sub, 'SYSTEM', 'Renewal reminder sent — ' + def.label + ' expired.'); }
      });
    });
    this.forceUpdate();
    this.showToast('Daily sweep complete · ' + rem + ' reminders · ' + exp + ' expiry warnings · ' + esc + ' escalated to GC/PM');
  };

  // ---- onboarding (create project / subcontractor) ----
  openOnboard = (mode) => this.set({ onboardOpen: true, onboardMode: mode || 'sub', onboardError: '', onboardCreatedLink: null });
  closeOnboard = () => this.set({ onboardOpen: false, onboardError: '', onboardCreatedLink: null });
  setOnboardMode = (mode) => this.set({ onboardMode: mode, onboardError: '' });
  onOnboardSub = (field, e) => { this.state.onboardSub[field] = e.target.value; this.forceUpdate(); };
  onOnboardProject = (field, e) => { this.state.onboardProject[field] = e.target.value; this.forceUpdate(); };

  submitOnboardProject = () => {
    const f = this.state.onboardProject, name = (f.name || '').trim(), pm = (f.pm || '').trim() || 'Unassigned';
    if (!name) { this.set({ onboardError: 'Project name is required.' }); return; }
    if (this.state.projects.some((p) => p.name.toLowerCase() === name.toLowerCase())) { this.set({ onboardError: 'A project with that name already exists.' }); return; }
    this.state.projects.push({ name, pm });
    this.state.onboardProject = { name: '', pm: '' };
    this.set({ onboardOpen: false, onboardError: '' });
    this.showToast('Project "' + name + '" created' + (pm !== 'Unassigned' ? (' · PM ' + pm) : ''));
  };

  submitOnboardSub = () => {
    const f = this.state.onboardSub;
    const name = (f.name || '').trim(), trade = (f.trade || '').trim(), project = (f.project || '').trim(), email = (f.email || '').trim();
    if (!name || !project || !email) { this.set({ onboardError: 'Name, project, and email are required.' }); return; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { this.set({ onboardError: 'Enter a valid email address.' }); return; }
    const nums = this.state.subs.map((s) => parseInt(String(s.id).replace(/\D/g, ''), 10)).filter((n) => !isNaN(n));
    const id = 's' + ((nums.length ? Math.max(...nums) : -1) + 1);
    const mk = (extra) => Object.assign({ status: 'missing', overdueDays: null, expiringDays: null, expiry: null, reason: null, period: null, escalation: 0 }, extra || {});
    const sub = {
      id, name, trade: trade || '—', project, email,
      docs: { insurance: mk(), w9: mk(), payroll: mk({ period: 'Week of Jul 7' }), workforce: mk({ period: 'July' }) }, audit: [],
    };
    if (!this.state.projects.some((p) => p.name === project)) this.state.projects.push({ name: project, pm: 'Unassigned' });
    sub.audit.unshift({ actor: 'SYSTEM', ts: this.nextTime(), text: 'Subcontractor added to ' + project + '. Requirement set auto-generated (Insurance, W-9, weekly Payroll, monthly Workforce).' });
    const link = this.uploadLink(id);
    sub.audit.unshift({ actor: 'SYSTEM', ts: this.nextTime(), text: 'Secure upload link generated and emailed to ' + email + '.' });
    this.state.subs.push(sub);
    this.state.onboardSub = { name: '', trade: '', project: '', email: '' };
    this.set({ onboardError: '', onboardCreatedLink: { link, subName: name, subId: id } });
    this.showToast(name + ' onboarded · secure upload link generated');
  };

  copyUploadLink = () => { const l = this.state.onboardCreatedLink; if (l && typeof navigator !== 'undefined' && navigator.clipboard) navigator.clipboard.writeText(l.link); this.showToast('Upload link copied to clipboard'); };
  openUploadLink = () => { const l = this.state.onboardCreatedLink; if (l) window.location.hash = '#/upload/' + l.subId + '/' + this.tok(l.subId); this.set({ onboardOpen: false }); };

  // ---- subcontractor upload portal ----
  exitPortal = () => { window.location.hash = ''; };
  portalUpload = (subId, docKey) => {
    const sub = this.findSub(subId), doc = sub.docs[docKey], def = this.DOCS.find((d) => d.key === docKey);
    doc.status = 'needs_review'; doc.overdueDays = null; doc.reason = null;
    this.addAudit(sub, 'SYSTEM', def.label + ' uploaded by subcontractor via secure link — routed to review.');
    this.forceUpdate();
    this.showToast(def.label + ' uploaded · sent to the compliance team for review');
  };
  buildPortal(subId, token) {
    const sub = this.findSub(subId);
    if (!sub || token !== this.tok(subId)) return { valid: false };
    const items = this.DOCS.map((def) => {
      const doc = sub.docs[def.key], meta = this.stampMeta(doc);
      const outstanding = ['missing', 'rejected', 'expired'].includes(doc.status);
      const pending = ['needs_review', 'submitted'].includes(doc.status);
      const done = doc.status === 'approved';
      return {
        key: def.key, label: def.label, cadence: def.cadence, stampLabel: meta.label, stampStyle: this.stampStyle(meta),
        outstanding, pending, done, reason: doc.status === 'rejected' ? doc.reason : null,
        onUpload: outstanding ? (() => this.portalUpload(subId, def.key)) : null,
      };
    });
    const outstandingCount = items.filter((i) => i.outstanding).length;
    return { valid: true, subId, subName: sub.name, project: sub.project, trade: sub.trade, items, outstandingCount, allSubmitted: outstandingCount === 0 };
  }

  // ---- view-model builders ----
  buildQueueAll() {
    const C = this.C(), DOCS = this.DOCS, items = [];
    this.visibleSubs().forEach((s) => DOCS.forEach((def) => {
      const doc = s.docs[def.key], st = doc.status; let score = 0, reason = '', action = 'draft', cat = '';
      if (st === 'rejected') { score = 95; reason = 'Rejected: ' + doc.reason; cat = 'rejected'; }
      else if (st === 'expired') { score = 88; reason = def.label + ' has expired (' + (doc.expiry || '') + ')'; cat = 'overdue'; }
      else if (st === 'missing' && doc.overdueDays) { score = 60 + doc.overdueDays * 2 + (doc.escalation || 0) * 8; reason = def.label + ' overdue ' + doc.overdueDays + ' days'; cat = 'overdue'; }
      else if (st === 'missing' && doc.dueInDays != null && doc.dueInDays < 3) { score = 44 + (3 - doc.dueInDays); reason = def.label + ' due in ' + doc.dueInDays + ' day' + (doc.dueInDays === 1 ? '' : 's'); cat = 'due'; }
      else if (st === 'needs_review') { score = 52; reason = def.label + ' received' + (doc.period ? (' · ' + doc.period) : '') + ' · waiting on your review'; action = 'review'; cat = 'review'; }
      else if (st === 'submitted') { score = 48; reason = def.label + ' received · waiting on your review'; action = 'review'; cat = 'review'; }
      else if (st === 'expiring') { score = 40 + (30 - doc.expiringDays); reason = def.label + ' expires in ' + doc.expiringDays + ' days (' + doc.expiry + ')'; cat = 'expiring'; }
      else return;
      const meta = this.stampMeta(doc);
      const esc = this.escFor(doc, cat);
      items.push({
        key: s.id + '-' + def.key, subId: s.id, docKey: def.key, score, cat, subName: s.name, docLabel: def.label, reason,
        pm: this.pmFor(s.project), esc, hasEsc: !!esc,
        stampStyle: this.stampStyle(meta), stampLabel: meta.label,
        style: { display: 'flex', gap: '16px', alignItems: 'center', background: '#fff', border: '1px solid ' + C.line, borderLeft: '3px solid ' + meta.color, borderRadius: '6px', padding: '14px 16px', cursor: 'pointer' },
        actionLabel: action === 'review' ? 'Review upload' : 'Send Reminder',
        btnStyle: this.btn(action === 'review' ? 'primary' : 'secondary'),
        onCard: () => this.openDrawer(s.id, def.key),
        onAction: action === 'review' ? ((e) => { e.stopPropagation(); this.openReview(s.id, def.key); }) : ((e) => { e.stopPropagation(); this.openEmail(s.id, def.key); }),
      });
    }));
    items.sort((a, b) => b.score - a.score);
    return items;
  }
  scopedQueue() { const all = this.buildQueueAll(); return this.state.scope === 'mine' ? all.filter((i) => i.pm === this.loggedPm) : all; }
  filteredQueue() { const all = this.scopedQueue(); const f = this.state.queueFilter || 'all'; return f === 'all' ? all : all.filter((i) => i.cat === f); }
  rosterList() {
    const C = this.C(), DOCS = this.DOCS;
    let list = this.visibleSubs();
    if (this.state.missingOnly) list = list.filter((s) => DOCS.some((d) => ['missing', 'rejected', 'expired'].includes(s.docs[d.key].status)));
    const rows = list.map((s) => {
      const cells = DOCS.map((def) => { const meta = this.stampMeta(s.docs[def.key]); return { stampStyle: this.stampStyle(meta, true), stampLabel: meta.label }; });
      let approved = 0; DOCS.forEach((d) => { if (s.docs[d.key].status === 'approved') approved++; });
      const pct = Math.round((approved / 4) * 100), mColor = pct === 100 ? C.ok : pct >= 50 ? C.warn : C.danger;
      const rowPad = '14px';
      return {
        id: s.id, name: s.name, pct, subtitle: s.project + ' · ' + this.pmFor(s.project),
        style: { display: 'grid', gridTemplateColumns: '1.7fr 1fr 1fr 1fr 1fr 1.1fr 0.9fr', gap: '14px', alignItems: 'center', padding: rowPad + ' 16px', borderTop: '1px solid ' + C.line, cursor: 'pointer' },
        cells,
        meter: { fillStyle: { width: pct + '%', height: '100%', background: mColor, borderRadius: '3px' }, label: approved + '/4 · ' + pct + '%', labelStyle: { fontFamily: "'IBM Plex Mono',monospace", fontSize: '11px', color: mColor, marginTop: '5px' } },
        lastActivity: s.audit[0] ? s.audit[0].ts : '—',
        onOpen: () => this.openDrawer(s.id, null),
      };
    });
    rows.sort((a, b) => a.pct - b.pct);
    return rows;
  }

  pager(total, page, onPrev, onNext) {
    const C = this.C();
    const per = this.PER, maxPage = Math.max(0, Math.ceil(total / per) - 1);
    const start = total ? (page * per + 1) : 0, end = Math.min(total, (page + 1) * per);
    const mk = (on) => ({ background: '#fff', color: on ? C.ink : '#B7BEC6', border: '1px solid ' + C.line, borderRadius: '3px', padding: '6px 12px', fontWeight: 600, fontSize: '12.5px', cursor: on ? 'pointer' : 'default' });
    return { show: total > per, label: start + '–' + end + ' of ' + total, onPrev, onNext, prevStyle: mk(page > 0), nextStyle: mk(page < maxPage) };
  }

  getViewModel() {
    const C = this.C(), S = this.state, DOCS = this.DOCS;
    const view = S.view;
    const isDashboard = view === 'dashboard', isSubs = view === 'subs', isProjects = view === 'projects', isDetailPage = view === 'detail';
    const showRoster = isDashboard || isSubs;

    const projects = this.projectNames();
    const projectOptions = ['All projects'].concat(projects);
    const visible = this.visibleSubs();

    // Nav
    const navDef = [['dashboard', 'Dashboard'], ['subs', 'Subcontractors'], ['projects', 'Projects']];
    const navItems = navDef.map(([v, label]) => {
      const active = view === v || (v === 'subs' && isDetailPage);
      return {
        key: v, label, onClick: () => this.setNav(v),
        style: {
          textAlign: 'left', border: 'none', borderRadius: '5px', padding: '9px 12px', fontSize: '14px', fontWeight: active ? 600 : 500,
          background: active ? '#EEF3FE' : 'transparent', color: active ? C.accent : C.ink, cursor: 'pointer',
        },
      };
    });

    // Breadcrumbs
    let crumbDef = [{ label: 'ClearComply', go: 'dashboard' }];
    if (isDashboard) crumbDef.push({ label: 'Dashboard' });
    else if (isSubs) crumbDef.push({ label: 'Subcontractors', go: 'subs' });
    else if (isProjects) crumbDef.push({ label: 'Projects', go: 'projects' });
    else if (isDetailPage) { crumbDef.push({ label: 'Subcontractors', go: 'subs' }); const s = this.findSub(S.selectedSubId); crumbDef.push({ label: s ? s.name : 'Detail' }); }
    const crumbs = crumbDef.map((c, i) => {
      const last = i === crumbDef.length - 1;
      return {
        key: i, label: c.label,
        sepStyle: { color: '#B7BEC6', fontSize: '13px', display: i === 0 ? 'none' : 'inline' },
        style: { fontSize: '13px', fontWeight: last ? 600 : 500, color: last ? C.ink : C.accent, cursor: last ? 'default' : 'pointer' },
        onClick: last ? (() => {}) : (c.go ? (() => this.setNav(c.go)) : this.goHome),
      };
    });

    // KPIs
    let fullN = 0, missRisk = 0, reviewN = 0, expiring = 0, overdue = 0;
    visible.forEach((s) => {
      let allA = true;
      DOCS.forEach((def) => {
        const st = s.docs[def.key].status;
        if (st !== 'approved') allA = false;
        if (['missing', 'rejected', 'expired'].includes(st)) missRisk++;
        if (['needs_review', 'submitted'].includes(st)) reviewN++;
        if (st === 'expiring') expiring++;
        if (st === 'missing' && s.docs[def.key].overdueDays) overdue++;
      });
      if (allA) fullN++;
    });
    const compliantPct = visible.length ? Math.round((fullN / visible.length) * 100) : 0;
    const mkTile = (value, label, color, idx) => ({
      key: idx, value, label,
      style: { padding: '16px 18px', borderLeft: idx ? ('1px solid ' + C.line) : 'none' },
      valueStyle: { fontFamily: "'Barlow Semi Condensed',sans-serif", fontWeight: 700, fontSize: '34px', lineHeight: 1, color },
    });
    const kpis = [
      mkTile(compliantPct + '%', 'Subs fully compliant', C.ink, 0),
      mkTile(missRisk, 'Missing / at-risk items', C.danger, 1),
      mkTile(reviewN, 'Waiting on your review', C.pending, 2),
      mkTile(expiring, 'Insurance expiring ≤30d', C.warn, 3),
      mkTile(overdue, 'Overdue items', C.danger, 4),
    ];

    // Queue + scope + filters + pagination
    const scopedQ = this.scopedQueue();
    const counts = { all: scopedQ.length, review: 0, due: 0, overdue: 0, expiring: 0, rejected: 0 };
    scopedQ.forEach((i) => { counts[i.cat] = (counts[i.cat] || 0) + 1; });
    const filterDef = [['all', 'All'], ['review', 'Needs review'], ['due', 'Due soon'], ['overdue', 'Overdue'], ['expiring', 'Expiring'], ['rejected', 'Rejected']];
    const queueFilters = filterDef.map(([cat, label]) => {
      const active = (S.queueFilter || 'all') === cat;
      return {
        key: cat, label: label + ' (' + (counts[cat] || 0) + ')', onClick: () => this.setQueueFilter(cat),
        style: { border: '1px solid ' + (active ? C.ink : C.line), background: active ? C.ink : '#fff', color: active ? '#fff' : C.inkSoft, borderRadius: '999px', padding: '5px 13px', fontSize: '12.5px', fontWeight: 600, cursor: 'pointer' },
      };
    });
    const scopeToggle = [['mine', 'My items'], ['all', 'All items']].map(([sc, label]) => {
      const active = (S.scope || 'mine') === sc;
      return {
        key: sc, label: sc === 'mine' ? ('My items · ' + this.loggedPm) : label, onClick: () => this.setScope(sc),
        style: { border: '1px solid ' + (active ? C.accent : C.line), background: active ? '#EEF3FE' : '#fff', color: active ? C.accent : C.inkSoft, borderRadius: '3px', padding: '7px 13px', fontSize: '12.5px', fontWeight: 600, cursor: 'pointer' },
      };
    });
    const filtered = this.filteredQueue();
    const qStart = S.queuePage * this.PER;
    const queue = filtered.slice(qStart, qStart + this.PER);
    const queuePager = this.pager(filtered.length, S.queuePage, this.queuePrev, this.queueNext);

    // Roster + pagination
    const rosterAll = this.rosterList();
    const rStart = S.rosterPage * this.PER;
    const roster = rosterAll.slice(rStart, rStart + this.PER);
    const rosterPager = this.pager(rosterAll.length, S.rosterPage, this.rosterPrev, this.rosterNext);
    const missingOnlyStyle = S.missingOnly
      ? { background: C.ink, color: '#fff', border: '1px solid ' + C.ink, borderRadius: '3px', padding: '8px 14px', fontWeight: 600, fontSize: '13px' }
      : { background: '#fff', color: C.inkSoft, border: '1px solid ' + C.line, borderRadius: '3px', padding: '8px 14px', fontWeight: 600, fontSize: '13px' };

    // Projects view
    let projectCards = [];
    if (isProjects) {
      projectCards = projects.map((name) => {
        const subs = S.subs.filter((s) => s.project === name);
        let approved = 0, atRisk = 0;
        subs.forEach((s) => DOCS.forEach((def) => { const st = s.docs[def.key].status; if (st === 'approved') approved++; if (['missing', 'rejected', 'expired', 'expiring'].includes(st)) atRisk++; }));
        const pct = subs.length ? Math.round((approved / (subs.length * 4)) * 100) : 0, mColor = pct >= 80 ? C.ok : pct >= 50 ? C.warn : C.danger;
        return {
          key: name, name, pm: this.pmFor(name), subCount: subs.length, atRisk,
          meterFillStyle: { width: pct + '%', height: '100%', background: mColor, borderRadius: '4px' },
          meterLabel: pct + '% of required documents approved',
          meterLabelStyle: { fontFamily: "'IBM Plex Mono',monospace", fontSize: '11px', color: mColor, marginTop: '6px' },
          onOpen: () => this.set({ projectFilter: name, view: 'subs', drawerOpen: false, rosterPage: 0 }),
        };
      });
    }

    // Detail (drawer or full page)
    let detail = null;
    const s = this.findSub(S.selectedSubId);
    if (s && (S.drawerOpen || isDetailPage)) {
      let approved = 0; DOCS.forEach((d) => { if (s.docs[d.key].status === 'approved') approved++; });
      const pct = Math.round((approved / 4) * 100), mColor = pct === 100 ? C.ok : pct >= 50 ? C.warn : C.danger;
      const reqs = DOCS.map((def) => {
        const doc = s.docs[def.key], st = doc.status, meta = this.stampMeta(doc), focus = (def.key === S.selectedDocKey);
        let metaLine = '';
        if (def.key === 'insurance') metaLine = doc.expiry ? ('Expiry ' + doc.expiry) : 'One-time · expires';
        else if (def.key === 'w9') metaLine = 'One-time submission';
        else metaLine = doc.period ? ('Current period: ' + doc.period) : 'Recurring';
        if (st === 'missing' && doc.overdueDays) metaLine += ' · overdue ' + doc.overdueDays + 'd';
        if (st === 'rejected') metaLine = 'Reason: ' + doc.reason;
        if (st === 'expiring') metaLine = 'Expiry ' + doc.expiry + ' · ' + doc.expiringDays + 'd out';
        const rcat = ((st === 'missing' && doc.overdueDays) || st === 'expired') ? 'overdue' : ((st === 'missing' && doc.dueInDays != null && doc.dueInDays < 3) ? 'due' : '');
        const esc = rcat ? this.escFor(doc, rcat) : null;
        const actions = [];
        if (['needs_review', 'submitted'].includes(st)) actions.push({ label: 'Review upload', style: this.btn('primary'), onClick: () => this.openReview(s.id, def.key) });
        if (['missing', 'expired', 'rejected', 'expiring'].includes(st)) actions.push({ label: 'Send reminder', style: this.btn(actions.length ? 'secondary' : 'primary'), onClick: () => this.openEmail(s.id, def.key) });
        if ((st === 'missing' && doc.overdueDays) || st === 'expired') actions.push({ label: 'Escalate to GC', style: this.btn('secondary'), onClick: () => this.escalateToGC(s.id, def.key) });
        if (['missing', 'expired', 'rejected'].includes(st)) actions.push({ label: 'Mark received', style: this.btn('secondary'), onClick: () => this.markReceived(s.id, def.key) });
        return {
          key: def.key, label: def.label, cadence: def.cadence, metaLine, esc, hasEsc: !!esc, stampStyle: this.stampStyle(meta), stampLabel: meta.label,
          actions: actions.map((a, ai) => ({ ...a, key: ai })),
          rowStyle: { padding: '15px 18px', borderBottom: '1px solid #EEF0F2', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', background: focus ? '#F5F9FF' : 'transparent' },
          rowStyleDrawer: { padding: '13px 16px', borderBottom: '1px solid #EEF0F2', background: focus ? '#F5F9FF' : 'transparent' },
        };
      });
      const audit = s.audit.map((e, ai) => ({ key: ai, actor: e.actor, ts: e.ts, text: e.text, chipStyle: this.chipStyle(e.actor) }));
      detail = {
        name: s.name, project: s.project, pm: this.pmFor(s.project), email: s.email,
        meterFillStyle: { width: pct + '%', height: '100%', background: mColor, borderRadius: '4px' },
        meterLabel: approved + '/4 required approved · ' + pct + '%',
        meterLabelStyle: { fontFamily: "'IBM Plex Mono',monospace", fontSize: '12px', color: mColor, marginTop: '6px' },
        reqs, audit, onUpload: () => this.simulateUpload(s.id),
      };
    }

    // Modals
    const email = S.email || { to: '', subject: '', body: '', subName: '' };
    let review = null;
    if (S.reviewOpen && S.review) {
      const rs = this.findSub(S.review.subId), def = DOCS.find((d) => d.key === S.review.docKey), doc = rs.docs[S.review.docKey];
      const built = this.extraction(def.key, doc);
      review = {
        docLabel: def.label, subName: rs.name, fields: built.fields.map((f, fi) => ({ ...f, key: fi })),
        checks: built.checks.map((c, ci) => ({ key: ci, icon: c.ok ? '✓' : '✗', iconStyle: { color: c.ok ? C.ok : C.danger, fontWeight: 700, fontSize: '15px', lineHeight: 1.2 }, text: c.text })),
        rejecting: !!S.review.rejecting, notRejecting: !S.review.rejecting,
      };
    }

    return {
      goHome: this.goHome, navItems, crumbs,
      projectFilter: S.projectFilter, onProjectChange: this.onProjectChange, projectOptions, runSweep: this.runSweep, toast: S.toast,
      isDashboard, isSubs, isProjects, isDetailPage, showRoster,
      kpis,
      queueFilters, scopeToggle, queue, queueEmpty: filtered.length === 0, queueHasItems: filtered.length > 0,
      queueCountLabel: filtered.length + ' items need action', queuePager,
      toggleMissingOnly: this.toggleMissingOnly, missingOnlyStyle,
      roster, rosterEmpty: rosterAll.length === 0, rosterPager,
      projectCards,
      drawerOpen: S.drawerOpen, closeDrawer: this.closeDrawer, viewFullPage: this.viewFullPage, backFromDetail: this.backFromDetail,
      detail,
      emailOpen: S.emailOpen, email, onEmailSubject: this.onEmailSubject, onEmailBody: this.onEmailBody, sendEmail: this.sendEmail,
      closeModal: this.closeModal, stop: this.stop,
      reviewOpen: S.reviewOpen, review, approve: this.approve, startReject: this.startReject, cancelReject: this.cancelReject,
      confirmReject: this.confirmReject, rejectReason: S.rejectReason, onRejectReason: this.onRejectReason,

      // routing + subcontractor upload portal
      route: S.route,
      portal: (S.route && S.route.name === 'upload') ? this.buildPortal(S.route.subId, S.route.token) : null,
      exitPortal: this.exitPortal, portalUpload: this.portalUpload,

      // onboarding (create project / subcontractor)
      onboardOpen: S.onboardOpen, onboardMode: S.onboardMode, onboardError: S.onboardError, onboardCreatedLink: S.onboardCreatedLink,
      onboardSub: S.onboardSub, onboardProject: S.onboardProject, onboardProjectNames: projects,
      openOnboard: this.openOnboard, closeOnboard: this.closeOnboard, setOnboardMode: this.setOnboardMode,
      onOnboardSub: this.onOnboardSub, onOnboardProject: this.onOnboardProject,
      submitOnboardSub: this.submitOnboardSub, submitOnboardProject: this.submitOnboardProject,
      copyUploadLink: this.copyUploadLink, openUploadLink: this.openUploadLink,
    };
  }
}
