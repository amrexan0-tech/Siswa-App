import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { usersAPI } from '../services/api'
import toast from 'react-hot-toast'
import { UserCircleIcon, KeyIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

export default function ProfilePage() {
  const { user, setUser }         = useAuth()
  const [profileForm, setProfile] = useState({ username: user?.username || '' })
  const [pwForm, setPwForm]       = useState({ old_password: '', password: '', confirm: '' })
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPw, setSavingPw]           = useState(false)

  const handleProfileSave = async (e) => {
    e.preventDefault()
    setSavingProfile(true)
    try {
      const res = await usersAPI.updateProfile(user.id, profileForm)
      setUser(res.data.data)
      toast.success('Profil berhasil diupdate')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal update profil')
    } finally {
      setSavingProfile(false)
    }
  }

  const handlePwSave = async (e) => {
    e.preventDefault()
    if (pwForm.password !== pwForm.confirm) {
      toast.error('Konfirmasi password tidak cocok')
      return
    }
    if (pwForm.password.length < 6) {
      toast.error('Password minimal 6 karakter')
      return
    }
    setSavingPw(true)
    try {
      await usersAPI.updateProfile(user.id, {
        old_password: pwForm.old_password,
        password: pwForm.password,
      })
      setPwForm({ old_password: '', password: '', confirm: '' })
      toast.success('Password berhasil diubah')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal ubah password')
    } finally {
      setSavingPw(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-4">
      {/* Profile header */}
      <div className="card p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold"
            style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: '#f1f5f9' }}>{user?.username}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`badge ${user?.role === 'admin' ? 'badge-indigo' : 'badge-green'} flex items-center gap-1`}>
                <ShieldCheckIcon className="w-3 h-3" />
                {user?.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit profil */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-5">
          <UserCircleIcon className="w-5 h-5" style={{ color: '#6366f1' }} />
          <h3 className="font-semibold" style={{ color: '#f1f5f9' }}>Edit Profil</h3>
        </div>
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>Username</label>
            <input className="input-field" value={profileForm.username}
              onChange={e => setProfile({ username: e.target.value })} required />
          </div>
          <button type="submit" className="btn-primary" disabled={savingProfile}>
            {savingProfile ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </form>
      </div>

      {/* Ganti password */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-5">
          <KeyIcon className="w-5 h-5" style={{ color: '#f59e0b' }} />
          <h3 className="font-semibold" style={{ color: '#f1f5f9' }}>Ganti Password</h3>
        </div>
        <form onSubmit={handlePwSave} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>Password Lama</label>
            <input type="password" className="input-field" placeholder="Password saat ini"
              value={pwForm.old_password} onChange={e => setPwForm(f => ({ ...f, old_password: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>Password Baru</label>
            <input type="password" className="input-field" placeholder="Minimal 6 karakter"
              value={pwForm.password} onChange={e => setPwForm(f => ({ ...f, password: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>Konfirmasi Password</label>
            <input type="password" className="input-field" placeholder="Ulangi password baru"
              value={pwForm.confirm} onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} required />
          </div>
          <button type="submit" className="btn-primary" disabled={savingPw}>
            {savingPw ? 'Mengubah...' : 'Ubah Password'}
          </button>
        </form>
      </div>
    </div>
  )
}
