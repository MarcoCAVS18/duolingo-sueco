import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { units } from '../data/lessons'
import { useProgress } from '../context/ProgressContext.jsx'
import { speak, speakSlow, isSpeechSupported } from '../lib/speech'
import { haptics } from '../lib/haptics'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Palabras "ya en progreso": de unidades completadas + la que tienes abierta.
function useLearnedItems() {
  const { progress } = useProgress()
  return useMemo(() => {
    const learned = units.filter((u, i) => {
      if (u.isReview) return false // los repasos repiten palabras
      const done = progress.completedUnits[u.id]?.done
      const prevDone = i === 0 || progress.completedUnits[units[i - 1].id]?.done
      return done || prevDone // completada o desbloqueada (en curso)
    })
    const map = new Map()
    learned.flatMap((u) => u.items).forEach((it) => {
      if (!map.has(it.sv)) map.set(it.sv, it)
    })
    return [...map.values()]
  }, [progress.completedUnits])
}

export default function Flashcards() {
  const learned = useLearnedItems()
  const [deck, setDeck] = useState(() => shuffle(learned))
  const [pos, setPos] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [known, setKnown] = useState(0)
  const [reviewed, setReviewed] = useState(0)
  const [finished, setFinished] = useState(false)

  const restart = () => {
    setDeck(shuffle(learned))
    setPos(0)
    setFlipped(false)
    setKnown(0)
    setReviewed(0)
    setFinished(false)
  }

  if (learned.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🃏</div>
        <h1 className="font-display font-extrabold text-xl text-duo-ink mb-2">Aún no hay tarjetas</h1>
        <p className="text-duo-gray mb-6">Empieza una lección y aquí aparecerán las palabras que vayas aprendiendo.</p>
        <Link to="/" className="btn-green">Ir a aprender</Link>
      </div>
    )
  }

  if (finished) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="font-display font-extrabold text-2xl text-duo-ink">¡Repaso terminado!</h1>
        <p className="text-duo-gray mt-2">
          Repasaste {reviewed} tarjetas · sabías <strong className="text-duo-green">{known}</strong>
        </p>
        <div className="flex flex-col gap-3 max-w-xs mx-auto mt-8">
          <button onClick={() => { haptics.tap(); restart() }} className="btn-green w-full">Repasar otra vez</button>
          <Link to="/" className="btn-gray w-full text-center">Volver al mapa</Link>
        </div>
      </div>
    )
  }

  const card = deck[pos]

  const advance = () => {
    setFlipped(false)
    setReviewed((r) => r + 1)
    if (pos + 1 >= deck.length) setFinished(true)
    else setPos((p) => p + 1)
  }

  const onKnow = () => {
    haptics.success()
    setKnown((k) => k + 1)
    advance()
  }
  const onDontKnow = () => {
    haptics.error()
    // La que no sabes vuelve a aparecer al final del mazo.
    setDeck((d) => [...d, card])
    advance()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-display font-extrabold text-xl text-duo-ink">Tarjetas</h1>
        <span className="text-sm font-bold text-duo-gray">
          {pos + 1} / {deck.length}
        </span>
      </div>

      {/* Barra de progreso */}
      <div className="h-3 rounded-full bg-duo-line overflow-hidden mb-6">
        <div
          className="h-full bg-duo-green rounded-full transition-all"
          style={{ width: `${(pos / deck.length) * 100}%` }}
        />
      </div>

      {/* Tarjeta */}
      <button
        onClick={() => { haptics.light(); setFlipped((f) => !f) }}
        className="w-full"
        style={{ perspective: '1000px' }}
        aria-label="Girar tarjeta"
      >
        <div
          className="relative w-full h-64 transition-transform duration-500"
          style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'none' }}
        >
          {/* Frente: sueco */}
          <div
            className="absolute inset-0 card flex flex-col items-center justify-center gap-4 bg-white"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="text-3xl font-display font-extrabold text-duo-ink text-center px-4">
              {card.sv}
            </div>
            {isSpeechSupported() && (
              <div className="flex gap-2">
                <span
                  role="button"
                  onClick={(e) => { e.stopPropagation(); haptics.light(); speak(card.sv) }}
                  className="inline-flex items-center justify-center w-11 h-11 rounded-xl text-white bg-duo-blue text-xl"
                  style={{ boxShadow: '0 3px 0 0 #1899d6' }}
                >
                  🔊
                </span>
                {card.sv.includes(' ') && (
                  <span
                    role="button"
                    onClick={(e) => { e.stopPropagation(); haptics.light(); speakSlow(card.sv) }}
                    className="inline-flex items-center justify-center w-11 h-11 rounded-xl text-white bg-duo-purple text-xl"
                    style={{ boxShadow: '0 3px 0 0 #b15ef0' }}
                  >
                    🐢
                  </span>
                )}
              </div>
            )}
            <div className="text-xs text-duo-gray">Toca para ver el significado</div>
          </div>

          {/* Reverso: español */}
          <div
            className="absolute inset-0 card flex flex-col items-center justify-center gap-2 bg-green-50"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div className="text-2xl font-display font-extrabold text-duo-greenDark text-center px-4">
              {card.es}
            </div>
            {card.hint && <div className="text-sm text-duo-gray text-center px-6">💡 {card.hint}</div>}
            <div className="text-xs text-duo-gray mt-1">¿La sabías?</div>
          </div>
        </div>
      </button>

      {/* Acciones */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        <button onClick={onDontKnow} className="btn-3d bg-duo-red w-full">No la sé</button>
        <button onClick={onKnow} className="btn-3d bg-duo-green w-full">¡La sé!</button>
      </div>
      <p className="text-center text-xs text-duo-gray mt-4">
        Las que no sepas volverán a aparecer al final del mazo.
      </p>
    </div>
  )
}
