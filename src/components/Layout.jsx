import { Outlet, NavLink } from 'react-router-dom'
import { useProgress } from '../context/ProgressContext.jsx'

function Stat({ icon, value, color }) {
  return (
    <div className="flex items-center gap-1 font-display font-extrabold" style={{ color }}>
      <span className="text-xl">{icon}</span>
      <span>{value}</span>
    </div>
  )
}

export default function Layout() {
  const { progress, profile } = useProgress()

  const navItem = ({ isActive }) =>
    `flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
      isActive ? 'text-duo-green bg-green-50' : 'text-duo-gray hover:bg-gray-50'
    }`

  return (
    <div className="min-h-full flex flex-col">
      {/* Barra superior con estadísticas */}
      <header className="sticky top-0 z-10 bg-white border-b-2 border-duo-line pt-[env(safe-area-inset-top)]">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 font-display font-extrabold text-duo-green">
            <img src="/owl.svg" alt="" className="w-7 h-7" />
            <span className="hidden sm:inline">Menyspråket</span>
            {profile && (
              <span
                className="ml-1 flex items-center gap-1 text-sm px-2 py-0.5 rounded-full text-white"
                style={{ background: profile.color }}
              >
                {profile.emoji} {profile.name}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Stat icon="🔥" value={progress.streak} color="#ff9600" />
            <Stat icon="⭐" value={progress.xp} color="#ffc800" />
            <Stat icon="❤️" value={progress.hearts} color="#ff4b4b" />
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-6 pb-24">
        <Outlet />
      </main>

      {/* Navegación inferior */}
      <nav className="fixed bottom-0 inset-x-0 bg-white border-t-2 border-duo-line pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-2xl mx-auto flex justify-around py-1">
          <NavLink to="/" className={navItem} end>
            <span className="text-xl">🏠</span>
            Aprender
          </NavLink>
          <NavLink to="/guia" className={navItem}>
            <span className="text-xl">📖</span>
            Guía
          </NavLink>
          <NavLink to="/perfil" className={navItem}>
            <span className="text-xl">🦉</span>
            Perfil
          </NavLink>
        </div>
      </nav>
    </div>
  )
}
