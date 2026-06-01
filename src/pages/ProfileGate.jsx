import { PROFILES, useProgress } from '../context/ProgressContext.jsx'

// Pantalla de "auth" mínima: ¿Quién eres? Belu o Marco.
export default function ProfileGate() {
  const { selectProfile } = useProgress()

  return (
    <div className="min-h-full flex flex-col items-center justify-center px-6 py-10 bg-gradient-to-b from-green-50 to-white">
      <img src="/owl.svg" alt="" className="w-20 h-20 mb-4" />
      <h1 className="font-display font-extrabold text-3xl text-duo-green text-center">
        Menyspråket
      </h1>
      <p className="text-duo-gray text-center mt-1 mb-8">
        Sueco para camareros de Strömstad Spa
      </p>

      <h2 className="font-display font-extrabold text-xl text-duo-ink mb-5">
        ¿Quién eres?
      </h2>

      <div className="grid grid-cols-2 gap-5 w-full max-w-md">
        {PROFILES.map((p) => (
          <button
            key={p.id}
            onClick={() => selectProfile(p.id)}
            className="card flex flex-col items-center gap-3 py-8 transition-transform hover:scale-105 active:translate-y-1"
            style={{ borderColor: p.color }}
          >
            <span
              className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
              style={{ background: p.color, boxShadow: '0 5px 0 0 rgba(0,0,0,0.15)' }}
            >
              {p.emoji}
            </span>
            <span className="font-display font-extrabold text-xl text-duo-ink">{p.name}</span>
          </button>
        ))}
      </div>

      <p className="text-xs text-duo-gray mt-10 text-center max-w-xs">
        Cada perfil guarda su propio progreso, racha y XP por separado.
      </p>
    </div>
  )
}
