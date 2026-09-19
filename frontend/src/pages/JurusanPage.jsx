import { useEffect, useState } from 'react'
import { jurusanAPI } from '../services/api'
import toast from 'react-hot-toast'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'
import { PlusIcon, PencilSquareIcon, TrashIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline'

export default function JurusanPage() {
  const [list, setList]           = useState([])
  const [loading, setLoading]     = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editData, setEditData]   = useState(null)
  const [form, setForm]           = useState({ nama_jurusan: '', kode: '' })
  const [saving, setSaving]       = useState(false)
  const [deleteId, setDeleteId]   = useState(null)
  const [deleting, setDeleting]   = useState(false)

  const fetch = () => {
    setLoading(true)
    jurusanAPI.getAll().then(r => setList(r.data.data)).finally(() => setLoading(false))
  }

  useEffect(() => { fetch() }, [])

  const openAdd  = () => { setEditData(null); setForm({ nama_jurusan: '', kode: '' }); setModalOpen(true) }
  const openEdit = (j) => { setEditData(j); setForm({ nama_jurusan: j.nama_jurusan, kode: j.kode }); setModalOpen(true) }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editData) {
        await jurusanAPI.update(editData.id, form)
        toast.success('Jurusan berhasil diupdate')
      } else {
        await jurusanAPI.create(form)
        toast.success('Jurusan berhasil ditambahkan')
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
      await jurusanAPI.delete(deleteId)
      toast.success('Jurusan berhasil dihapus')
      setDeleteId(null)
      fetch()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus')
    } finally {
      setDeleting(false)
    }
  }

  const badgeColors = ['badge-indigo', 'badge-blue', 'badge-purple', 'badge-green', 'badge-yellow']

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-lg" style={{ color: '#f1f5f9' }}>Manajemen Jurusan</h2>
          <p className="text-xs" style={{ color: '#64748b' }}>{list.length} jurusan terdaftar</p>
        </div>
        <button onClick={openAdd} className="btn-primary text-xs">
          <PlusIcon className="w-4 h-4" /> Tambah Jurusan
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="card p-5">
              <div className="skeleton h-10 w-10 rounded-xl mb-3" />
              <div className="skeleton h-5 w-24 mb-2 rounded" />
              <div className="skeleton h-3 w-32 rounded" />
            </div>
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="card">
          <EmptyState title="Belum ada jurusan" message="Tambahkan jurusan terlebih dahulu"
            action={<button onClick={openAdd} className="btn-primary text-xs"><PlusIcon className="w-4 h-4" />Tambah Jurusan</button>} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((j, i) => (
            <div key={j.id} className="card card-hover p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
                  {j.kode}
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => openEdit(j)}
                    className="p-1.5 rounded-lg hover:bg-indigo-500/20 transition-colors"
                    style={{ color: '#6366f1' }}>
                    <PencilSquareIcon className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleteId(j.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors"
                    style={{ color: '#ef4444' }}>
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="font-semibold mb-1" style={{ color: '#f1f5f9' }}>{j.nama_jurusan}</p>
              <div className="flex items-center gap-2">
                <span className={`badge ${badgeColors[i % badgeColors.length]}`}>{j.jumlah_siswa} siswa</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}
        title={editData ? 'Edit Jurusan' : 'Tambah Jurusan'} size="sm">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>Nama Jurusan *</label>
            <input className="input-field" placeholder="Rekayasa Perangkat Lunak" value={form.nama_jurusan}
              onChange={e => setForm(f => ({ ...f, nama_jurusan: e.target.value }))} required autoFocus />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>Kode *</label>
            <input className="input-field" placeholder="RPL" value={form.kode}
              onChange={e => setForm(f => ({ ...f, kode: e.target.value.toUpperCase() }))} required maxLength={10} />
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
        loading={deleting} title="Hapus Jurusan"
        message="Jurusan ini akan dihapus. Pastikan tidak ada siswa di jurusan ini." />
    </div>
  )
}
