import { useEffect, useState } from 'react'
import { kelasAPI } from '../services/api'
import toast from 'react-hot-toast'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'
import { PlusIcon, PencilSquareIcon, TrashIcon, AcademicCapIcon } from '@heroicons/react/24/outline'

export default function KelasPage() {
  const [list, setList]           = useState([])
  const [loading, setLoading]     = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editData, setEditData]   = useState(null)
  const [form, setForm]           = useState({ nama_kelas: '' })
  const [saving, setSaving]       = useState(false)
  const [deleteId, setDeleteId]   = useState(null)
  const [deleting, setDeleting]   = useState(false)

  const fetch = () => {
    setLoading(true)
    kelasAPI.getAll().then(r => setList(r.data.data)).finally(() => setLoading(false))
  }

  useEffect(() => { fetch() }, [])

  const openAdd = () => { setEditData(null); setForm({ nama_kelas: '' }); setModalOpen(true) }
  const openEdit = (k) => { setEditData(k); setForm({ nama_kelas: k.nama_kelas }); setModalOpen(true) }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editData) {
        await kelasAPI.update(editData.id, form)
        toast.success('Kelas berhasil diupdate')
      } else {
        await kelasAPI.create(form)
        toast.success('Kelas berhasil ditambahkan')
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
      await kelasAPI.delete(deleteId)
      toast.success('Kelas berhasil dihapus')
      setDeleteId(null)
      fetch()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus')
    } finally {
      setDeleting(false)
    }
  }

  const colors = ['badge-green', 'badge-yellow', 'badge-indigo', 'badge-blue', 'badge-purple']

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-lg" style={{ color: '#f1f5f9' }}>Manajemen Kelas</h2>
          <p className="text-xs" style={{ color: '#64748b' }}>{list.length} kelas terdaftar</p>
        </div>
        <button onClick={openAdd} className="btn-primary text-xs">
          <PlusIcon className="w-4 h-4" /> Tambah Kelas
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="card p-5">
              <div className="skeleton h-10 w-10 rounded-xl mb-3" />
              <div className="skeleton h-5 w-16 mb-2 rounded" />
              <div className="skeleton h-3 w-24 rounded" />
            </div>
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="card">
          <EmptyState title="Belum ada kelas" message="Tambahkan kelas terlebih dahulu"
            action={<button onClick={openAdd} className="btn-primary text-xs"><PlusIcon className="w-4 h-4" />Tambah Kelas</button>} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((k, i) => (
            <div key={k.id} className="card card-hover p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(99,102,241,0.1)' }}>
                  <AcademicCapIcon className="w-6 h-6" style={{ color: '#6366f1' }} />
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => openEdit(k)}
                    className="p-1.5 rounded-lg hover:bg-indigo-500/20 transition-colors"
                    style={{ color: '#6366f1' }}>
                    <PencilSquareIcon className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleteId(k.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors"
                    style={{ color: '#ef4444' }}>
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-xl font-bold mb-1" style={{ color: '#f1f5f9' }}>Kelas {k.nama_kelas}</p>
              <div className="flex items-center gap-2">
                <span className={`badge ${colors[i % colors.length]}`}>{k.jumlah_siswa} siswa</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}
        title={editData ? 'Edit Kelas' : 'Tambah Kelas'} size="sm">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>Nama Kelas *</label>
            <input className="input-field" placeholder="Contoh: X, XI, XII" value={form.nama_kelas}
              onChange={e => setForm({ nama_kelas: e.target.value })} required autoFocus />
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
        loading={deleting} title="Hapus Kelas"
        message="Kelas ini akan dihapus. Pastikan tidak ada siswa di kelas ini." />
    </div>
  )
}
