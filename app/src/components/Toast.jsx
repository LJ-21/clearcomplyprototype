export default function Toast({ vm }) {
  if (!vm.toast) return null;
  return (
    <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 70, background: '#1C2B39', color: '#fff', padding: '12px 18px', borderRadius: 6, boxShadow: '0 8px 28px rgb(28 43 57 / 0.28)', fontSize: '13.5px', maxWidth: 560, textAlign: 'center' }}>
      {vm.toast}
    </div>
  );
}
