const L = '#E3E1DB', INK = '#1C2B39', SOFT = '#5A6B7A', ACCENT = '#0E5FD8', OK = '#1E7F4F';
const inputStyle = { width: '100%', border: '1px solid ' + L, borderRadius: 3, padding: '9px 11px', fontSize: '13.5px' };
const labelStyle = { fontSize: 12, color: SOFT, fontWeight: 600, marginBottom: 5, display: 'block' };
const barlow = "'Barlow Semi Condensed',sans-serif";

function Field({ label, children }) {
  return <label style={{ display: 'block' }}><span style={labelStyle}>{label}</span>{children}</label>;
}

function Stepper({ step }) {
  const steps = ['Details', 'Review', 'Done'];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
      {steps.map((s, i) => {
        const n = i + 1, active = n === step, done = n < step;
        return (
          <span key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: active ? ACCENT : (done ? OK : SOFT), fontWeight: 600, fontSize: 12 }}>
              <span style={{ width: 18, height: 18, borderRadius: 999, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#fff', background: active ? ACCENT : (done ? OK : '#B7BEC6') }}>{done ? '✓' : n}</span>
              {s}
            </span>
            {i < steps.length - 1 && <span style={{ width: 18, height: 1, background: L }} />}
          </span>
        );
      })}
    </div>
  );
}

