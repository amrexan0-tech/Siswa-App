import { useDashboard } from '../context/DashboardContext'
import { SkeletonCard } from '../components/Skeleton'
import { Link } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LabelList
} from 'recharts'
import {
  UserGroupIcon, AcademicCapIcon, BuildingLibraryIcon,
  UsersIcon, ArrowTrendingUpIcon
} from '@heroicons/react/24/outline'

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4', '#a855f7']

/* ── Custom Tooltip ── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'rgba(15,23,42,0.95)',
      border: '1px solid rgba(99,102,241,0.3)',
      borderRadius: '10px',
      padding: '8px 12px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    }}>
      <p style={{ color: '#94a3b8', fontSize: 11, marginBottom: 2 }}>{label}</p>
      <p style={{ color: '#a5b4fc', fontSize: 14, fontWeight: 700 }}>
        {payload[0].value} <span style={{ color: '#64748b', fontWeight: 400, fontSize: 11 }}>siswa</span>
      </p>
    </div>
  )
}

/* ── Custom Donut Label (tengah) ── */
const DonutCenterLabel = ({ cx, cy, total }) => (
  <g>
    <text x={cx} y={cy - 8} textAnchor="middle" fill="#f1f5f9" fontSize={22} fontWeight={700}>{total}</text>
    <text x={cx} y={cy + 10} textAnchor="middle" fill="#64748b" fontSize={11}>Total Siswa</text>
  </g>
)

/* ── Live Indicator ── */
const LiveIndicator = ({ lastUpdated }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
    <span style={{
      width: 8, height: 8, borderRadius: '50%', background: '#22c55e',
      display: 'inline-block',
      animation: 'livePulse 2s ease-in-out infinite',
    }} />
    <span style={{ color: '#22c55e', fontSize: 11, fontWeight: 600 }}>LIVE</span>
    {lastUpdated && (
      <span style={{ color: '#475569', fontSize: 10, marginLeft: 4 }}>
        · {lastUpdated.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </span>
    )}
  </div>
)

/* ── Skeleton Baris ── */
const SkeletonRow = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <div className="skeleton" style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0 }} />
    <div style={{ flex: 1 }}>
      <div className="skeleton" style={{ height: 12, width: '55%', borderRadius: 6, marginBottom: 6 }} />
      <div className="skeleton" style={{ height: 10, width: '35%', borderRadius: 6 }} />
    </div>
  </div>
)

