import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Bars3Icon, MagnifyingGlassIcon, BellIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../context/AuthContext'

const pageTitles = {
  '/':             { title: 'Dashboard',     sub: 'Selamat datang kembali' },
  '/siswa':        { title: 'Data Siswa',    sub: 'Kelola data siswa' },
  '/kelas':        { title: 'Kelas',         sub: 'Manajemen kelas' },
  '/jurusan':      { title: 'Jurusan',       sub: 'Manajemen jurusan' },
  '/tahun-ajaran': { title: 'Tahun Ajaran',  sub: 'Manajemen tahun ajaran' },
  '/users':        { title: 'Manage Users',  sub: 'Kelola akun pengguna' },
  '/activity':     { title: 'Activity Log',  sub: 'Riwayat aktivitas sistem' },
  '/profile':      { title: 'Profil',        sub: 'Pengaturan akun' },
}

export default function Topbar({ onMenuClick }) {
  const location = useLocation()
  const { user }  = useAuth()
  const page      = pageTitles[location.pathname] || { title: 'EduCore', sub: '' }

  return (
    <header
      className="flex items-center justify-between px-4 lg:px-6 py-3 flex-shrink-0"
      style={{ background: '#0f172a', borderBottom: '1px solid #1e293b' }}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg transition-colors lg:hidden"
          style={{ color: '#94a3b8' }}
        >
          <Bars3Icon className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-bold text-base" style={{ color: '#f1f5f9' }}>{page.title}</h1>
          <p className="text-xs hidden sm:block" style={{ color: '#64748b' }}>{page.sub}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Role badge */}
        <span className={`badge hidden sm:inline-flex ${user?.role === 'admin' ? 'badge-indigo' : 'badge-blue'}`}>
          {user?.role}
        </span>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z" />
          </svg>
        </div>
      </div>
    </header>
  )
}
