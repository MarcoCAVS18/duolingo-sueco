import { units } from '../data/lessons'
import { useProgress } from '../context/ProgressContext.jsx'

function StatCard({ label, value, color }) {
  return (
    <div className="card text-center">
      <div className="font-display font-extrabold text-3xl" style={{ color }}>{value}</div>
      <div className="text-xs uppercase text-duo-gray mt-1">{label}</div>
    </div>
  )
}

export default function Profile() {
  const { progress, profile, logout, resetProgress, isFirebaseEnabled } = useProgress()

  const completed = Object.values(progress.completedUnits).filter((u) => u.done).length

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <span
          className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
          style={{ background: profile?.color, boxShadow: '0 5px 0 0 rgba(0,0,0,0.15)' }}
        >
          {profile?.emoji}
        </span>
        <div>
          <h1 className="font-display font-extrabold text-2xl text-duo-ink">{profile?.name}</h1>
          <p className="text-duo-gray text-sm">Camarero/a en formación 🦉</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label="Racha" value={`${progress.streak}🔥`} color="#ff9600" />
        <StatCard label="XP total" value={progress.xp} color="#ffc800" />
        <StatCard label="Unidades" value={`${completed}/${units.length}`} color="#58cc02" />
      </div>

      <h2 className="font-display font-extrabold text-lg text-duo-ink mb-2">Progreso por unidad</h2>
      <div className="card p-0 divide-y divide-duo-line overflow-hidden mb-6">
        {units.map((u) => {
          const data = progress.completedUnits[u.id]
          return (
            <div key={u.id} className="flex items-center justify-between px-4 py-3">
              <span className="flex items-center gap-2 font-bold text-duo-ink">
                <span>{u.icon}</span> {u.title}
              </span>
              <span className={`text-sm font-bold ${data?.done ? 'text-duo-green' : 'text-duo-gray'}`}>
                {data?.done ? `✅ ${data.best}%` : 'Pendiente'}
              </span>
            </div>
          )
        })}
      </div>

      <div
        className={`card text-sm mb-6 ${isFirebaseEnabled ? 'text-duo-greenDark bg-green-50' : 'text-duo-gray'}`}
      >
        {isFirebaseEnabled
          ? '☁️ Tu progreso se sincroniza con Firebase.'
          : '💾 Guardando en este dispositivo. Configura Firebase en el .env para sincronizar.'}
      </div>

      <div className="flex flex-col gap-3">
        <button onClick={logout} className="btn-blue w-full">Cambiar de perfil</button>
        <button
          onClick={() => {
            if (confirm('¿Seguro que quieres borrar tu progreso?')) resetProgress()
          }}
          className="btn-gray w-full"
        >
          Reiniciar progreso
        </button>
      </div>
    </div>
  )
}