export default function DashboardPage() {
  const { dashboardData: data, loading, lastUpdated } = useDashboard()

  const totalSiswaDonut = data?.chart?.per_kelas?.reduce((s, k) => s + Number(k.total), 0) ?? 0

  const stats = [
    { label: 'Total Siswa',   value: data?.stats?.total_siswa,   icon: UserGroupIcon,       color: '#6366f1', bg: 'rgba(99,102,241,0.12)',  link: '/siswa' },
    { label: 'Total Kelas',   value: data?.stats?.total_kelas,   icon: AcademicCapIcon,     color: '#22c55e', bg: 'rgba(34,197,94,0.12)',   link: '/kelas' },
    { label: 'Total Jurusan', value: data?.stats?.total_jurusan, icon: BuildingLibraryIcon, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  link: '/jurusan' },
    { label: 'Total Users',   value: data?.stats?.total_users,   icon: UsersIcon,           color: '#06b6d4', bg: 'rgba(6,182,212,0.12)',   link: '/users' },
  ]

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <h2 style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 18, margin: 0 }}>Dashboard</h2>
          <p style={{ color: '#64748b', fontSize: 12, margin: 0 }}>Statistik realtime sistem data siswa</p>
        </div>
        <LiveIndicator lastUpdated={lastUpdated} />
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
          : stats.map(({ label, value, icon: Icon, color, bg, link }) => (
            <Link key={label} to={link} className="card card-hover p-5 block">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: bg }}>
                  <Icon style={{ width: 20, height: 20, color }} />
                </div>
                <ArrowTrendingUpIcon style={{ width: 16, height: 16, color: '#22c55e' }} />
              </div>
              <p style={{ color: '#f1f5f9', fontSize: 26, fontWeight: 800, margin: 0, lineHeight: 1 }}>{value ?? 0}</p>
              <p style={{ color: '#64748b', fontSize: 11, marginTop: 4, margin: 0 }}>{label}</p>
            </Link>
          ))
        }
      </div>

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Bar Chart — Per Jurusan */}
        <div className="card p-5">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <h3 style={{ color: '#f1f5f9', fontWeight: 600, fontSize: 13, margin: 0 }}>Siswa per Jurusan</h3>
              <p style={{ color: '#475569', fontSize: 11, margin: 0 }}>Distribusi berdasarkan program keahlian</p>
            </div>
            <span style={{
              background: 'rgba(99,102,241,0.12)', color: '#a5b4fc',
              fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 6,
              border: '1px solid rgba(99,102,241,0.2)'
            }}>
              {data?.chart?.per_jurusan?.length ?? 0} Jurusan
            </span>
          </div>

          {loading ? (
            <div className="skeleton" style={{ height: 220, borderRadius: 12 }} />
          ) : (data?.chart?.per_jurusan?.length ?? 0) === 0 ? (
            <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ color: '#475569', fontSize: 13 }}>Belum ada data</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data?.chart?.per_jurusan} barSize={36} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="kode" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.06)', radius: 6 }} />
                <Bar dataKey="total" radius={[8, 8, 0, 0]} isAnimationActive animationDuration={600}>
                  {data?.chart?.per_jurusan?.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                  <LabelList
                    dataKey="total"
                    position="top"
                    style={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Donut Chart — Per Kelas */}
        <div className="card p-5">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <h3 style={{ color: '#f1f5f9', fontWeight: 600, fontSize: 13, margin: 0 }}>Distribusi per Kelas</h3>
              <p style={{ color: '#475569', fontSize: 11, margin: 0 }}>Proporsi siswa di setiap tingkat kelas</p>
            </div>
            <span style={{
              background: 'rgba(34,197,94,0.12)', color: '#86efac',
              fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 6,
              border: '1px solid rgba(34,197,94,0.2)'
            }}>
              {data?.chart?.per_kelas?.length ?? 0} Kelas
            </span>
          </div>

          {loading ? (
            <div className="skeleton" style={{ height: 220, borderRadius: 12 }} />
          ) : (data?.chart?.per_kelas?.length ?? 0) === 0 ? (
            <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ color: '#475569', fontSize: 13 }}>Belum ada data</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={data?.chart?.per_kelas}
                  dataKey="total"
                  nameKey="nama_kelas"
                  cx="50%" cy="50%"
                  innerRadius={60} outerRadius={90}
                  paddingAngle={3}
                  isAnimationActive
                  animationDuration={600}
                >
                  {data?.chart?.per_kelas?.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <DonutCenterLabel cx="50%" cy="50%" total={totalSiswaDonut} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(v) => <span style={{ color: '#94a3b8', fontSize: 12 }}>{v}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ── Bottom Section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Siswa Terbaru */}
        <div className="card p-5">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ color: '#f1f5f9', fontWeight: 600, fontSize: 13, margin: 0 }}>Siswa Terbaru</h3>
            <Link to="/siswa" style={{ color: '#6366f1', fontSize: 12 }}>Lihat semua →</Link>
          </div>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {Array(4).fill(0).map((_, i) => <SkeletonRow key={i} />)}
            </div>
          ) : (data?.siswa_terbaru?.length ?? 0) === 0 ? (
            <p style={{ color: '#475569', fontSize: 13, textAlign: 'center', padding: '24px 0' }}>Belum ada data siswa</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {data?.siswa_terbaru?.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: 12, fontWeight: 700,
                    background: `linear-gradient(135deg, ${COLORS[i % COLORS.length]}, ${COLORS[(i + 1) % COLORS.length]})`,
                  }}>
                    {s.nama[0]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 500, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.nama}</p>
                    <p style={{ color: '#64748b', fontSize: 11, margin: 0 }}>{s.nama_kelas} · {s.nama_jurusan}</p>
                  </div>
                  <span className="badge badge-indigo" style={{ fontSize: 10, flexShrink: 0 }}>{s.nis}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Aktivitas Terbaru */}
        <div className="card p-5">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ color: '#f1f5f9', fontWeight: 600, fontSize: 13, margin: 0 }}>Aktivitas Terbaru</h3>
            <Link to="/activity" style={{ color: '#6366f1', fontSize: 12 }}>Lihat semua →</Link>
          </div>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {Array(5).fill(0).map((_, i) => (
                <div key={i} style={{ display: 'flex', gap: 10 }}>
                  <div className="skeleton" style={{ width: 8, height: 8, borderRadius: '50%', marginTop: 5, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div className="skeleton" style={{ height: 11, borderRadius: 6, marginBottom: 6 }} />
                    <div className="skeleton" style={{ height: 10, width: '45%', borderRadius: 6 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {data?.aktivitas_terbaru?.map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: 10 }}>
                  <div style={{
                    width: 7, height: 7, borderRadius: '50%', marginTop: 4, flexShrink: 0,
                    background: COLORS[i % COLORS.length],
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: '#e2e8f0', fontSize: 12, margin: 0, lineHeight: 1.4 }}>{a.aktivitas}</p>
                    <p style={{ color: '#475569', fontSize: 11, margin: 0, marginTop: 2 }}>
                      {a.username} · {new Date(a.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Live pulse animation ── */}
      <style>{`
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 0 0 rgba(34,197,94,0.4); }
          50% { opacity: 0.8; transform: scale(1.15); box-shadow: 0 0 0 5px rgba(34,197,94,0); }
        }
      `}</style>
    </div>
  )
}
