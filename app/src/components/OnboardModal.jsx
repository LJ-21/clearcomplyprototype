const L = '#E3E1DB', INK = '#1C2B39', SOFT = '#5A6B7A', ACCENT = '#0E5FD8';
const inputStyle = { width: '100%', border: '1px solid ' + L, borderRadius: 3, padding: '9px 11px', fontSize: '13.5px' };
const labelStyle = { fontSize: 12, color: SOFT, fontWeight: 600, marginBottom: 5, display: 'block' };
const barlow = "'Barlow Semi Condensed',sans-serif";

function Field({ label, children }) {
  return (
    <label style={{ display: 'block' }}>
      <span style={labelStyle}>{label}</span>
      {children}
    </label>
  );
}

export default function OnboardModal({ vm }) {
  if (!vm.onboardOpen) return null;
  const created = vm.onboardCreatedLink;
  const mode = vm.onboardMode;

  const tab = (key, text) => {
    const active = mode === key;
    return (
      <button
        onClick={() => vm.setOnboardMode(key)}
        style={{ flex: 1, padding: '8px 12px', fontSize: 13, fontWeight: 600, borderRadius: 3, border: '1px solid ' + (active ? ACCENT : L), background: active ? '#EEF3FE' : '#fff', color: active ? ACCENT : SOFT }}
      >{text}</button>
    );
  };

  return (
    <div onClick={vm.closeOnboard} style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgb(28 43 57 / 0.42)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div onClick={vm.stop} style={{ position: 'relative', background: '#fff', borderRadius: 8, width: '100%', maxWidth: 520, boxShadow: '0 20px 60px rgb(28 43 57 / 0.3)', overflow: 'hidden' }}>
        <button onClick={vm.closeOnboard} aria-label="Close" className="cc-close-btn" style={{ position: 'absolute', top: 12, right: 12, background: '#fff', border: '1px solid ' + L, borderRadius: 3, width: 30, height: 30, fontSize: 16, color: SOFT, lineHeight: 1 }}>×</button>

        <div style={{ padding: '16px 20px', borderBottom: '1px solid ' + L }}>
          <div style={{ fontFamily: barlow, fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: SOFT }}>Onboarding</div>
          <div style={{ fontFamily: barlow, fontWeight: 700, fontSize: 20, marginTop: 2 }}>{created ? 'Subcontractor onboarded' : 'Add to ClearComply'}</div>
        </div>

        {created ? (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{ color: '#1E7F4F', fontSize: 18, fontWeight: 700, lineHeight: 1.3 }}>✓</div>
              <div style={{ fontSize: 13.5, lineHeight: 1.55 }}>
                <strong>{created.subName}</strong> was added and their requirement set was auto-generated. A secure upload link was emailed to them automatically — here it is if you want to share it directly:
              </div>
            </div>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, background: '#F7F6F3', border: '1px solid ' + L, borderRadius: 4, padding: '10px 12px', wordBreak: 'break-all', color: INK }}>{created.link}</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button onClick={vm.copyUploadLink} className="cc-outline-btn" style={{ background: '#fff', color: INK, border: '1px solid ' + L, borderRadius: 3, padding: '9px 14px', fontWeight: 600, fontSize: 13 }}>Copy link</button>
              <button onClick={vm.openUploadLink} className="cc-primary-btn" style={{ background: ACCENT, color: '#fff', border: '1px solid ' + ACCENT, borderRadius: 3, padding: '9px 14px', fontWeight: 600, fontSize: 13 }}>Open upload page →</button>
              <div style={{ flex: 1 }} />
              <button onClick={vm.closeOnboard} style={{ background: '#fff', color: SOFT, border: '1px solid ' + L, borderRadius: 3, padding: '9px 14px', fontWeight: 600, fontSize: 13 }}>Done</button>
            </div>
          </div>
        ) : (
          <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              {tab('sub', 'Subcontractor')}
              {tab('project', 'Project')}
            </div>

            {mode === 'sub' ? (
              <>
                <Field label="Company name">
                  <input style={inputStyle} value={vm.onboardSub.name} onChange={(e) => vm.onOnboardSub('name', e)} placeholder="e.g. Riverline Steel" />
                </Field>
                <Field label="Trade">
                  <input style={inputStyle} value={vm.onboardSub.trade} onChange={(e) => vm.onOnboardSub('trade', e)} placeholder="e.g. Structural Steel" />
                </Field>
                <Field label="Project">
                  <select style={inputStyle} value={vm.onboardSub.project} onChange={(e) => vm.onOnboardSub('project', e)}>
                    <option value="">Select a project…</option>
                    {vm.onboardProjectNames.map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </Field>
                <Field label="Contact email">
                  <input style={inputStyle} value={vm.onboardSub.email} onChange={(e) => vm.onOnboardSub('email', e)} placeholder="billing@subcontractor.com" />
                </Field>
                <div style={{ fontSize: 12, color: SOFT, lineHeight: 1.5 }}>On create, ClearComply generates the four required documents (Insurance, W-9, weekly Payroll, monthly Workforce) and a secure upload link for the subcontractor.</div>
              </>
            ) : (
              <>
                <Field label="Project name">
                  <input style={inputStyle} value={vm.onboardProject.name} onChange={(e) => vm.onOnboardProject('name', e)} placeholder="e.g. Lakeside Pavilion" />
                </Field>
                <Field label="Project manager">
                  <input style={inputStyle} value={vm.onboardProject.pm} onChange={(e) => vm.onOnboardProject('pm', e)} placeholder="e.g. Dana Ruiz" />
                </Field>
                <div style={{ fontSize: 12, color: SOFT, lineHeight: 1.5 }}>Create the project first, then add subcontractors to it.</div>
              </>
            )}

            {vm.onboardError && <div style={{ fontSize: 12.5, color: '#B3261E', fontWeight: 600 }}>{vm.onboardError}</div>}
          </div>
        )}

        {!created && (
          <div style={{ padding: '14px 20px', borderTop: '1px solid ' + L, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button onClick={vm.closeOnboard} style={{ background: '#fff', color: INK, border: '1px solid ' + L, borderRadius: 3, padding: '9px 16px', fontWeight: 600, fontSize: '13.5px' }}>Cancel</button>
            <button onClick={mode === 'sub' ? vm.submitOnboardSub : vm.submitOnboardProject} className="cc-primary-btn" style={{ background: ACCENT, color: '#fff', border: '1px solid ' + ACCENT, borderRadius: 3, padding: '9px 16px', fontWeight: 600, fontSize: '13.5px' }}>
              {mode === 'sub' ? 'Create & generate link' : 'Create project'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
