export default function EmailModal({ vm }) {
  if (!vm.emailOpen) return null;
  const { email } = vm;
  return (
    <div onClick={vm.closeModal} style={{ position: 'fixed', inset: 0, zIndex: 80, background: 'rgb(28 43 57 / 0.42)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div onClick={vm.stop} style={{ position: 'relative', background: '#fff', borderRadius: 8, width: '100%', maxWidth: 560, boxShadow: '0 20px 60px rgb(28 43 57 / 0.3)', overflow: 'hidden' }}>
        <button onClick={vm.closeModal} aria-label="Close" className="cc-close-btn" style={{ position: 'absolute', top: 12, right: 12, background: '#fff', border: '1px solid #E3E1DB', borderRadius: 3, width: 30, height: 30, fontSize: 16, color: '#5A6B7A', lineHeight: 1 }}>×</button>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E3E1DB' }}>
          <div style={{ fontFamily: "'Barlow Semi Condensed',sans-serif", fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#5A6B7A' }}>Reminder to {email.subName}</div>
          <div style={{ fontFamily: "'Barlow Semi Condensed',sans-serif", fontWeight: 700, fontSize: 20, marginTop: 2 }}>Send Reminder</div>
        </div>
        <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
            <div style={{ width: 64, fontSize: 12, color: '#5A6B7A', fontWeight: 600 }}>To</div>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 13 }}>{email.to}</div>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ width: 64, fontSize: 12, color: '#5A6B7A', fontWeight: 600 }}>Subject</div>
            <input value={email.subject} onChange={vm.onEmailSubject} style={{ flex: 1, border: '1px solid #E3E1DB', borderRadius: 3, padding: '8px 10px', fontSize: '13.5px' }} />
          </div>
          <textarea value={email.body} onChange={vm.onEmailBody} rows={10} style={{ border: '1px solid #E3E1DB', borderRadius: 3, padding: '11px 12px', fontSize: '13.5px', lineHeight: 1.55, resize: 'vertical', whiteSpace: 'pre-wrap' }} />
        </div>
        <div style={{ padding: '14px 20px', borderTop: '1px solid #E3E1DB', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button onClick={vm.closeModal} style={{ background: '#fff', color: '#1C2B39', border: '1px solid #E3E1DB', borderRadius: 3, padding: '9px 16px', fontWeight: 600, fontSize: '13.5px' }}>Cancel</button>
          <button onClick={vm.sendEmail} className="cc-primary-btn" style={{ background: '#0E5FD8', color: '#fff', border: '1px solid #0E5FD8', borderRadius: 3, padding: '9px 16px', fontWeight: 600, fontSize: '13.5px' }}>Send reminder</button>
        </div>
      </div>
    </div>
  );
}
