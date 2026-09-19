import { useEffect, useState } from 'react'
import { activityAPI } from '../services/api'
import Pagination from '../components/Pagination'
import { SkeletonTable } from '../components/Skeleton'
import EmptyState from '../components/EmptyState'
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline'

export default function ActivityPage() {
  const [data, setData]       = useState([])
  const [meta, setMeta]       = useState({ total: 0, page: 1, limit: 20, total_pages: 1 })
  const [loading, setLoading] = useState(true)
  const [page, setPage]       = useState(1)

  useEffect(() => {
    setLoading(true)
    activityAPI.getAll({ page, limit: 20 })
      .then(r => { setData(r.data.data.items); setMeta(r.data.data) })
      .finally(() => setLoading(false))
  }, [page])

  const getActivityColor = (aktivitas) => {
    if (aktivitas.includes('Hapus') || aktivitas.includes('hapus')) return '#ef4444'
    if (aktivitas.includes('Tambah') || aktivitas.includes('tambah')) return '#22c55e'
    if (aktivitas.includes('Update') || aktivitas.includes('update')) return '#f59e0b'
    if (aktivitas.includes('Login') || aktivitas.includes('login')) return '#6366f1'
    return '#64748b'
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-bold text-lg" style={{ color: '#f1f5f9' }}>Activity Log</h2>
        <p className="text-xs" style={{ color: '#64748b' }}>{meta.total} aktivitas tercatat</p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid #334155' }}>
                {['Aktivitas', 'User', 'Waktu'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: '#64748b' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonTable rows={10} cols={3} />
              ) : data.length === 0 ? (
                <tr><td colSpan={3}>
                  <EmptyState title="Belum ada aktivitas" message="Aktivitas sistem akan muncul di sini" />
                </td></tr>
              ) : data.map((a, i) => (
                <tr key={i} className="table-row">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: getActivityColor(a.aktivitas) }} />
                      <span style={{ color: '#e2e8f0' }}>{a.aktivitas}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
                        {a.username?.[0]?.toUpperCase() || '?'}
                      </div>
                      <span className="text-xs" style={{ color: '#94a3b8' }}>{a.username || 'System'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#64748b' }}>
                    {new Date(a.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination {...meta} onPageChange={setPage} />
      </div>
    </div>
  )
}
