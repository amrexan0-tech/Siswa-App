import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export default function ConfirmDialog({ open, onClose, onConfirm, title, message, loading }) {
  if (!open) return null
  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ maxWidth: '420px' }}>
        <div className="px-6 py-6 text-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(239,68,68,0.15)' }}>
            <ExclamationTriangleIcon className="w-7 h-7" style={{ color: '#ef4444' }} />
          </div>
          <h3 className="font-semibold text-base mb-2" style={{ color: '#f1f5f9' }}>{title}</h3>
          <p className="text-sm mb-6" style={{ color: '#94a3b8' }}>{message}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={onClose} className="btn-secondary" disabled={loading}>Batal</button>
            <button onClick={onConfirm} className="btn-danger" disabled={loading}>
              {loading ? 'Menghapus...' : 'Ya, Hapus'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
