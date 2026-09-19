export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ background: '#060b18' }}>
      <div className="text-center">
        <div className="relative mx-auto mb-5" style={{ width: 56, height: 56 }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white mx-auto"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 8px 32px rgba(99,102,241,0.45)' }}>
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
              <path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z" />
            </svg>
          </div>
          <div style={{
            position: 'absolute', inset: -4, borderRadius: 22,
            background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3))',
            filter: 'blur(10px)', zIndex: -1,
            animation: 'glowPulse 2s ease-in-out infinite'
          }} />
        </div>
        <p className="text-sm font-semibold mb-3" style={{ color: '#94a3b8' }}>EduCore</p>
        <div className="flex gap-1.5 justify-center">
          {[0,1,2].map(i => (
            <div key={i} className="w-1.5 h-1.5 rounded-full"
              style={{
                background: '#6366f1',
                animation: `bounce 0.8s ease-in-out ${i * 0.15}s infinite alternate`
              }}
            />
          ))}
        </div>
        <style>{`
          @keyframes bounce {
            from { transform: translateY(0); opacity: 0.3; }
            to   { transform: translateY(-8px); opacity: 1; }
          }
          @keyframes glowPulse {
            0%, 100% { opacity: 0.6; }
            50%       { opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  )
}
