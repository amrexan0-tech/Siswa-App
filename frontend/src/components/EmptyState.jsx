import { InboxIcon } from '@heroicons/react/24/outline'

export default function EmptyState({ title = 'Tidak ada data', message = 'Belum ada data yang tersedia', action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: 'rgba(99,102,241,0.1)' }}>
        <InboxIcon className="w-8 h-8" style={{ color: '#6366f1' }} />
      </div>
      <h3 className="font-semibold text-base mb-1" style={{ color: '#e2e8f0' }}>{title}</h3>
      <p className="text-sm mb-4" style={{ color: '#64748b' }}>{message}</p>
      {action}
    </div>
  )
}
