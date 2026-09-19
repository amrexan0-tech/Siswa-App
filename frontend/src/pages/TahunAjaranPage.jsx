import { useEffect, useState } from 'react'
import { tahunAjaranAPI } from '../services/api'
import toast from 'react-hot-toast'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'
import { PlusIcon, PencilSquareIcon, TrashIcon, CalendarIcon } from '@heroicons/react/24/outline'

export default function TahunAjaranPage() {
  const [list, setList]           = useState([])
  const [loading, setLoading]     = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editData, setEditData]   = useState(null)
  const [form, setForm]           = useState({ tahun: '' })
  const [saving, setSaving]       = useState(false)
  const [deleteId, setDeleteId]   = useState(null)
  const [deleting, setDeleting]   = useState(false)

  const fetch = () => {
    setLoading(true)
    tahunAjaranAPI.getAll().then(r => setList(r.data.data)).finally(() => setLoading(false))
  }

  useEffect(() => { fetch() }, [])

  const openAdd  = () => { setEditData(null); setForm({ tahun: '' }); setModalOpen(true) }
  const openEdit = (t) => { setEditData(t); setForm({ tahun: t.tahun }); setModalOpen(true) }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editData) {
        await tahunAjaranAPI.update(editData.id, form)
        toast.success('Tahun ajaran berhasil diupdate')
      } else {
        await tahunAjaranAPI.create(form)
        toast.success('Tahun ajaran berhasil ditambahkan')
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
      await tahunAjaranAPI.delete(deleteId)
      toast.success('Tahun ajaran berhasil dihapus')
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
          <h2 className="font-bold text-lg" style={{ color: '#f1f5f9' }}>Tahun Ajaran</h2>
          <p className="text-xs" style={{ color: '#64748b' }}>{list.length} tahun ajaran terdaftar</p>
        </div>
        <button onClick={openAdd} className="btn-primary text-xs">
          <PlusIcon className="w-4 h-4" /> Tambah Tahun Ajaran
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="card p-5">
              <div className="skeleton h-10 w-10 rounded-xl mb-3" />
              <div className="skeleton h-5 w-28 mb-2 rounded" />
              <div className="skeleton h-3 w-20 rounded" />
            </div>
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="card">
          <EmptyState title="Belum ada tahun ajaran" message="Tambahkan tahun ajaran terlebih dahulu"
            action={<button onClick={openAdd} className="btn-primary text-xs"><PlusIcon className="w-4 h-4" />Tambah</button>} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((t, i) => (
            <div key={t.id} className="card card-hover p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(245,158,11,0.1)' }}>
                  <CalendarIcon className="w-6 h-6" style={{ color: '#f59e0b' }} />
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => openEdit(t)}
                    className="p-1.5 rounded-lg hover:bg-indigo-500/20 transition-colors"
                    style={{ color: '#6366f1' }}>
                    <PencilSquareIcon className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleteId(t.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors"
                    style={{ color: '#ef4444' }}>
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-lg font-bold mb-1" style={{ color: '#f1f5f9' }}>{t.tahun}</p>
              <span className="badge badge-yellow">{t.jumlah_siswa} siswa</span>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}
        title={editData ? 'Edit Tahun Ajaran' : 'Tambah Tahun Ajaran'} size="sm">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>Tahun Ajaran *</label>
            <input className="input-field" placeholder="2024/2025" value={form.tahun}
              onChange={e => setForm({ tahun: e.target.value })} required autoFocus />
            <p className="text-xs mt-1" style={{ color: '#475569' }}>Format: YYYY/YYYY (contoh: 2024/2025)</p>
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
        loading={deleting} title="Hapus Tahun Ajaran"
        message="Tahun ajaran ini akan dihapus. Pastikan tidak ada siswa di tahun ajaran ini." />
    </div>
  )
}
