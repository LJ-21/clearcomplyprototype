const selectStyle = {
  appearance: 'none', background: '#fff', border: '1px solid #E3E1DB', borderRadius: 3, padding: '8px 30px 8px 12px',
  fontSize: '13.5px', fontWeight: 500, color: '#1C2B39',
  backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"10\" height=\"6\"><path d=\"M1 1l4 4 4-4\" stroke=\"%235A6B7A\" stroke-width=\"1.5\" fill=\"none\"/></svg>')",
  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 11px center',
};

export default function Header({ vm }) {
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 20, background: '#fff', borderBottom: '1px solid #E3E1DB', boxShadow: '0 1px 2px rgb(28 43 57 / 0.06)' }}>
      <div style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', minWidth: 0 }}>
          {vm.crumbs.map((cr) => (
            <span key={cr.key} style={{ display: 'contents' }}>
              <span style={cr.sepStyle}>/</span>
              <span onClick={cr.onClick} style={cr.style}>{cr.label}</span>
            </span>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <select value={vm.projectFilter} onChange={vm.onProjectChange} style={selectStyle}>
          {vm.projectOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <button
          onClick={() => vm.openOnboard('sub')}
          className="cc-outline-btn"
          style={{ background: '#fff', color: '#1C2B39', border: '1px solid #E3E1DB', borderRadius: 3, padding: '9px 16px', fontWeight: 600, fontSize: '13.5px' }}
        >
          + New
        </button>
        <button
          onClick={vm.runSweep}
          className="cc-primary-btn"
          style={{ background: '#0E5FD8', color: '#fff', border: '1px solid #0E5FD8', borderRadius: 3, padding: '9px 16px', fontWeight: 600, fontSize: '13.5px' }}
        >
          Run daily sweep
        </button>
      </div>
    </header>
  );
}
