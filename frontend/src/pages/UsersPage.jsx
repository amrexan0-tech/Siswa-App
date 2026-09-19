import { useEffect, useState } from 'react'
import { usersAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'
import { SkeletonTable } from '../components/Skeleton'
import { PlusIcon, PencilSquareIcon, TrashIcon, ShieldCheckIcon, UserIcon } from '@heroicons/react/24/outline'

export default function UsersPage() {
  const { user: me }              = useAuth()
  const [list, setList]           = useState([])
  const [loading, setLoading]     = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editData, setEditData]   = useState(null)
  const [form, setForm]           = useState({ username: '', password: '', role: 'staff' })
  const [saving, setSaving]       = useState(false)
  const [deleteId, setDeleteId]   = useState(null)
  const [deleting, setDeleting]   = useState(false)

  const fetch = () => {
    setLoading(true)
    usersAPI.getAll().then(r => setList(r.data.data)).finally(() => setLoading(false))
  }

  useEffect(() => { fetch() }, [])

  const openAdd = () => {
    setEditData(null)
    setForm({ username: '', password: '', role: 'staff' })
    setModalOpen(true)
  }

  const openEdit = (u) => {
    setEditData(u)
    setForm({ username: u.username, password: '', role: u.role })
    setModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editData) {
        const payload = { username: form.username, role: form.role }
        if (form.password) payload.password = form.password
        await usersAPI.update(editData.id, payload)
        toast.success('User berhasil diupdate')
      } else {
        await usersAPI.create(form)
        toast.success('User berhasil ditambahkan')
      }
      setModalOpen(false)
      fetch()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await usersAPI.delete(deleteId)
      toast.success('User berhasil dihapus')
      setDeleteId(null)
      fetch()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-lg" style={{ color: '#f1f5f9' }}>Manage Users</h2>
          <p className="text-xs" style={{ color: '#64748b' }}>{list.length} pengguna terdaftar</p>
        </div>
        <button onClick={openAdd} className="btn-primary text-xs">
          <PlusIcon className="w-4 h-4" /> Tambah User
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid #334155' }}>
                {['User', 'Role', 'Bergabung', 'Aksi'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: '#64748b' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonTable rows={4} cols={4} />
              ) : list.length === 0 ? (
                <tr><td colSpan={4}>
                  <EmptyState title="Belum ada user" message="Tambahkan user baru"
                    action={<button onClick={openAdd} className="btn-primary text-xs"><PlusIcon className="w-4 h-4" />Tambah User</button>} />
                </td></tr>
              ) : list.map(u => (
                <tr key={u.id} className="table-row">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ background: u.role === 'admin' ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
                        {u.username[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: '#e2e8f0' }}>{u.username}</p>
                        {u.id === me?.id && <span className="text-xs" style={{ color: '#6366f1' }}>Akun Anda</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${u.role === 'admin' ? 'badge-indigo' : 'badge-green'} flex items-center gap-1 w-fit`}>
                      {u.role === 'admin' ? <ShieldCheckIcon className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#94a3b8' }}>
                    {new Date(u.created_at).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button onClick={() => openEdit(u)}
                        className="p-1.5 rounded-lg hover:bg-indigo-500/20 transition-colors"
                        style={{ color: '#6366f1' }}>
                        <PencilSquareIcon className="w-4 h-4" />
                      </button>
                      {u.id !== me?.id && (
                        <button onClick={() => setDeleteId(u.id)}
                          className="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors"
                          style={{ color: '#ef4444' }}>
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}
        title={editData ? 'Edit User' : 'Tambah User Baru'} size="sm">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>Username *</label>
            <input className="input-field" placeholder="Username" value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))} required autoFocus />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>
              Password {editData && <span style={{ color: '#475569' }}>(kosongkan jika tidak diubah)</span>}
            </label>
            <input type="password" className="input-field" placeholder="Password"
              value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required={!editData} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>Role *</label>
            <select className="input-field" value={form.role}
              onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2" style={{ borderTop: '1px solid #334155' }}>
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Batal</button>
            <button type="submit" className="btn-primary flex-1 justify-center" disabled={saving}>
              {saving ? 'Menyimpan...' : editData ? 'Update' : 'Simpan'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        loading={deleting} title="Hapus User"
        message="User ini akan dihapus permanen dari sistem." />
    </div>
  )
}
