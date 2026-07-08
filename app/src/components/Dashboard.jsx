export default function Dashboard({ vm }) {
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', background: '#fff', border: '1px solid #E3E1DB', borderRadius: 6, boxShadow: '0 1px 2px rgb(28 43 57 / 0.06)', overflow: 'hidden', marginBottom: 26 }}>
        {vm.kpis.map((k) => (
          <div key={k.key} style={k.style}>
            <div style={k.valueStyle}>{k.value}</div>
            <div style={{ fontSize: 12, color: '#5A6B7A', marginTop: 5, lineHeight: 1.35 }}>{k.label}</div>
          </div>
        ))}
      </div>

      <section style={{ marginBottom: 30 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
          <h2 style={{ fontFamily: "'Barlow Semi Condensed',sans-serif", fontWeight: 700, fontSize: 18, margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Action Queue</h2>
          <span style={{ fontSize: 12, color: '#5A6B7A', fontFamily: "'IBM Plex Mono',monospace" }}>{vm.queueCountLabel}</span>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', gap: 6 }}>
            {vm.scopeToggle.map((sc) => (
              <button key={sc.key} onClick={sc.onClick} style={sc.style}>{sc.label}</button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 13 }}>
          {vm.queueFilters.map((qf) => (
            <button key={qf.key} onClick={qf.onClick} style={qf.style}>{qf.label}</button>
          ))}
        </div>
        {vm.queueEmpty && (
          <div style={{ background: '#E7F4EC', border: '1px solid #1E7F4F', borderRadius: 6, padding: 30, textAlign: 'center', color: '#1E7F4F', fontFamily: "'Barlow Semi Condensed',sans-serif", fontWeight: 600, fontSize: 16, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Queue clear. Nothing needs your action.
          </div>
        )}
        {vm.queueHasItems && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {vm.queue.map((card) => (
              <div key={card.key} onClick={card.onCard} className="cc-queue-card" style={card.style}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <span style={card.stampStyle}>{card.stampLabel}</span>
                    <span style={{ fontWeight: 600 }}>{card.subName}</span>
                    <span style={{ color: '#B7BEC6' }}>/</span>
                    <span>{card.docLabel}</span>
                    <span style={{ fontSize: 11, color: '#5A6B7A', fontFamily: "'IBM Plex Mono',monospace", border: '1px solid #E3E1DB', borderRadius: 3, padding: '1px 6px' }}>PM {card.pm}</span>
                  </div>
                  <div style={{ color: '#5A6B7A', fontSize: '13.5px', marginTop: 5 }}>{card.reason}</div>
                  {card.hasEsc && (
                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginTop: 6 }}>
                      <div style={card.esc.dotStyle} />
                      <div style={{ fontSize: 12, color: '#5A6B7A' }}><span style={{ fontWeight: 600, color: '#1C2B39' }}>{card.esc.text}</span> · next: {card.esc.next}</div>
                    </div>
                  )}
                </div>
                <button onClick={card.onAction} style={card.btnStyle}>{card.actionLabel}</button>
              </div>
            ))}
          </div>
        )}
        {vm.queuePager.show && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'flex-end', marginTop: 14 }}>
            <span style={{ fontSize: 12, color: '#5A6B7A', fontFamily: "'IBM Plex Mono',monospace" }}>{vm.queuePager.label}</span>
            <button onClick={vm.queuePager.onPrev} style={vm.queuePager.prevStyle}>Prev</button>
            <button onClick={vm.queuePager.onNext} style={vm.queuePager.nextStyle}>Next</button>
          </div>
        )}
      </section>
    </>
  );
}
