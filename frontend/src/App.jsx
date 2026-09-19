import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { isAuthenticated } from './utils/auth'
import DashboardLayout  from './layouts/DashboardLayout'
import LoginPage        from './pages/LoginPage'
import DashboardPage    from './pages/DashboardPage'
import SiswaPage        from './pages/SiswaPage'
import KelasPage        from './pages/KelasPage'
import JurusanPage      from './pages/JurusanPage'
import TahunAjaranPage  from './pages/TahunAjaranPage'
import UsersPage        from './pages/UsersPage'
import ActivityPage     from './pages/ActivityPage'
import ProfilePage      from './pages/ProfilePage'
import LoadingScreen    from './components/LoadingScreen'

/**
 * PrivateRoute — lindungi halaman dari akses tanpa login.
 *
 * Prioritas cek:
 * 1. localStorage → sumber utama, cek langsung (sinkron)
 * 2. AuthContext user state → fallback
 * 3. Jika tidak ada keduanya → redirect ke /login
 */
function PrivateRoute({ children }) {
  const { user, loading } = useAuth()

  // Cek localStorage langsung (sinkron) sebagai sumber utama
  const localUser = isAuthenticated()
  console.log('[PrivateRoute] localStorage authenticated:', localUser, '| context user:', !!user)

  // Jika localStorage punya user → render langsung
  if (localUser || user) return children

  // Masih loading verifikasi backend (tapi sudah tidak ada di localStorage)
  if (loading) return <LoadingScreen />

  // Tidak ada user di manapun → redirect ke login
  console.log('[PrivateRoute] Tidak ada user, redirect ke /login')
  return <Navigate to="/login" replace />
}

/**
 * PublicRoute — hanya untuk halaman login.
 * Jika user sudah login → redirect ke dashboard.
 */
function PublicRoute({ children }) {
  const { user } = useAuth()
  const localUser = isAuthenticated()

  console.log('[PublicRoute] localStorage authenticated:', localUser, '| context user:', !!user)

  // Sudah login → redirect ke dashboard
  if (localUser || user) return <Navigate to="/" replace />

  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />

      <Route path="/" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
        <Route index          element={<DashboardPage />} />
        <Route path="siswa"        element={<SiswaPage />} />
        <Route path="kelas"        element={<KelasPage />} />
        <Route path="jurusan"      element={<JurusanPage />} />
        <Route path="tahun-ajaran" element={<TahunAjaranPage />} />
        <Route path="users"        element={<UsersPage />} />
        <Route path="activity"     element={<ActivityPage />} />
        <Route path="profile"      element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
