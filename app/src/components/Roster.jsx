const headCellStyle = { fontFamily: "'Barlow Semi Condensed',sans-serif", fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#5A6B7A' };
const headers = ['Subcontractor / PM', 'Insurance · expires', 'W-9 · one-time', 'Payroll · weekly', 'Workforce · monthly', 'Compliance', 'Last activity'];

export default function Roster({ vm }) {
  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 13, flexWrap: 'wrap' }}>
        <h2 style={{ fontFamily: "'Barlow Semi Condensed',sans-serif", fontWeight: 700, fontSize: 18, margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Subcontractor Roster</h2>
        <span style={{ fontSize: 12, color: '#5A6B7A', fontFamily: "'IBM Plex Mono',monospace" }}>sorted by least compliant</span>
        <div style={{ flex: 1 }} />
        <button onClick={vm.toggleMissingOnly} style={vm.missingOnlyStyle}>Only missing / at-risk</button>
      </div>
      <div style={{ background: '#fff', border: '1px solid #E3E1DB', borderRadius: 6, overflow: 'hidden', boxShadow: '0 1px 2px rgb(28 43 57 / 0.06)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr 1fr 1fr 1fr 1.1fr 0.9fr', gap: 14, alignItems: 'center', padding: '11px 16px', background: '#F2F1ED', borderBottom: '1px solid #E3E1DB' }}>
          {headers.map((h) => <div key={h} style={headCellStyle}>{h}</div>)}
        </div>
        {vm.roster.map((row) => (
          <div key={row.id} onClick={row.onOpen} className="cc-roster-row" style={row.style}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.name}</div>
              <div style={{ fontSize: 12, color: '#5A6B7A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.subtitle}</div>
            </div>
            {row.cells.map((cell, ci) => (
              <div key={ci}><span style={cell.stampStyle}>{cell.stampLabel}</span></div>
            ))}
            <div>
              <div style={{ height: 6, background: '#EEF0F2', borderRadius: 3, overflow: 'hidden' }}><div style={row.meter.fillStyle} /></div>
              <div style={row.meter.labelStyle}>{row.meter.label}</div>
            </div>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: '#5A6B7A' }}>{row.lastActivity}</div>
          </div>
        ))}
        {vm.rosterEmpty && (
          <div style={{ padding: 28, textAlign: 'center', color: '#5A6B7A', fontSize: '13.5px' }}>No subcontractors match this filter.</div>
        )}
      </div>
      {vm.rosterPager.show && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'flex-end', marginTop: 14 }}>
          <span style={{ fontSize: 12, color: '#5A6B7A', fontFamily: "'IBM Plex Mono',monospace" }}>{vm.rosterPager.label}</span>
          <button onClick={vm.rosterPager.onPrev} style={vm.rosterPager.prevStyle}>Prev</button>
          <button onClick={vm.rosterPager.onNext} style={vm.rosterPager.nextStyle}>Next</button>
        </div>
      )}
    </section>
  );
}
