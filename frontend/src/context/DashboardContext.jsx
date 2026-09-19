import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { dashboardAPI } from '../services/api'
import { isAuthenticated } from '../utils/auth'
import toast from 'react-hot-toast'

const DashboardContext = createContext(null)

const POLL_INTERVAL = 3000 // 3 detik

/**
 * Bandingkan data dashboard lama vs baru.
 * Return true jika ada perubahan pada jumlah siswa.
 */
function hasDataChanged(prev, next) {
  if (!prev || !next) return false
  // Cek total_siswa berubah
  if (prev.stats?.total_siswa !== next.stats?.total_siswa) return true
  // Cek distribusi jurusan berubah
  const prevJurusan = JSON.stringify(prev.chart?.per_jurusan)
  const nextJurusan = JSON.stringify(next.chart?.per_jurusan)
  if (prevJurusan !== nextJurusan) return true
  return false
}

export function DashboardProvider({ children }) {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading]             = useState(true)
  const [lastUpdated, setLastUpdated]     = useState(null)
  const prevDataRef = useRef(null)

  const fetchDashboard = useCallback(async (silent = false) => {
    // Jangan fetch jika user tidak login
    if (!isAuthenticated()) return

    try {
      const res  = await dashboardAPI.get()
      const data = res.data?.data

      if (!data) return

      // Deteksi perubahan untuk toast notifikasi
      if (prevDataRef.current && hasDataChanged(prevDataRef.current, data)) {
        toast('📊 Data dashboard diperbarui', {
          icon: '🔄',
          duration: 2000,
          style: {
            background: 'rgba(30,41,59,0.95)',
            color: '#e2e8f0',
            border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: '12px',
            fontSize: '13px',
          },
        })
      }

      prevDataRef.current = data
      setDashboardData(data)
      setLastUpdated(new Date())
    } catch {
      // Silent fail — jangan ganggu UX dengan error polling
    } finally {
      if (!silent) setLoading(false)
    }
  }, [])

  // Fetch pertama kali
  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  // Polling setiap 3 detik
  useEffect(() => {
    const interval = setInterval(() => fetchDashboard(true), POLL_INTERVAL)
    return () => clearInterval(interval)
  }, [fetchDashboard])

  /**
   * refreshDashboard — dipanggil manual setelah aksi mutasi (tambah/edit/hapus/import)
   * Langsung fetch tanpa menunggu polling interval berikutnya
   */
  const refreshDashboard = useCallback(() => {
    fetchDashboard(true)
  }, [fetchDashboard])

  return (
    <DashboardContext.Provider value={{ dashboardData, loading, lastUpdated, refreshDashboard }}>
      {children}
    </DashboardContext.Provider>
  )
}

export const useDashboard = () => {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error('useDashboard must be used inside DashboardProvider')
  return ctx
}
