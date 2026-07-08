export default function Sidebar({ vm }) {
  return (
    <aside style={{ width: 224, flexShrink: 0, background: '#fff', borderRight: '1px solid #E3E1DB', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh' }}>
      <div
        onClick={vm.goHome}
        style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '18px 18px 16px', borderBottom: '1px solid #E3E1DB' }}
      >
        <div style={{ width: 28, height: 28, borderRadius: 5, background: '#0E5FD8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: "'Barlow Semi Condensed',sans-serif", fontWeight: 700, fontSize: 17 }}>C</div>
        <div style={{ fontFamily: "'Barlow Semi Condensed',sans-serif", fontWeight: 700, fontSize: 19, letterSpacing: '0.01em' }}>ClearComply</div>
      </div>
      <nav style={{ padding: '10px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {vm.navItems.map((n) => (
          <button key={n.key} onClick={n.onClick} style={n.style}>{n.label}</button>
        ))}
      </nav>
      <div style={{ flex: 1 }} />
      <div style={{ padding: '14px 18px', borderTop: '1px solid #E3E1DB', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: 999, background: '#EEF3FE', color: '#0E5FD8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Barlow Semi Condensed',sans-serif", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>DR</div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Dana Ruiz</div>
          <div style={{ fontSize: 11, color: '#8A93A0' }}>Project Manager · signed in</div>
        </div>
      </div>
    </aside>
  );
}
