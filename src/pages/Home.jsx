import { useNavigate } from 'react-router-dom'
import { units } from '../data/lessons'
import { useProgress } from '../context/ProgressContext.jsx'

function UnitNode({ unit, index, status, score, onClick }) {
  // Zigzag estilo Duolingo
  const offsets = [0, 48, 70, 48, 0, -48, -70, -48]
  const dx = offsets[index % offsets.length]

  const locked = status === 'locked'
  const done = status === 'done'

  return (
    <div className="flex flex-col items-center" style={{ transform: `translateX(${dx}px)` }}>
      <button
        onClick={onClick}
        disabled={locked}
        className={`relative w-20 h-20 rounded-full flex items-center justify-center text-3xl
          transition-transform active:translate-y-1 ${locked ? 'cursor-not-allowed' : 'hover:scale-105'}`}
        style={{
          background: locked ? '#e5e5e5' : unit.color,
          boxShadow: locked ? '0 5px 0 0 #cfcfcf' : `0 6px 0 0 rgba(0,0,0,0.18)`,
        }}
        title={unit.title}
      >
        <span className={locked ? 'opacity-40 grayscale' : ''}>{unit.icon}</span>
        {done && (
          <span className="absolute -top-1 -right-1 bg-white rounded-full text-base w-7 h-7 flex items-center justify-center border-2 border-duo-line">
            ✅
          </span>
        )}
      </button>
      <div className="mt-2 text-center">
        <div className="font-display font-extrabold text-sm text-duo-ink">{unit.title}</div>
        <div className="text-xs text-duo-gray">{unit.subtitle}</div>
        {done && <div className="text-xs font-bold text-duo-green">Mejor: {score}%</div>}
      </div>
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const { progress } = useProgress()

  // Una unidad se desbloquea cuando la anterior está completada.
  const statusFor = (index) => {
    if (index === 0) return progress.completedUnits[units[0].id]?.done ? 'done' : 'open'
    const prevDone = progress.completedUnits[units[index - 1].id]?.done
    const thisDone = progress.completedUnits[units[index].id]?.done
    if (thisDone) return 'done'
    return prevDone ? 'open' : 'locked'
  }

  return (
    <div>
      <section className="card mb-8 bg-gradient-to-br from-green-50 to-white">
        <h1 className="font-display font-extrabold text-2xl text-duo-ink">
          Bienvenido/a, futuro camarero/a 🦉
        </h1>
        <p className="text-duo-gray mt-1">
          Aprende el sueco que necesitas para servir en{' '}
          <strong>Strömstad Spa &amp; Resort</strong>: el menú real, los alérgenos y
          las frases para atender a cada mesa.
        </p>
      </section>

      <div className="flex flex-col items-center gap-8">
        {units.map((unit, i) => {
          const status = statusFor(i)
          const score = progress.completedUnits[unit.id]?.best ?? 0
          return (
            <UnitNode
              key={unit.id}
              unit={unit}
              index={i}
              status={status}
              score={score}
              onClick={() => navigate(`/leccion/${unit.id}`)}
            />
          )
        })}
      </div>
    </div>
  )
}
