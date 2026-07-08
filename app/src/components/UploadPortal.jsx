const L = '#E3E1DB', INK = '#1C2B39', SOFT = '#5A6B7A', ACCENT = '#0E5FD8', OK = '#1E7F4F';
const barlow = "'Barlow Semi Condensed',sans-serif";

function Brand() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 30, height: 30, borderRadius: 5, background: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: barlow, fontWeight: 700, fontSize: 18 }}>C</div>
      <div style={{ fontFamily: barlow, fontWeight: 700, fontSize: 20, letterSpacing: '0.01em' }}>ClearComply</div>
    </div>
  );
}

export default function UploadPortal({ vm }) {
  const p = vm.portal;
  const wrap = { minHeight: '100vh', background: '#F7F6F3', color: INK, fontFamily: 'Inter,system-ui,sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 20px' };

  if (!p || !p.valid) {
    return (
      <div style={wrap}>
        <div style={{ width: '100%', maxWidth: 560 }}>
          <Brand />
          <div style={{ background: '#fff', border: '1px solid ' + L, borderRadius: 8, padding: 28, marginTop: 20, textAlign: 'center' }}>
            <div style={{ fontFamily: barlow, fontWeight: 700, fontSize: 20 }}>This upload link isn’t valid</div>
            <div style={{ color: SOFT, fontSize: 14, marginTop: 8, lineHeight: 1.6 }}>The link may have expired or been mistyped. Please contact your project’s compliance team for a new secure link.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={wrap}>
      <div style={{ width: '100%', maxWidth: 640 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Brand />
          <button onClick={vm.exitPortal} style={{ background: '#fff', border: '1px solid ' + L, borderRadius: 3, padding: '6px 12px', fontSize: 12.5, fontWeight: 600, color: SOFT }}>Exit demo portal</button>
        </div>

        <div style={{ background: '#fff', border: '1px solid ' + L, borderRadius: 8, boxShadow: '0 1px 2px rgb(28 43 57 / 0.06)', marginTop: 18, overflow: 'hidden' }}>
          <div style={{ padding: '20px 22px', borderBottom: '1px solid ' + L }}>
            <div style={{ fontFamily: barlow, fontWeight: 700, fontSize: 22 }}>Document upload</div>
            <div style={{ fontSize: 13.5, color: SOFT, marginTop: 4 }}>
              <strong style={{ color: INK }}>{p.subName}</strong> · {p.trade} · {p.project}
            </div>
          </div>

          <div style={{ padding: '14px 22px', background: p.allSubmitted ? '#E7F4EC' : '#EEF3FE', borderBottom: '1px solid ' + L, fontSize: 13.5, color: p.allSubmitted ? OK : ACCENT, fontWeight: 600 }}>
            {p.allSubmitted
              ? 'All required documents submitted — nothing outstanding. Thank you!'
              : p.outstandingCount + ' document' + (p.outstandingCount === 1 ? '' : 's') + ' still needed to complete your compliance.'}
          </div>

          <div>
            {p.items.map((it) => (
              <div key={it.key} style={{ padding: '16px 22px', borderBottom: '1px solid #EEF0F2', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{it.label}</div>
                  <div style={{ fontSize: 12.5, color: SOFT, marginTop: 2 }}>{it.cadence}</div>
                  {it.reason && <div style={{ fontSize: 12.5, color: '#B3261E', marginTop: 4 }}>Returned: {it.reason}</div>}
                </div>
                <span style={it.stampStyle}>{it.stampLabel}</span>
                {it.outstanding && (
                  <button onClick={it.onUpload} className="cc-primary-btn" style={{ background: ACCENT, color: '#fff', border: '1px solid ' + ACCENT, borderRadius: 3, padding: '8px 16px', fontWeight: 600, fontSize: 13 }}>Upload</button>
                )}
                {it.pending && <span style={{ fontSize: 12.5, color: SOFT, fontWeight: 600 }}>Received ✓</span>}
                {it.done && <span style={{ fontSize: 12.5, color: OK, fontWeight: 600 }}>Approved ✓</span>}
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 12, color: '#8A93A0', textAlign: 'center', marginTop: 16 }}>Secured by ClearComply · your uploads route directly to the compliance team for review.</div>
      </div>
    </div>
  );
}
