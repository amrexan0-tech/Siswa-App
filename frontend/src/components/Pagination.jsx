import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

export default function Pagination({ page, totalPages, total, limit, onPageChange }) {
  if (totalPages <= 1) return null

  const from = (page - 1) * limit + 1
  const to   = Math.min(page * limit, total)

  const pages = []
  const delta = 2
  for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) {
    pages.push(i)
  }

  return (
    <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: '1px solid #1e293b' }}>
      <p className="text-xs" style={{ color: '#64748b' }}>
        Menampilkan {from}–{to} dari {total} data
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="p-1.5 rounded-lg transition-colors disabled:opacity-30"
          style={{ color: '#94a3b8', background: '#1e293b', border: '1px solid #334155' }}
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </button>

        {pages[0] > 1 && (
          <>
            <PageBtn n={1} current={page} onClick={onPageChange} />
            {pages[0] > 2 && <span className="px-1 text-xs" style={{ color: '#475569' }}>…</span>}
          </>
        )}

        {pages.map(n => <PageBtn key={n} n={n} current={page} onClick={onPageChange} />)}

        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && <span className="px-1 text-xs" style={{ color: '#475569' }}>…</span>}
            <PageBtn n={totalPages} current={page} onClick={onPageChange} />
          </>
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="p-1.5 rounded-lg transition-colors disabled:opacity-30"
          style={{ color: '#94a3b8', background: '#1e293b', border: '1px solid #334155' }}
        >
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

function PageBtn({ n, current, onClick }) {
  const active = n === current
  return (
    <button
      onClick={() => onClick(n)}
      className="w-8 h-8 rounded-lg text-xs font-medium transition-all"
      style={{
        background: active ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : '#1e293b',
        color:      active ? 'white' : '#94a3b8',
        border:     active ? 'none' : '1px solid #334155',
      }}
    >
      {n}
    </button>
  )
}
