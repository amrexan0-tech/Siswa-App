import { useEffect, useState, useCallback } from 'react'
import { siswaAPI, kelasAPI, jurusanAPI, tahunAjaranAPI, uploadAPI, exportAPI, importAPI } from '../services/api'
import { getUser } from '../utils/auth'
import { useDashboard } from '../context/DashboardContext'
import toast from 'react-hot-toast'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import Pagination from '../components/Pagination'
import EmptyState from '../components/EmptyState'
import { SkeletonTable } from '../components/Skeleton'
import {
  PlusIcon, MagnifyingGlassIcon, FunnelIcon, ArrowDownTrayIcon,
  ArrowUpTrayIcon, PencilSquareIcon, TrashIcon, PhotoIcon,
  DocumentArrowDownIcon, XMarkIcon
} from '@heroicons/react/24/outline'

const EMPTY_FORM = { nis: '', nama: '', alamat: '', no_hp: '', foto: '', kelas_id: '', jurusan_id: '', tahun_ajaran_id: '' }

export default function SiswaPage() {
  const { refreshDashboard } = useDashboard()
  const [siswa, setSiswa]         = useState([])
  const [meta, setMeta]           = useState({ total: 0, page: 1, limit: 10, total_pages: 1 })
  const [loading, setLoading]     = useState(true)
  const [filters, setFilters]     = useState({ search: '', kelas_id: '', jurusan_id: '', tahun_ajaran_id: '' })
  const [page, setPage]           = useState(1)

  // Refs data
  const [kelasList, setKelasList]     = useState([])
  const [jurusanList, setJurusanList] = useState([])
  const [tahunList, setTahunList]     = useState([])

  // Modal states
  const [modalOpen, setModalOpen]     = useState(false)
  const [editData, setEditData]       = useState(null)
  const [form, setForm]               = useState(EMPTY_FORM)
  const [saving, setSaving]           = useState(false)
  const [uploadingFoto, setUploadingFoto] = useState(false)

  // Delete
  const [deleteId, setDeleteId]       = useState(null)
  const [deleting, setDeleting]       = useState(false)

  // Import
  const [importModal, setImportModal] = useState(false)
  const [importing, setImporting]     = useState(false)
  const [importErrors, setImportErrors] = useState([])

  // Load reference data
  useEffect(() => {
    Promise.all([kelasAPI.getAll(), jurusanAPI.getAll(), tahunAjaranAPI.getAll()])
      .then(([k, j, t]) => {
        setKelasList(k.data.data)
        setJurusanList(j.data.data)
        setTahunList(t.data.data)
      })
  }, [])

  const fetchSiswa = useCallback(() => {
    setLoading(true)
    siswaAPI.getAll({ ...filters, page, limit: 10 })
      .then(res => {
        setSiswa(res.data.data.items)
        setMeta(res.data.data)
      })
      .finally(() => setLoading(false))
  }, [filters, page])

  useEffect(() => { fetchSiswa() }, [fetchSiswa])

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setPage(1), 400)
    return () => clearTimeout(t)
  }, [filters.search])

  const openAdd = () => {
    setEditData(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  const openEdit = (s) => {
    setEditData(s)
    setForm({
      nis: s.nis, nama: s.nama, alamat: s.alamat || '', no_hp: s.no_hp || '',
      foto: s.foto || '', kelas_id: s.kelas_id, jurusan_id: s.jurusan_id,
      tahun_ajaran_id: s.tahun_ajaran_id,
    })
    setModalOpen(true)
  }

  const handleFotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingFoto(true)
    try {
      const fd = new FormData()
      fd.append('foto', file)
      const res = await uploadAPI.foto(fd)
      setForm(f => ({ ...f, foto: res.data.data.filename }))
      toast.success('Foto berhasil diupload')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload foto gagal')
    } finally {
      setUploadingFoto(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editData) {
        await siswaAPI.update(editData.id, form)
        toast.success('Siswa berhasil diupdate')
      } else {
        await siswaAPI.create(form)
        toast.success('Siswa berhasil ditambahkan')
      }
      setModalOpen(false)
      fetchSiswa()
      refreshDashboard()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan data')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await siswaAPI.delete(deleteId)
      toast.success('Siswa berhasil dihapus')
      setDeleteId(null)
      fetchSiswa()
      refreshDashboard()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus')
    } finally {
      setDeleting(false)
    }
  }

  const handleImport = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImporting(true)
    setImportErrors([])
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await importAPI.csv(fd)
      const { imported, failed, errors } = res.data.data
      if (failed > 0) {
        setImportErrors(errors || [])
        toast.error(`Import selesai: ${imported} berhasil, ${failed} gagal`)
      } else {
        toast.success(`Import selesai: ${imported} data berhasil diimpor!`)
        setImportModal(false)
      }
      fetchSiswa()
      refreshDashboard()
    } catch (err) {
      const msg = err.response?.data?.message || 'Import gagal'
      toast.error(msg)
      console.error('[Import] Error:', err.response?.data)
    } finally {
      setImporting(false)
      // Reset file input
      e.target.value = ''
    }
  }

  const handleDownloadTemplate = () => {
    const user = getUser()
    const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost/siswa-app/backend/public'
    const query = user ? `?_user=${encodeURIComponent(JSON.stringify(user))}` : ''
    window.open(`${BASE_URL}/import/csv${query}`, '_blank')
  }

  const badgeKelas = (nama) => {
    const map = { 'X': 'badge-green', 'XI': 'badge-yellow', 'XII': 'badge-indigo' }
    return map[nama] || 'badge-blue'
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-bold text-lg" style={{ color: '#f1f5f9' }}>Data Siswa</h2>
          <p className="text-xs" style={{ color: '#64748b' }}>{meta.total} siswa terdaftar</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setImportModal(true)} className="btn-secondary text-xs">
            <ArrowUpTrayIcon className="w-4 h-4" /> Import CSV
          </button>
          <button onClick={() => exportAPI.csv(filters)} className="btn-secondary text-xs">
            <DocumentArrowDownIcon className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={() => exportAPI.pdf(filters)} className="btn-secondary text-xs">
            <ArrowDownTrayIcon className="w-4 h-4" /> Export PDF
          </button>
          <button onClick={openAdd} className="btn-primary text-xs">
            <PlusIcon className="w-4 h-4" /> Tambah Siswa
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#475569' }} />
            <input
              type="text"
              className="input-field pl-9"
              placeholder="Cari nama, NIS..."
              value={filters.search}
              onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
            />
          </div>
          <select className="input-field" value={filters.kelas_id}
            onChange={e => { setFilters(f => ({ ...f, kelas_id: e.target.value })); setPage(1) }}>
            <option value="">Semua Kelas</option>
            {kelasList.map(k => <option key={k.id} value={k.id}>{k.nama_kelas}</option>)}
          </select>
          <select className="input-field" value={filters.jurusan_id}
            onChange={e => { setFilters(f => ({ ...f, jurusan_id: e.target.value })); setPage(1) }}>
            <option value="">Semua Jurusan</option>
            {jurusanList.map(j => <option key={j.id} value={j.id}>{j.nama_jurusan}</option>)}
          </select>
          <select className="input-field" value={filters.tahun_ajaran_id}
            onChange={e => { setFilters(f => ({ ...f, tahun_ajaran_id: e.target.value })); setPage(1) }}>
            <option value="">Semua Tahun</option>
            {tahunList.map(t => <option key={t.id} value={t.id}>{t.tahun}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid #334155' }}>
                {['Siswa', 'NIS', 'Kelas', 'Jurusan', 'Tahun Ajaran', 'No HP', 'Aksi'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: '#64748b' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonTable rows={8} cols={7} />
              ) : siswa.length === 0 ? (
                <tr><td colSpan={7}>
                  <EmptyState
                    title="Tidak ada siswa"
                    message="Belum ada data siswa yang sesuai filter"
                    action={<button onClick={openAdd} className="btn-primary text-xs"><PlusIcon className="w-4 h-4" />Tambah Siswa</button>}
                  />
                </td></tr>
              ) : siswa.map(s => (
                <tr key={s.id} className="table-row">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {s.foto ? (
                        <img src={`/api/uploads/${s.foto}`} alt={s.nama}
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                          onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex' }} />
                      ) : null}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${s.foto ? 'hidden' : ''}`}
                        style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
                        {s.nama[0]}
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: '#e2e8f0' }}>{s.nama}</p>
                        <p className="text-xs truncate max-w-32" style={{ color: '#64748b' }}>{s.alamat || '-'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className="badge badge-indigo">{s.nis}</span></td>
                  <td className="px-4 py-3"><span className={`badge ${badgeKelas(s.nama_kelas)}`}>{s.nama_kelas}</span></td>
                  <td className="px-4 py-3"><span className="badge badge-purple">{s.kode_jurusan}</span></td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#94a3b8' }}>{s.tahun}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#94a3b8' }}>{s.no_hp || '-'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button onClick={() => openEdit(s)}
                        className="p-1.5 rounded-lg transition-colors hover:bg-indigo-500/20"
                        style={{ color: '#6366f1' }} title="Edit">
                        <PencilSquareIcon className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteId(s.id)}
                        className="p-1.5 rounded-lg transition-colors hover:bg-red-500/20"
                        style={{ color: '#ef4444' }} title="Hapus">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination {...meta} onPageChange={setPage} />
      </div>

      {/* Modal Form */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}
        title={editData ? 'Edit Data Siswa' : 'Tambah Siswa Baru'} size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>NIS *</label>
              <input className="input-field" placeholder="Nomor Induk Siswa" value={form.nis}
                onChange={e => setForm(f => ({ ...f, nis: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>Nama Lengkap *</label>
              <input className="input-field" placeholder="Nama siswa" value={form.nama}
                onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} required />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>Alamat</label>
            <textarea className="input-field resize-none" rows={2} placeholder="Alamat lengkap" value={form.alamat}
              onChange={e => setForm(f => ({ ...f, alamat: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>No HP</label>
            <input className="input-field" placeholder="08xxxxxxxxxx" value={form.no_hp}
              onChange={e => setForm(f => ({ ...f, no_hp: e.target.value }))} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>Kelas *</label>
              <select className="input-field" value={form.kelas_id}
                onChange={e => setForm(f => ({ ...f, kelas_id: e.target.value }))} required>
                <option value="">Pilih Kelas</option>
                {kelasList.map(k => <option key={k.id} value={k.id}>{k.nama_kelas}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>Jurusan *</label>
              <select className="input-field" value={form.jurusan_id}
                onChange={e => setForm(f => ({ ...f, jurusan_id: e.target.value }))} required>
                <option value="">Pilih Jurusan</option>
                {jurusanList.map(j => <option key={j.id} value={j.id}>{j.kode} - {j.nama_jurusan}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>Tahun Ajaran *</label>
              <select className="input-field" value={form.tahun_ajaran_id}
                onChange={e => setForm(f => ({ ...f, tahun_ajaran_id: e.target.value }))} required>
                <option value="">Pilih Tahun</option>
                {tahunList.map(t => <option key={t.id} value={t.id}>{t.tahun}</option>)}
              </select>
            </div>
          </div>

          {/* Foto upload */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>Foto Siswa</label>
            <div className="flex items-center gap-3">
              {form.foto && (
                <img src={`/api/uploads/${form.foto}`} alt="preview"
                  className="w-12 h-12 rounded-xl object-cover" />
              )}
              <label className="btn-secondary text-xs cursor-pointer">
                <PhotoIcon className="w-4 h-4" />
                {uploadingFoto ? 'Uploading...' : 'Pilih Foto'}
                <input type="file" accept="image/*" className="hidden" onChange={handleFotoUpload} disabled={uploadingFoto} />
              </label>
              {form.foto && (
                <button type="button" onClick={() => setForm(f => ({ ...f, foto: '' }))}
                  className="text-xs" style={{ color: '#ef4444' }}>Hapus foto</button>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-2" style={{ borderTop: '1px solid #334155' }}>
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Batal</button>
            <button type="submit" className="btn-primary flex-1 justify-center" disabled={saving}>
              {saving ? 'Menyimpan...' : editData ? 'Update' : 'Simpan'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Import Modal */}
      <Modal open={importModal} onClose={() => { setImportModal(false); setImportErrors([]) }} title="Import Data Siswa CSV" size="sm">
        <div className="space-y-4">
          <div className="p-4 rounded-xl text-xs space-y-1" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <p className="font-medium" style={{ color: '#a5b4fc' }}>Format CSV (dengan header):</p>
            <p style={{ color: '#94a3b8' }}>NIS, Nama, Alamat, No HP, Nama Kelas, Kode Jurusan, Tahun Ajaran</p>
            <p style={{ color: '#94a3b8' }}>Contoh: 2024001, Ahmad, Jl. A, 081234, X, RPL, 2024/2025</p>
          </div>

          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="btn-secondary w-full justify-center text-xs"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            Download Template CSV
          </button>

          <label className="btn-primary w-full justify-center cursor-pointer">
            <ArrowUpTrayIcon className="w-4 h-4" />
            {importing ? 'Mengimport...' : 'Pilih & Upload File CSV'}
            <input type="file" accept=".csv" className="hidden" onChange={handleImport} disabled={importing} />
          </label>

          {/* Error list */}
          {importErrors.length > 0 && (
            <div className="p-3 rounded-xl text-xs space-y-1 max-h-40 overflow-y-auto"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <p className="font-medium mb-2" style={{ color: '#f87171' }}>Detail Error:</p>
              {importErrors.map((err, i) => (
                <p key={i} style={{ color: '#fca5a5' }}>{err}</p>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Hapus Siswa"
        message="Data siswa ini akan dihapus permanen. Tindakan ini tidak bisa dibatalkan."
      />
    </div>
  )
}
