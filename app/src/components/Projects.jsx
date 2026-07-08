export default function Projects({ vm }) {
  return (
    <section>
      <h2 style={{ fontFamily: "'Barlow Semi Condensed',sans-serif", fontWeight: 700, fontSize: 18, margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Projects</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 16 }}>
        {vm.projectCards.map((p) => (
          <div key={p.key} style={{ background: '#fff', border: '1px solid #E3E1DB', borderRadius: 6, boxShadow: '0 1px 2px rgb(28 43 57 / 0.06)', padding: 18 }}>
            <div style={{ fontFamily: "'Barlow Semi Condensed',sans-serif", fontWeight: 700, fontSize: 19 }}>{p.name}</div>
            <div style={{ fontSize: '12.5px', color: '#5A6B7A', marginTop: 2 }}>Project Manager · <span style={{ color: '#1C2B39', fontWeight: 600 }}>{p.pm}</span></div>
            <div style={{ display: 'flex', gap: 20, margin: '16px 0 6px' }}>
              <div><div style={{ fontFamily: "'Barlow Semi Condensed',sans-serif", fontWeight: 700, fontSize: 24 }}>{p.subCount}</div><div style={{ fontSize: 11, color: '#5A6B7A' }}>subs</div></div>
              <div><div style={{ fontFamily: "'Barlow Semi Condensed',sans-serif", fontWeight: 700, fontSize: 24, color: '#B3261E' }}>{p.atRisk}</div><div style={{ fontSize: 11, color: '#5A6B7A' }}>at-risk items</div></div>
            </div>
            <div style={{ height: 8, background: '#EEF0F2', borderRadius: 4, overflow: 'hidden', marginTop: 8 }}><div style={p.meterFillStyle} /></div>
            <div style={p.meterLabelStyle}>{p.meterLabel}</div>
            <button onClick={p.onOpen} className="cc-outline-btn" style={{ marginTop: 14, width: '100%', background: '#fff', color: '#1C2B39', border: '1px solid #E3E1DB', borderRadius: 3, padding: '9px 14px', fontWeight: 600, fontSize: 13 }}>View subcontractors</button>
          </div>
        ))}
      </div>
    </section>
  );
}
