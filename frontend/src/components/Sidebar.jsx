import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import {
  HomeIcon, UserGroupIcon, AcademicCapIcon,
  BuildingLibraryIcon, CalendarIcon, UsersIcon,
  ClipboardDocumentListIcon, UserCircleIcon,
  ArrowRightOnRectangleIcon, ChevronRightIcon
} from '@heroicons/react/24/outline'

const navItems = [
  { to: '/',             icon: HomeIcon,                    label: 'Dashboard' },
  { to: '/siswa',        icon: UserGroupIcon,               label: 'Data Siswa' },
  { to: '/kelas',        icon: AcademicCapIcon,             label: 'Kelas' },
  { to: '/jurusan',      icon: BuildingLibraryIcon,         label: 'Jurusan' },
  { to: '/tahun-ajaran', icon: CalendarIcon,                label: 'Tahun Ajaran' },
]

const adminItems = [
  { to: '/users',    icon: UsersIcon,                   label: 'Manage Users' },
  { to: '/activity', icon: ClipboardDocumentListIcon,   label: 'Activity Log' },
]

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    toast.success('Berhasil logout')
    navigate('/login')
  }

  return (
    <aside
      className={`
        fixed lg:static inset-y-0 left-0 z-30
        flex flex-col w-64 transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
      style={{ background: '#0f172a', borderRight: '1px solid #1e293b' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: '1px solid #1e293b' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 4px 12px rgba(99,102,241,0.4)' }}>
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z" />
          </svg>
        </div>
        <div>
          <p className="font-bold text-sm" style={{ color: '#f1f5f9' }}>EduCore</p>
          <p className="text-xs" style={{ color: '#64748b' }}>Sistem Informasi</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wider px-3 mb-2" style={{ color: '#475569' }}>
          Menu Utama
        </p>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={onClose}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span className="flex-1">{label}</span>
            <ChevronRightIcon className="w-3.5 h-3.5 opacity-40" />
          </NavLink>
        ))}

        {user?.role === 'admin' && (
          <>
            <p className="text-xs font-semibold uppercase tracking-wider px-3 mt-5 mb-2" style={{ color: '#475569' }}>
              Administrasi
            </p>
            {adminItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={onClose}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="flex-1">{label}</span>
                <ChevronRightIcon className="w-3.5 h-3.5 opacity-40" />
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* User info + logout */}
      <div className="px-3 py-4" style={{ borderTop: '1px solid #1e293b' }}>
        <NavLink
          to="/profile"
          onClick={onClose}
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''} mb-1`}
        >
          <UserCircleIcon className="w-5 h-5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: '#e2e8f0' }}>{user?.username}</p>
            <p className="text-xs capitalize" style={{ color: '#64748b' }}>{user?.role}</p>
          </div>
        </NavLink>
        <button onClick={handleLogout} className="sidebar-link w-full" style={{ color: '#f87171' }}>
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
