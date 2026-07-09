export default function ReviewModal({ vm }) {
  if (!vm.reviewOpen) return null;
  const { review } = vm;
  return (
    <div onClick={vm.closeModal} style={{ position: 'fixed', inset: 0, zIndex: 80, background: 'rgb(28 43 57 / 0.42)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div onClick={vm.stop} style={{ position: 'relative', background: '#fff', borderRadius: 8, width: '100%', maxWidth: 560, boxShadow: '0 20px 60px rgb(28 43 57 / 0.3)', overflow: 'hidden', maxHeight: '90vh', overflowY: 'auto' }}>
        <button onClick={vm.closeModal} aria-label="Close" className="cc-close-btn" style={{ position: 'absolute', top: 12, right: 12, background: '#fff', border: '1px solid #E3E1DB', borderRadius: 3, width: 30, height: 30, fontSize: 16, color: '#5A6B7A', lineHeight: 1, zIndex: 2 }}>×</button>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E3E1DB' }}>
          <div style={{ fontFamily: "'Barlow Semi Condensed',sans-serif", fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#5A6B7A' }}>Review upload · {review.subName}</div>
          <div style={{ fontFamily: "'Barlow Semi Condensed',sans-serif", fontWeight: 700, fontSize: 20, marginTop: 2 }}>{review.docLabel}</div>
        </div>
        <div style={{ padding: '18px 20px' }}>
          <div style={{ border: '1px solid #E3E1DB', borderRadius: 6, padding: '14px 16px', background: '#FBFBFA' }}>
            <div style={{ fontSize: '13.5px', lineHeight: 1.55, color: '#1C2B39' }}>
              The document was received from <strong>{review.subName}</strong> and is ready for your review. Open the file, confirm it meets the requirement, then approve it or reject it with a reason.
            </div>
            <div style={{ fontSize: 12, color: '#5A6B7A', marginTop: 8 }}>Automated field extraction and rules checks are a post-MVP addition — see the MVP60 plan.</div>
          </div>
        </div>
        {review.rejecting && (
          <div style={{ padding: '0 20px 18px' }}>
            <div style={{ fontSize: 12, color: '#5A6B7A', fontWeight: 600, marginBottom: 6 }}>Reason (sent to subcontractor)</div>
            <textarea
              value={vm.rejectReason}
              onChange={vm.onRejectReason}
              rows={3}
              placeholder="e.g. Coverage below the $2M contract requirement — provide an updated certificate."
              style={{ width: '100%', border: '1px solid #E3E1DB', borderRadius: 3, padding: '10px 12px', fontSize: '13.5px', lineHeight: 1.5, resize: 'vertical' }}
            />
          </div>
        )}
        <div style={{ padding: '14px 20px', borderTop: '1px solid #E3E1DB', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ fontSize: 11, color: '#8A93A0', fontFamily: "'IBM Plex Mono',monospace", flex: 1 }}>Your decision is logged to the audit trail.</div>
          {review.notRejecting && (
            <>
              <button onClick={vm.startReject} style={{ background: '#fff', color: '#1C2B39', border: '1px solid #E3E1DB', borderRadius: 3, padding: '9px 16px', fontWeight: 600, fontSize: '13.5px' }}>Reject</button>
              <button onClick={vm.approve} className="cc-approve-btn" style={{ background: '#1E7F4F', color: '#fff', border: '1px solid #1E7F4F', borderRadius: 3, padding: '9px 16px', fontWeight: 600, fontSize: '13.5px' }}>Approve document</button>
            </>
          )}
          {review.rejecting && (
            <>
              <button onClick={vm.cancelReject} style={{ background: '#fff', color: '#1C2B39', border: '1px solid #E3E1DB', borderRadius: 3, padding: '9px 16px', fontWeight: 600, fontSize: '13.5px' }}>Cancel</button>
              <button onClick={vm.confirmReject} style={{ background: '#1C2B39', color: '#fff', border: '1px solid #1C2B39', borderRadius: 3, padding: '9px 16px', fontWeight: 600, fontSize: '13.5px' }}>Confirm rejection</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
