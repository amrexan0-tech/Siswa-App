import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [form, setForm]       = useState({ username: '', password: '' })
  const [showPw, setShowPw]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { login }             = useAuth()

  useEffect(() => {
    // Cek localStorage — jika sudah login, langsung ke dashboard
    const user = localStorage.getItem('educore_user')
    console.log('[LoginPage] USER di localStorage:', user)
    if (user) {
      console.log('[LoginPage] Sudah login, redirect ke dashboard')
      window.location.href = '/'
      return
    }

    const t = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(t)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username.trim() || !form.password.trim()) {
      toast.error('Username dan password wajib diisi')
      return
    }
    setLoading(true)
    try {
      const result = await login(form.username.trim(), form.password)
      console.log('[LoginPage] Login berhasil, result:', result)
      console.log('[LoginPage] localStorage setelah login:', localStorage.getItem('educore_user'))
      toast.success('Selamat datang kembali!')
      // Hard redirect — pastikan localStorage sudah tersimpan sebelum navigasi
      setTimeout(() => {
        window.location.href = '/'
      }, 300)
    } catch (err) {
      console.error('[LoginPage] Login gagal:', err?.response?.data || err.message)
      const msg = err.response?.data?.message || 'Username atau password salah'
      toast.error(msg)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden login-bg">

      {/* Animated background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Grid overlay */}
      <div className="grid-overlay" />

      {/* Card */}
      <div
        className="login-card w-full max-w-md relative z-10"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
        }}
      >
        {/* Logo & Brand */}
        <div className="text-center mb-8">
          <div className="logo-wrapper mx-auto mb-4">
            <div className="logo-inner">
              {/* Lightning bolt icon */}
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-white">
                <path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z" />
              </svg>
            </div>
            <div className="logo-glow" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#f1f5f9' }}>
            EduCore
          </h1>
          <p className="text-sm mt-1" style={{ color: '#64748b' }}>
            Sistem Informasi Akademik
          </p>
        </div>

        {/* Form */}
        <div className="space-y-1 mb-2">
          <h2 className="text-base font-semibold" style={{ color: '#e2e8f0' }}>Masuk ke Akun</h2>
          <p className="text-xs" style={{ color: '#64748b' }}>Masukkan kredensial Anda untuk melanjutkan</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Username */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>
              Username
            </label>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
              <input
                type="text"
                className="login-input"
                placeholder="Masukkan username"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                autoFocus
                autoComplete="username"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>
              Password
            </label>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                type={showPw ? 'text' : 'password'}
                className="login-input pr-10"
                placeholder="Masukkan password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                autoComplete="current-password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="pw-toggle"
                tabIndex={-1}
              >
                {showPw ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Memproses...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Masuk
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs mt-6" style={{ color: '#334155' }}>
          EduCore &copy; {new Date().getFullYear()} &mdash; Sistem Informasi Akademik
        </p>
      </div>

      <style>{`
        .login-bg {
          background: #060b18;
        }

        /* Animated orbs */
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          animation: floatOrb 8s ease-in-out infinite;
        }
        .orb-1 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(99,102,241,0.18), transparent 70%);
          top: -100px; right: -100px;
          animation-delay: 0s;
        }
        .orb-2 {
          width: 350px; height: 350px;
          background: radial-gradient(circle, rgba(139,92,246,0.14), transparent 70%);
          bottom: -80px; left: -80px;
          animation-delay: -3s;
        }
        .orb-3 {
          width: 250px; height: 250px;
          background: radial-gradient(circle, rgba(59,130,246,0.1), transparent 70%);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: -5s;
        }
        @keyframes floatOrb {
          0%, 100% { transform: translateY(0) scale(1); }
          50%       { transform: translateY(-20px) scale(1.05); }
        }
        .orb-3 {
          animation: floatOrb3 10s ease-in-out infinite;
        }
        @keyframes floatOrb3 {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50%       { transform: translate(-50%, -55%) scale(1.08); }
        }

        /* Grid overlay */
        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        /* Card */
        .login-card {
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(99,102,241,0.18);
          border-radius: 24px;
          padding: 2.5rem;
          box-shadow:
            0 0 0 1px rgba(99,102,241,0.08),
            0 32px 64px rgba(0,0,0,0.5),
            0 0 80px rgba(99,102,241,0.06);
        }

        /* Logo */
        .logo-wrapper {
          position: relative;
          width: 64px;
          height: 64px;
        }
        .logo-inner {
          width: 64px;
          height: 64px;
          border-radius: 18px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 1;
          box-shadow: 0 8px 32px rgba(99,102,241,0.4);
        }
        .logo-glow {
          position: absolute;
          inset: -4px;
          border-radius: 22px;
          background: linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3));
          filter: blur(12px);
          z-index: 0;
          animation: glowPulse 3s ease-in-out infinite;
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.08); }
        }

        /* Input */
        .input-wrapper {
          position: relative;
        }
        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #475569;
          pointer-events: none;
          display: flex;
          align-items: center;
        }
        .login-input {
          width: 100%;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(51, 65, 85, 0.8);
          border-radius: 12px;
          color: #f1f5f9;
          padding: 0.7rem 0.875rem 0.7rem 2.75rem;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .login-input:focus {
          border-color: rgba(99,102,241,0.7);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12), 0 0 20px rgba(99,102,241,0.08);
          background: rgba(15, 23, 42, 0.95);
        }
        .login-input::placeholder {
          color: #334155;
        }
        .login-input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .pw-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #475569;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }
        .pw-toggle:hover {
          color: #94a3b8;
        }

        /* Button */
        .login-btn {
          width: 100%;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 600;
          color: white;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          box-shadow: 0 4px 20px rgba(99,102,241,0.35);
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
          margin-top: 0.5rem;
        }
        .login-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(99,102,241,0.5);
        }
        .login-btn:hover:not(:disabled)::before {
          opacity: 1;
        }
        .login-btn:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 4px 15px rgba(99,102,241,0.3);
        }
        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }
      `}</style>
    </div>
  )
}
