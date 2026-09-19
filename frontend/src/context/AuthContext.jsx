import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'
import { getUser, setStoredUser, clearStoredUser } from '../utils/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // Inisialisasi langsung dari localStorage — tidak perlu tunggu backend
  const [user, setUser]     = useState(() => getUser())
  // loading hanya true jika ada user di localStorage yang perlu diverifikasi
  const [loading, setLoading] = useState(false)

  console.log('[AuthContext] Init — user dari localStorage:', user)

  useEffect(() => {
    // Verifikasi background ke backend HANYA sebagai sinkronisasi data terbaru
    // Jika gagal, JANGAN hapus user — localStorage tetap jadi sumber kebenaran
    const storedUser = getUser()
    if (!storedUser) {
      // Tidak ada user di localStorage → tidak perlu cek backend
      setLoading(false)
      return
    }

    // Ada user di localStorage → verifikasi ke backend (opsional, background)
    setLoading(true)
    authAPI.me()
      .then(res => {
        // Backend mengembalikan data user terbaru → update localStorage
        const userData = res.data?.data
        if (userData) {
          setStoredUser(userData)
          setUser(userData)
          console.log('[AuthContext] Session PHP valid, user diperbarui:', userData)
        }
      })
      .catch((err) => {
        // Backend gagal (CORS, session expired, network error) →
        // TETAP pertahankan user dari localStorage, jangan redirect!
        console.warn('[AuthContext] Backend me() gagal, pakai localStorage:', err?.response?.status)
        // Hanya logout jika 401 DAN localStorage tidak punya user
        // (kasus ini seharusnya tidak terjadi karena kita cek storedUser di atas)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = async (username, password) => {
    const res = await authAPI.login({ username, password })

    // Backend bisa return { success, data: user } atau { status, user }
    const userData = res.data?.data || res.data?.user

    if (!userData) {
      console.error('[AuthContext] Login response tidak punya data user:', res.data)
      throw new Error('Response login tidak valid')
    }

    // Simpan ke localStorage DULU sebelum update state
    setStoredUser(userData)
    setUser(userData)

    console.log('[AuthContext] Login berhasil!')
    console.log('[AuthContext] USER data:', userData)
    console.log('[AuthContext] localStorage:', localStorage.getItem('educore_user'))

    return res.data
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch {
      // silent — logout tetap dilakukan meski backend gagal
    } finally {
      setUser(null)
      clearStoredUser()
      console.log('[AuthContext] Logout — localStorage cleared')
    }
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
