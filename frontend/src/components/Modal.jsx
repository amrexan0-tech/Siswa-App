import { XMarkIcon } from '@heroicons/react/24/outline'
import { useEffect } from 'react'

export default function Modal({ open, onClose, title, children, size = 'md' }) {
  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  const maxW = { sm: '400px', md: '560px', lg: '720px', xl: '900px' }[size] || '560px'

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: maxW }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #334155' }}>
          <h3 className="font-semibold text-base" style={{ color: '#f1f5f9' }}>{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg transition-colors hover:bg-slate-700"
            style={{ color: '#94a3b8' }}>
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        {/* Body */}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}
