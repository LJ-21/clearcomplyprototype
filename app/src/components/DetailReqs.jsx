export function ReqRow({ req }) {
  return (
    <div style={req.rowStyle}>
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={req.stampStyle}>{req.stampLabel}</span>
          <span style={{ fontWeight: 600 }}>{req.label}</span>
          <span style={{ fontFamily: "'Barlow Semi Condensed',sans-serif", fontWeight: 600, fontSize: '10.5px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#8A93A0', border: '1px solid #E3E1DB', borderRadius: 3, padding: '1px 6px' }}>{req.cadence}</span>
        </div>
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: '#5A6B7A', marginTop: 6 }}>{req.metaLine}</div>
        {req.hasEsc && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginTop: 8 }}>
            <div style={req.esc.dotStyle} />
            <div style={{ fontSize: 12, color: '#5A6B7A' }}><span style={{ fontWeight: 600, color: '#1C2B39' }}>{req.esc.text}</span> · next: {req.esc.next}</div>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {req.actions.map((act) => (
          <button key={act.key} onClick={act.onClick} style={act.style}>{act.label}</button>
        ))}
      </div>
    </div>
  );
}

export function ReqRowDrawer({ req }) {
  return (
    <div style={req.rowStyleDrawer}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap' }}>
        <span style={req.stampStyle}>{req.stampLabel}</span>
        <span style={{ fontWeight: 600, fontSize: 14 }}>{req.label}</span>
      </div>
      <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '11.5px', color: '#5A6B7A', marginTop: 5 }}>{req.metaLine}</div>
      {req.hasEsc && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginTop: 8 }}>
          <div style={req.esc.dotStyle} />
          <div style={{ fontSize: '11.5px', color: '#5A6B7A' }}><span style={{ fontWeight: 600, color: '#1C2B39' }}>{req.esc.text}</span> · next: {req.esc.next}</div>
        </div>
      )}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 9 }}>
        {req.actions.map((act) => (
          <button key={act.key} onClick={act.onClick} style={act.style}>{act.label}</button>
        ))}
      </div>
    </div>
  );
}

export function AuditLog({ audit, drawer }) {
  return (
    <div style={{ padding: drawer ? '4px 16px 12px' : '6px 18px 14px' }}>
      {audit.map((e) => (
        <div key={e.key} style={{ display: 'flex', gap: 12, padding: (drawer ? '10px' : '11px') + ' 0', borderBottom: '1px solid #F2F1ED' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 5, flexShrink: 0, width: drawer ? 70 : 74 }}>
            <span style={e.chipStyle}>{e.actor}</span>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: drawer ? 10 : '10.5px', color: '#8A93A0' }}>{e.ts}</span>
          </div>
          <div style={{ fontSize: drawer ? '12.5px' : 13, lineHeight: 1.45 }}>{e.text}</div>
        </div>
      ))}
    </div>
  );
}