export default function OnboardModal({ vm }) {
  if (!vm.onboardOpen) return null;
  const created = vm.onboardCreatedLink;
  const mode = vm.onboardMode;
  const step = vm.onboardStep;
  const sub = vm.onboardSub;

  const tab = (key, text) => {
    const active = mode === key;
    return (
      <button onClick={() => vm.setOnboardMode(key)} style={{ flex: 1, padding: '8px 12px', fontSize: 13, fontWeight: 600, borderRadius: 3, border: '1px solid ' + (active ? ACCENT : L), background: active ? '#EEF3FE' : '#fff', color: active ? ACCENT : SOFT }}>{text}</button>
    );
  };

  const eyebrow = created ? 'Onboarding complete' : (mode === 'sub' ? 'Add subcontractor to a project' : 'Create project');
  const title = created ? 'Subcontractor onboarded' : (mode === 'sub' ? 'Onboard subcontractor' : 'New project');

  return (
    <div onClick={vm.closeOnboard} style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgb(28 43 57 / 0.42)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div onClick={vm.stop} style={{ position: 'relative', background: '#fff', borderRadius: 8, width: '100%', maxWidth: 540, boxShadow: '0 20px 60px rgb(28 43 57 / 0.3)', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
        <button onClick={vm.closeOnboard} aria-label="Close" className="cc-close-btn" style={{ position: 'absolute', top: 12, right: 12, background: '#fff', border: '1px solid ' + L, borderRadius: 3, width: 30, height: 30, fontSize: 16, color: SOFT, lineHeight: 1 }}>×</button>

        <div style={{ padding: '16px 20px', borderBottom: '1px solid ' + L }}>
          <div style={{ fontFamily: barlow, fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: SOFT }}>{eyebrow}</div>
          <div style={{ fontFamily: barlow, fontWeight: 700, fontSize: 20, marginTop: 2 }}>{title}</div>
        </div>

        {created ? (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto', flex: 1, minHeight: 0 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{ color: OK, fontSize: 18, fontWeight: 700, lineHeight: 1.3 }}>✓</div>
              <div style={{ fontSize: 13.5, lineHeight: 1.55 }}><strong>{created.subName}</strong> was added to <strong>{created.project}</strong>. Their {created.docCount}-document requirement set is now tracked on the dashboard.</div>
            </div>

            <div>
              <div style={{ fontSize: 12, color: SOFT, fontWeight: 600, marginBottom: 6 }}>Secure upload link (emailed automatically)</div>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, background: '#F7F6F3', border: '1px solid ' + L, borderRadius: 4, padding: '10px 12px', wordBreak: 'break-all', color: INK }}>{created.link}</div>
            </div>

            <div style={{ background: '#F7F9FC', border: '1px solid ' + L, borderRadius: 6, padding: '12px 14px' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: SOFT, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>What happens next</div>
              {[
                'Welcome email with the secure link sent to ' + created.email + '.',
                created.docCount + ' document requests created and tracked on the dashboard.',
                'Automated reminder schedule started — you’re only pinged for exceptions and reviews.',
              ].map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13, lineHeight: 1.5, marginBottom: i < 2 ? 6 : 0 }}>
                  <span style={{ color: ACCENT }}>›</span><span>{t}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button onClick={vm.copyUploadLink} className="cc-outline-btn" style={{ background: '#fff', color: INK, border: '1px solid ' + L, borderRadius: 3, padding: '9px 14px', fontWeight: 600, fontSize: 13 }}>Copy link</button>
              <button onClick={vm.openUploadLink} className="cc-primary-btn" style={{ background: ACCENT, color: '#fff', border: '1px solid ' + ACCENT, borderRadius: 3, padding: '9px 14px', fontWeight: 600, fontSize: 13 }}>Preview upload page →</button>
              <div style={{ flex: 1 }} />
              <button onClick={vm.closeOnboard} style={{ background: '#fff', color: SOFT, border: '1px solid ' + L, borderRadius: 3, padding: '9px 14px', fontWeight: 600, fontSize: 13 }}>Done</button>
            </div>
          </div>
        ) : (
          <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto', flex: 1, minHeight: 0 }}>
            {mode === 'sub' && <Stepper step={step} />}

            {mode === 'project' && (
              <div style={{ display: 'flex', gap: 8 }}>{tab('sub', 'Subcontractor')}{tab('project', 'Project')}</div>
            )}

            {mode === 'sub' && step === 1 && (
              <>
                <div style={{ display: 'flex', gap: 8 }}>{tab('sub', 'Subcontractor')}{tab('project', 'Project')}</div>
                <Field label="Project">
                  <select style={inputStyle} value={sub.project} onChange={(e) => vm.onOnboardSub('project', e)}>
                    <option value="">Select an existing project…</option>
                    {vm.onboardProjectNames.map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </Field>
                {sub.project && (
                  <div style={{ background: '#EEF3FE', border: '1px solid #CFE0FB', borderRadius: 6, padding: '11px 13px', fontSize: 12.5, lineHeight: 1.5, color: INK }}>
                    <div>Project manager: <strong>{vm.onboardProjectPm}</strong></div>
                    <div style={{ marginTop: 4 }}>Requires <strong>{vm.onboardReqPreview.length}</strong> documents: {vm.onboardReqPreview.map((d) => d.label).join(', ')}.</div>
                  </div>
                )}
                <Field label="Company name">
                  <input style={inputStyle} value={sub.name} onChange={(e) => vm.onOnboardSub('name', e)} placeholder="e.g. Riverline Steel" />
                </Field>
                <Field label="Trade">
                  <input style={inputStyle} value={sub.trade} onChange={(e) => vm.onOnboardSub('trade', e)} placeholder="e.g. Structural Steel" />
                </Field>
                <Field label="Point of contact">
                  <input style={inputStyle} value={sub.contactName} onChange={(e) => vm.onOnboardSub('contactName', e)} placeholder="e.g. Jordan Lee" />
                </Field>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flex: 1 }}><Field label="Email"><input style={inputStyle} value={sub.email} onChange={(e) => vm.onOnboardSub('email', e)} placeholder="billing@subcontractor.com" /></Field></div>
                  <div style={{ flex: 1 }}><Field label="Phone"><input style={inputStyle} value={sub.phone} onChange={(e) => vm.onOnboardSub('phone', e)} placeholder="(555) 123-4567" /></Field></div>
                </div>
              </>
            )}

            {mode === 'sub' && step === 2 && (
              <>
                <div style={{ border: '1px solid ' + L, borderRadius: 6, padding: '14px' }}>
                  <div style={{ fontFamily: barlow, fontWeight: 700, fontSize: 16 }}>{sub.name}</div>
                  <div style={{ fontSize: 12.5, color: SOFT, marginTop: 2 }}>{(sub.trade || '—')} · {sub.email}</div>
                  <div style={{ fontSize: 12.5, color: SOFT, marginTop: 6 }}>Joining <strong style={{ color: INK }}>{sub.project}</strong> · PM {vm.onboardProjectPm}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: SOFT, fontWeight: 600, marginBottom: 8 }}>Requirement set generated on confirm</div>
                  {vm.onboardReqPreview.map((d) => (
                    <div key={d.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #EEF0F2' }}>
                      <div><div style={{ fontSize: 13.5, fontWeight: 600 }}>{d.label}</div><div style={{ fontSize: 11.5, color: SOFT }}>{d.cadence}</div></div>
                      <span style={{ fontFamily: barlow, fontWeight: 600, fontSize: 10.5, letterSpacing: '0.04em', textTransform: 'uppercase', border: '2px solid ' + SOFT, background: '#EEF0F2', color: SOFT, borderRadius: 3, padding: '2px 8px' }}>Requested</span>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 12.5, color: SOFT, lineHeight: 1.5 }}>On confirm, ClearComply emails <strong style={{ color: INK }}>{sub.email}</strong> a secure upload link and starts the automated reminder schedule (day 0 → +10 escalation). You’ll only be pinged for exceptions and reviews.</div>
              </>
            )}

            {mode === 'project' && (() => {
              const p = vm.onboardProject;
              const pmNew = p.pmSelect === '__new__';
              const gcNew = p.gcSelect === '__new__';
              const gcExisting = p.gcSelect && !gcNew;
              return (
                <>
                  <Field label="Project name">
                    <input style={inputStyle} value={p.name} onChange={(e) => vm.onOnboardProject('name', e)} placeholder="e.g. Lakeside Pavilion" />
                  </Field>
                  <Field label="Location / address">
                    <input style={inputStyle} value={p.location} onChange={(e) => vm.onOnboardProject('location', e)} placeholder="e.g. 1200 Harbor Blvd, San Francisco, CA" />
                  </Field>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ flex: 1 }}><Field label="Start date"><input type="date" style={inputStyle} value={p.startDate} onChange={(e) => vm.onOnboardProject('startDate', e)} /></Field></div>
                    <div style={{ flex: 1 }}><Field label="Target completion"><input type="date" style={inputStyle} value={p.endDate} onChange={(e) => vm.onOnboardProject('endDate', e)} /></Field></div>
                  </div>
                  <Field label="Project manager">
                    <select style={inputStyle} value={p.pmSelect} onChange={vm.onOnboardPmSelect}>
                      <option value="">Select project manager…</option>
                      {vm.onboardPms.map((n) => <option key={n} value={n}>{n}</option>)}
                      <option value="__new__">+ Add new project manager…</option>
                    </select>
                  </Field>
                  {pmNew && (
                    <Field label="New project manager name">
                      <input style={inputStyle} value={p.pmNew} onChange={(e) => vm.onOnboardProject('pmNew', e)} placeholder="e.g. Dana Ruiz" />
                    </Field>
                  )}

                  <div style={{ borderTop: '1px solid ' + L, paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ fontSize: 12, color: SOFT, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>General contractor · escalation path</div>
                    <Field label="General contractor">
                      <select style={inputStyle} value={p.gcSelect} onChange={vm.onOnboardGcSelect}>
                        <option value="">No GC yet</option>
                        {vm.onboardGcs.map((g) => <option key={g.company} value={g.company}>{g.company}</option>)}
                        <option value="__new__">+ Add new GC…</option>
                      </select>
                    </Field>
                    {gcExisting && (
                      <div style={{ fontSize: 12.5, color: SOFT, background: '#FBFBFA', border: '1px solid ' + L, borderRadius: 6, padding: '10px 12px', lineHeight: 1.5 }}>
                        <div>Contact: <strong style={{ color: INK }}>{p.gcContact || '—'}</strong></div>
                        <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11.5, marginTop: 2 }}>{p.gcEmail}{p.gcEmail && p.gcPhone ? ' · ' : ''}{p.gcPhone}</div>
                      </div>
                    )}
                    {gcNew && (
                      <>
                        <Field label="GC company"><input style={inputStyle} value={p.gcCompany} onChange={(e) => vm.onOnboardProject('gcCompany', e)} placeholder="e.g. Turner–Ridgeline JV" /></Field>
                        <Field label="Point of contact"><input style={inputStyle} value={p.gcContact} onChange={(e) => vm.onOnboardProject('gcContact', e)} placeholder="e.g. Mark Feld" /></Field>
                        <div style={{ display: 'flex', gap: 12 }}>
                          <div style={{ flex: 1 }}><Field label="Email"><input style={inputStyle} value={p.gcEmail} onChange={(e) => vm.onOnboardProject('gcEmail', e)} placeholder="pm@gc.com" /></Field></div>
                          <div style={{ flex: 1 }}><Field label="Phone"><input style={inputStyle} value={p.gcPhone} onChange={(e) => vm.onOnboardProject('gcPhone', e)} placeholder="(555) 123-4567" /></Field></div>
                        </div>
                      </>
                    )}
                    <Field label="Other important info">
                      <textarea style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }} rows={2} value={p.notes} onChange={(e) => vm.onOnboardProject('notes', e)} placeholder="Insurance minimums, prevailing-wage rules, special requirements…" />
                    </Field>
                  </div>
                  <div style={{ fontSize: 12, color: SOFT, lineHeight: 1.5 }}>The GC contact is the escalation target when a subcontractor goes non-responsive. Create the project first, then onboard subs to it.</div>
                </>
              );
            })()}

            {vm.onboardError && <div style={{ fontSize: 12.5, color: '#B3261E', fontWeight: 600 }}>{vm.onboardError}</div>}
          </div>
        )}

        {!created && (
          <div style={{ padding: '14px 20px', borderTop: '1px solid ' + L, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            {mode === 'sub' && step === 2
              ? <button onClick={vm.onboardBack} style={{ background: '#fff', color: INK, border: '1px solid ' + L, borderRadius: 3, padding: '9px 16px', fontWeight: 600, fontSize: '13.5px', marginRight: 'auto' }}>Back</button>
              : <button onClick={vm.closeOnboard} style={{ background: '#fff', color: INK, border: '1px solid ' + L, borderRadius: 3, padding: '9px 16px', fontWeight: 600, fontSize: '13.5px', marginRight: 'auto' }}>Cancel</button>}
            {mode === 'project' && <button onClick={vm.submitOnboardProject} className="cc-primary-btn" style={{ background: ACCENT, color: '#fff', border: '1px solid ' + ACCENT, borderRadius: 3, padding: '9px 16px', fontWeight: 600, fontSize: '13.5px' }}>Create project</button>}
            {mode === 'sub' && step === 1 && <button onClick={vm.onboardNext} className="cc-primary-btn" style={{ background: ACCENT, color: '#fff', border: '1px solid ' + ACCENT, borderRadius: 3, padding: '9px 16px', fontWeight: 600, fontSize: '13.5px' }}>Continue →</button>}
            {mode === 'sub' && step === 2 && <button onClick={vm.submitOnboardSub} className="cc-primary-btn" style={{ background: ACCENT, color: '#fff', border: '1px solid ' + ACCENT, borderRadius: 3, padding: '9px 16px', fontWeight: 600, fontSize: '13.5px' }}>Confirm &amp; onboard</button>}
          </div>
        )}
      </div>
    </div>
  );
}
