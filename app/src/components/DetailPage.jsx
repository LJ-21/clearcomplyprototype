import { ReqRow, AuditLog } from './DetailReqs.jsx';

export default function DetailPage({ vm }) {
  const { detail } = vm;
  if (!detail) return null;
  return (
    <>
      <button onClick={vm.backFromDetail} style={{ background: 'none', border: 'none', padding: 0, color: '#0E5FD8', fontWeight: 600, fontSize: '13.5px', marginBottom: 14 }}>← Back</button>
      <div style={{ background: '#fff', border: '1px solid #E3E1DB', borderRadius: 6, padding: 22, marginBottom: 20, boxShadow: '0 1px 2px rgb(28 43 57 / 0.06)', display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 240 }}>
          <div style={{ fontFamily: "'Barlow Semi Condensed',sans-serif", fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#5A6B7A' }}>{detail.project} · PM {detail.pm}</div>
          <h1 style={{ fontFamily: "'Barlow Semi Condensed',sans-serif", fontWeight: 700, fontSize: 30, margin: '4px 0 6px' }}>{detail.name}</h1>
          {detail.contactName && <div style={{ fontSize: 13, color: '#5A6B7A', marginBottom: 2 }}>Contact · <span style={{ color: '#1C2B39', fontWeight: 600 }}>{detail.contactName}</span></div>}
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 13, color: '#5A6B7A' }}>{detail.email}{detail.phone ? ' · ' + detail.phone : ''}</div>
          {detail.gc && (
            <div style={{ marginTop: 12, padding: '10px 12px', background: '#FBFBFA', border: '1px solid #EEF0F2', borderRadius: 6, maxWidth: 340 }}>
              <div style={{ fontFamily: "'Barlow Semi Condensed',sans-serif", fontWeight: 600, fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#8A93A0' }}>Escalation contact · GC</div>
              <div style={{ fontSize: 13, fontWeight: 600, marginTop: 3 }}>{detail.gc.company}{detail.gc.contact ? ' · ' + detail.gc.contact : ''}</div>
              {(detail.gc.email || detail.gc.phone) && <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '11.5px', color: '#5A6B7A', marginTop: 2 }}>{detail.gc.email}{detail.gc.email && detail.gc.phone ? ' · ' : ''}{detail.gc.phone}</div>}
            </div>
          )}
        </div>
        <div style={{ minWidth: 240 }}>
          <div style={{ height: 9, background: '#EEF0F2', borderRadius: 4, overflow: 'hidden' }}><div style={detail.meterFillStyle} /></div>
          <div style={detail.meterLabelStyle}>{detail.meterLabel}</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 20, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <section style={{ background: '#fff', border: '1px solid #E3E1DB', borderRadius: 6, boxShadow: '0 1px 2px rgb(28 43 57 / 0.06)', overflow: 'hidden' }}>
            <h3 style={{ fontFamily: "'Barlow Semi Condensed',sans-serif", fontWeight: 700, fontSize: 15, textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0, padding: '14px 18px', borderBottom: '1px solid #E3E1DB' }}>Required documents</h3>
            {detail.reqs.map((req) => <ReqRow key={req.key} req={req} />)}
          </section>
          <section style={{ background: '#fff', border: '1px solid #E3E1DB', borderRadius: 6, boxShadow: '0 1px 2px rgb(28 43 57 / 0.06)', padding: 18 }}>
            <div onClick={detail.onUpload} className="cc-dropzone" style={{ border: '1.5px dashed #C7CDD4', borderRadius: 6, padding: 26, textAlign: 'center', cursor: 'pointer', background: '#FBFBFA' }}>
              <div style={{ fontFamily: "'Barlow Semi Condensed',sans-serif", fontWeight: 600, fontSize: 15, textTransform: 'uppercase', letterSpacing: '0.03em', color: '#1C2B39' }}>Drop a document or browse</div>
              <div style={{ fontSize: '12.5px', color: '#5A6B7A', marginTop: 6 }}>Simulates a subcontractor upload · routes to your review</div>
            </div>
          </section>
        </div>
        <section style={{ background: '#fff', border: '1px solid #E3E1DB', borderRadius: 6, boxShadow: '0 1px 2px rgb(28 43 57 / 0.06)', overflow: 'hidden' }}>
          <h3 style={{ fontFamily: "'Barlow Semi Condensed',sans-serif", fontWeight: 700, fontSize: 15, textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0, padding: '14px 18px', borderBottom: '1px solid #E3E1DB' }}>
            Activity log <span style={{ fontWeight: 500, fontSize: 11, color: '#8A93A0', letterSpacing: '0.02em' }}>· audit trail</span>
          </h3>
          <AuditLog audit={detail.audit} />
        </section>
      </div>
    </>
  );
}
