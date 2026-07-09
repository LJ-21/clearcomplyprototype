import { ReqRowDrawer, AuditLog } from './DetailReqs.jsx';

export default function Drawer({ vm }) {
  if (!vm.drawerOpen || !vm.detail) return null;
  const { detail } = vm;
  return (
    <>
      <div onClick={vm.closeDrawer} style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgb(28 43 57 / 0.32)' }} />
      <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 41, width: '100%', maxWidth: 560, background: '#fff', boxShadow: '-8px 0 40px rgb(28 43 57 / 0.22)', display: 'flex', flexDirection: 'column', animation: 'ccSlideIn 0.18s ease' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E3E1DB', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "'Barlow Semi Condensed',sans-serif", fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#5A6B7A' }}>{detail.project} · PM {detail.pm}</div>
            <div style={{ fontFamily: "'Barlow Semi Condensed',sans-serif", fontWeight: 700, fontSize: 23, marginTop: 1 }}>{detail.name}</div>
            {detail.contactName && <div style={{ fontSize: '12.5px', color: '#5A6B7A', marginTop: 3 }}>Contact · <span style={{ color: '#1C2B39', fontWeight: 600 }}>{detail.contactName}</span></div>}
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '12.5px', color: '#5A6B7A', marginTop: 2 }}>{detail.email}{detail.phone ? ' · ' + detail.phone : ''}</div>
          </div>
          <button onClick={vm.viewFullPage} className="cc-outline-btn" style={{ background: '#fff', color: '#1C2B39', border: '1px solid #E3E1DB', borderRadius: 3, padding: '7px 12px', fontWeight: 600, fontSize: '12.5px', whiteSpace: 'nowrap' }}>View full page</button>
          <button onClick={vm.closeDrawer} aria-label="Close" className="cc-close-btn" style={{ background: '#fff', border: '1px solid #E3E1DB', borderRadius: 3, width: 32, height: 32, fontSize: 17, color: '#5A6B7A', flexShrink: 0, lineHeight: 1 }}>×</button>
        </div>
        <div style={{ overflowY: 'auto', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <div style={{ height: 8, background: '#EEF0F2', borderRadius: 4, overflow: 'hidden' }}><div style={detail.meterFillStyle} /></div>
            <div style={detail.meterLabelStyle}>{detail.meterLabel}</div>
          </div>
          {detail.gc && (
            <div style={{ border: '1px solid #E3E1DB', borderRadius: 6, padding: '11px 14px', background: '#FBFBFA' }}>
              <div style={{ fontFamily: "'Barlow Semi Condensed',sans-serif", fontWeight: 600, fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#8A93A0' }}>Escalation contact · GC</div>
              <div style={{ fontSize: 13, fontWeight: 600, marginTop: 3 }}>{detail.gc.company}{detail.gc.contact ? ' · ' + detail.gc.contact : ''}</div>
              {(detail.gc.email || detail.gc.phone) && <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '11.5px', color: '#5A6B7A', marginTop: 2 }}>{detail.gc.email}{detail.gc.email && detail.gc.phone ? ' · ' : ''}{detail.gc.phone}</div>}
            </div>
          )}
          <section style={{ border: '1px solid #E3E1DB', borderRadius: 6, overflow: 'hidden' }}>
            <h3 style={{ fontFamily: "'Barlow Semi Condensed',sans-serif", fontWeight: 700, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0, padding: '12px 16px', borderBottom: '1px solid #E3E1DB', background: '#FBFBFA' }}>Required documents</h3>
            {detail.reqs.map((req) => <ReqRowDrawer key={req.key} req={req} />)}
          </section>
          <section>
            <div onClick={detail.onUpload} className="cc-dropzone" style={{ border: '1.5px dashed #C7CDD4', borderRadius: 6, padding: 20, textAlign: 'center', cursor: 'pointer', background: '#FBFBFA' }}>
              <div style={{ fontFamily: "'Barlow Semi Condensed',sans-serif", fontWeight: 600, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Drop a document or browse</div>
              <div style={{ fontSize: 12, color: '#5A6B7A', marginTop: 5 }}>Simulates a subcontractor upload · routes to your review</div>
            </div>
          </section>
          <section style={{ border: '1px solid #E3E1DB', borderRadius: 6, overflow: 'hidden' }}>
            <h3 style={{ fontFamily: "'Barlow Semi Condensed',sans-serif", fontWeight: 700, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0, padding: '12px 16px', borderBottom: '1px solid #E3E1DB', background: '#FBFBFA' }}>Activity log · audit trail</h3>
            <AuditLog audit={detail.audit} drawer />
          </section>
        </div>
      </div>
    </>
  );
}
