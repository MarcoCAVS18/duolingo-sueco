import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { units } from '../data/lessons'
import { buildLesson } from '../lib/exercises'
import { useProgress } from '../context/ProgressContext.jsx'
import TappablePhrase from '../components/TappablePhrase.jsx'
import { speak, speakSlow } from '../lib/speech'
import { haptics } from '../lib/haptics'

function shuffleArr(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Vuelve a encolar un ejercicio fallado (reaparece al final), rebarajando
// sus opciones para que no se acierte de memoria por posición.
function requeue(ex) {
  if (ex.type === 'build') return { ...ex, isRetry: true, tokens: shuffleArr(ex.tokens) }
  if (ex.options) return { ...ex, isRetry: true, options: shuffleArr(ex.options) }
  return { ...ex, isRetry: true }
}

export default function Lesson() {
  const { unitId } = useParams()
  const navigate = useNavigate()
  const { addXp, completeUnit, loseHeart, refillHearts } = useProgress()

  const unit = units.find((u) => u.id === unitId)
  // `attempt` cambia en cada repetición → se vuelve a barajar TODO.
  const [attempt, setAttempt] = useState(0)
  const exercises = useMemo(() => (unit ? buildLesson(unit) : []), [unit, attempt])

  // `queue` es una cola dinámica: si fallas un ejercicio, se reencola al final
  // y vuelve a aparecer (como Duolingo). `pos` es el ejercicio actual.
  const [queue, setQueue] = useState(() => exercises)
  const [pos, setPos] = useState(0)
  const [firstTryCorrect, setFirstTryCorrect] = useState(0) // aciertos a la primera (para la nota)
  const [sessionXp, setSessionXp] = useState(0)
  const [finished, setFinished] = useState(false)
  const initialTotal = useRef(exercises.length)

  // Al regenerar la tanda (montaje o repetición) reiniciamos la cola.
  useEffect(() => {
    setQueue(exercises)
    setPos(0)
    setFirstTryCorrect(0)
    setSessionXp(0)
    setFinished(false)
    initialTotal.current = exercises.length
  }, [exercises])

  if (!unit) {
    return (
      <div className="p-8 text-center">
        <p className="mb-4">Unidad no encontrada.</p>
        <Link to="/" className="btn-green">Volver</Link>
      </div>
    )
  }

  const ex = queue[pos]

  const handleResult = (ok) => {
    if (ok) {
      haptics.success()
      if (!ex.isRetry) setFirstTryCorrect((c) => c + 1)
      setSessionXp((x) => x + 10)
      addXp(10)
    } else {
      haptics.error()
      loseHeart()
      // Reencolar la fallada al final para repetirla.
      setQueue((q) => [...q, requeue(ex)])
    }
  }

  const next = () => {
    if (pos + 1 >= queue.length) {
      const pct = Math.round((firstTryCorrect / Math.max(1, initialTotal.current)) * 100)
      completeUnit(unit.id, pct)
      setFinished(true)
    } else {
      setPos((p) => p + 1)
    }
  }

  if (finished) {
    const pct = Math.round((firstTryCorrect / Math.max(1, initialTotal.current)) * 100)
    return (
      <FinishScreen
        unit={unit}
        pct={pct}
        xp={sessionXp}
        onHome={() => navigate('/')}
        onRetry={() => {
          refillHearts()
          setAttempt((a) => a + 1) // regenera la tanda; el efecto reinicia la cola
        }}
      />
    )
  }

  if (!ex) return null

  return (
    <div className="min-h-full flex flex-col bg-white">
      <ProgressBar unit={unit} idx={pos} total={queue.length} onQuit={() => navigate('/')} />
      <div className="flex-1 w-full max-w-2xl mx-auto px-4 py-6">
        <Exercise key={pos} ex={ex} onResult={handleResult} onNext={next} accent={unit.color} />
      </div>
    </div>
  )
}

function ProgressBar({ idx, total, onQuit, unit }) {
  const { progress } = useProgress()
  const pct = (idx / total) * 100
  return (
    <header className="sticky top-0 bg-white z-10 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] flex items-center gap-3 max-w-2xl mx-auto w-full">
      <button onClick={onQuit} className="text-2xl text-duo-gray hover:text-duo-ink">✕</button>
      <div className="flex-1 h-4 rounded-full bg-duo-line overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: unit.color }}
        />
      </div>
      <div className="font-display font-extrabold text-duo-red flex items-center gap-1">
        ❤️ {progress.hearts}
      </div>
    </header>
  )
}

function Exercise({ ex, onResult, onNext, accent }) {
  if (ex.type === 'build') {
    return <BuildExercise ex={ex} onResult={onResult} onNext={onNext} accent={accent} />
  }
  if (ex.type === 'listen') {
    return <ListenExercise ex={ex} onResult={onResult} onNext={onNext} accent={accent} />
  }
  if (ex.type === 'match') {
    return <MatchExercise ex={ex} onResult={onResult} onNext={onNext} accent={accent} />
  }
  return <ChoiceExercise ex={ex} onResult={onResult} onNext={onNext} accent={accent} />
}

// ── Ejercicio de opción múltiple ──────────────────────────────────────────
function ChoiceExercise({ ex, onResult, onNext, accent }) {
  const [selected, setSelected] = useState(null)
  const [checked, setChecked] = useState(false)
  const isCorrect = selected === ex.answer
  // En "sueco → español" el enunciado está en sueco: lo leemos en voz alta.
  const promptInSwedish = ex.type === 'choice-sv-es'

  useEffect(() => {
    if (promptInSwedish) speak(ex.word)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const check = () => {
    if (selected == null) return
    setChecked(true)
    onResult(isCorrect)
  }

  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-display font-extrabold text-xl text-duo-ink">{ex.prompt}</h2>

      <div className="card flex flex-col items-center gap-3 py-8">
        {promptInSwedish ? (
          <TappablePhrase text={ex.word} />
        ) : (
          <div className="text-2xl font-display font-extrabold text-duo-ink text-center">
            {ex.word}
          </div>
        )}
        {ex.hint && <div className="text-sm text-duo-gray text-center px-4">💡 {ex.hint}</div>}
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {ex.options.map((opt) => {
          const active = selected === opt
          const showCorrect = checked && opt === ex.answer
          const showWrong = checked && active && !isCorrect
          return (
            <button
              key={opt}
              disabled={checked}
              onClick={() => {
                haptics.light()
                setSelected(opt)
              }}
              className={`card text-left font-bold transition-colors ${
                showCorrect
                  ? 'border-duo-green bg-green-50 text-duo-greenDark'
                  : showWrong
                  ? 'border-duo-red bg-red-50 text-duo-redDark'
                  : active
                  ? 'border-duo-blue bg-blue-50'
                  : 'hover:bg-gray-50'
              }`}
            >
              {opt}
            </button>
          )
        })}
      </div>

      <Footer
        checked={checked}
        isCorrect={isCorrect}
        answer={ex.answer}
        answerInSwedish={ex.type === 'choice-es-sv'}
        disabled={selected == null}
        onCheck={check}
        onNext={onNext}
        accent={accent}
      />
    </div>
  )
}

// ── Ejercicio de ordenar palabras ─────────────────────────────────────────
function BuildExercise({ ex, onResult, onNext, accent }) {
  const [bank, setBank] = useState(ex.tokens)
  const [line, setLine] = useState([])
  const [checked, setChecked] = useState(false)
  const built = line.join(' ')
  const isCorrect = built === ex.answer

  const say = (w) => {
    haptics.light()
    speak(String(w).replace(/[.,!?¿¡]/g, '')) // suena la palabra tocada
  }
  const pick = (i) => {
    if (checked) return
    say(bank[i])
    setLine([...line, bank[i]])
    setBank(bank.filter((_, j) => j !== i))
  }
  const unpick = (i) => {
    if (checked) return
    say(line[i])
    setBank([...bank, line[i]])
    setLine(line.filter((_, j) => j !== i))
  }
  const check = () => {
    setChecked(true)
    onResult(isCorrect)
  }

  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-display font-extrabold text-xl text-duo-ink">{ex.prompt}</h2>
      <div className="card py-5 text-center">
        <div className="text-xs uppercase tracking-wide text-duo-gray mb-1">En español</div>
        <div className="text-lg font-display font-extrabold text-duo-ink">{ex.word}</div>
      </div>

      {/* Línea de construcción */}
      <div className="min-h-[56px] border-b-2 border-duo-line flex flex-wrap gap-2 pb-2">
        {line.map((t, i) => (
          <button key={`${t}-${i}`} onClick={() => unpick(i)} className="px-3 py-2 rounded-xl bg-white border-2 border-duo-line font-bold">
            {t}
          </button>
        ))}
      </div>

      {/* Banco de palabras */}
      <div className="flex flex-wrap gap-2">
        {bank.map((t, i) => (
          <button key={`${t}-${i}`} onClick={() => pick(i)} className="px-3 py-2 rounded-xl bg-white border-2 border-duo-line shadow-sm font-bold hover:bg-gray-50">
            {t}
          </button>
        ))}
      </div>

      <Footer
        checked={checked}
        isCorrect={isCorrect}
        answer={ex.answer}
        answerInSwedish
        disabled={line.length === 0}
        onCheck={check}
        onNext={onNext}
        accent={accent}
      />
    </div>
  )
}

// ── Ejercicio de escuchar (audio → significado) ───────────────────────────
function ListenExercise({ ex, onResult, onNext, accent }) {
  const [selected, setSelected] = useState(null)
  const [checked, setChecked] = useState(false)
  const isCorrect = selected === ex.answer

  useEffect(() => {
    speak(ex.audio)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const check = () => {
    if (selected == null) return
    setChecked(true)
    onResult(isCorrect)
  }

  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-display font-extrabold text-xl text-duo-ink">{ex.prompt}</h2>

      <div className="card flex flex-col items-center gap-4 py-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => { haptics.light(); speak(ex.audio) }}
            aria-label="Reproducir audio"
            className="w-24 h-24 rounded-2xl bg-duo-blue text-white text-5xl flex items-center justify-center active:translate-y-1"
            style={{ boxShadow: '0 5px 0 0 #1899d6' }}
          >
            🔊
          </button>
          <button
            type="button"
            onClick={() => { haptics.light(); speakSlow(ex.audio) }}
            aria-label="Escuchar más despacio"
            title="Escuchar más despacio (0.5x)"
            className="w-16 h-16 rounded-2xl bg-duo-purple text-white text-3xl flex items-center justify-center active:translate-y-1"
            style={{ boxShadow: '0 5px 0 0 #b15ef0' }}
          >
            🐢
          </button>
        </div>
        {checked && (
          <TappablePhrase text={ex.reveal} size="md" />
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {ex.options.map((opt) => {
          const active = selected === opt
          const showCorrect = checked && opt === ex.answer
          const showWrong = checked && active && !isCorrect
          return (
            <button
              key={opt}
              disabled={checked}
              onClick={() => {
                haptics.light()
                setSelected(opt)
              }}
              className={`card text-left font-bold transition-colors ${
                showCorrect
                  ? 'border-duo-green bg-green-50 text-duo-greenDark'
                  : showWrong
                  ? 'border-duo-red bg-red-50 text-duo-redDark'
                  : active
                  ? 'border-duo-blue bg-blue-50'
                  : 'hover:bg-gray-50'
              }`}
            >
              {opt}
            </button>
          )
        })}
      </div>

      <Footer
        checked={checked}
        isCorrect={isCorrect}
        answer={ex.answer}
        disabled={selected == null}
        onCheck={check}
        onNext={onNext}
        accent={accent}
      />
    </div>
  )
}

// ── Ejercicio de emparejar (sueco ↔ español) ──────────────────────────────
function MatchExercise({ ex, onResult, onNext, accent }) {
  const [leftSel, setLeftSel] = useState(null)
  const [rightSel, setRightSel] = useState(null)
  const [matched, setMatched] = useState({}) // { id: true }
  const [wrong, setWrong] = useState(null) // id par que falló (flash)
  const [done, setDone] = useState(false)

  const left = useMemo(() => shuffleArr(ex.pairs), [ex])
  const right = useMemo(() => shuffleArr(ex.pairs), [ex])

  const total = ex.pairs.length

  const tryMatch = (lId, rId) => {
    if (lId === rId) {
      haptics.success()
      const nm = { ...matched, [lId]: true }
      setMatched(nm)
      setLeftSel(null)
      setRightSel(null)
      speak(ex.pairs.find((p) => p.id === lId).sv)
      if (Object.keys(nm).length === total) {
        setDone(true)
        onResult(true)
      }
    } else {
      haptics.error()
      setWrong(`${lId}-${rId}`)
      setTimeout(() => setWrong(null), 500)
      setTimeout(() => {
        setLeftSel(null)
        setRightSel(null)
      }, 300)
    }
  }

  const onLeft = (id) => {
    if (matched[id] || done) return
    haptics.light()
    setLeftSel(id)
    if (rightSel != null) tryMatch(id, rightSel)
  }
  const onRight = (id) => {
    if (matched[id] || done) return
    haptics.light()
    setRightSel(id)
    if (leftSel != null) tryMatch(leftSel, id)
  }

  const cellCls = (id, sel, side) => {
    if (matched[id]) return 'border-duo-green bg-green-50 text-duo-green opacity-60'
    if (wrong && wrong.includes(String(id))) return 'border-duo-red bg-red-50 text-duo-redDark'
    if (sel === id) return 'border-duo-blue bg-blue-50'
    return 'hover:bg-gray-50'
  }

  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-display font-extrabold text-xl text-duo-ink">{ex.prompt}</h2>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-3">
          {left.map((p) => (
            <button
              key={`l-${p.id}`}
              disabled={matched[p.id] || done}
              onClick={() => onLeft(p.id)}
              className={`card font-display font-extrabold text-duo-ink transition-colors ${cellCls(p.id, leftSel)}`}
            >
              {p.sv}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          {right.map((p) => (
            <button
              key={`r-${p.id}`}
              disabled={matched[p.id] || done}
              onClick={() => onRight(p.id)}
              className={`card font-semibold text-duo-gray transition-colors ${cellCls(p.id, rightSel)}`}
            >
              {p.es}
            </button>
          ))}
        </div>
      </div>

      {done && (
        <button
          onClick={() => { haptics.tap(); onNext() }}
          className="btn-green w-full"
          style={{ background: accent }}
        >
          Continuar
        </button>
      )}
    </div>
  )
}

// ── Pie con botón comprobar / continuar y feedback ────────────────────────
function Footer({ checked, isCorrect, answer, answerInSwedish, disabled, onCheck, onNext, accent }) {
  // Al comprobar, leemos en voz alta la respuesta correcta si está en sueco.
  useEffect(() => {
    if (checked && answerInSwedish) speak(answer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked])

  return (
    <div className="mt-2">
      {checked && (
        <div
          className={`rounded-2xl p-4 mb-3 font-bold ${
            isCorrect ? 'bg-green-50 text-duo-greenDark' : 'bg-red-50 text-duo-redDark'
          }`}
        >
          {isCorrect ? (
            '¡Correcto! 🎉'
          ) : (
            <div className="flex flex-col gap-2">
              <span>Respuesta correcta:</span>
              {answerInSwedish ? (
                <TappablePhrase text={answer} size="md" />
              ) : (
                <span className="underline">{answer}</span>
              )}
            </div>
          )}
        </div>
      )}
      {!checked ? (
        <button
          onClick={() => { haptics.tap(); onCheck() }}
          disabled={disabled}
          className="btn-green w-full disabled:opacity-40"
          style={{ background: accent }}
        >
          Comprobar
        </button>
      ) : (
        <button
          onClick={() => { haptics.tap(); onNext() }}
          className="btn-green w-full"
          style={{ background: accent }}
        >
          Continuar
        </button>
      )}
    </div>
  )
}

// ── Pantalla final ────────────────────────────────────────────────────────
function FinishScreen({ unit, pct, xp, onHome, onRetry }) {
  const passed = pct >= 60
  return (
    <div className="min-h-full flex flex-col items-center justify-center px-6 py-12 text-center bg-white">
      <div className="text-6xl mb-4">{passed ? '🏆' : '💪'}</div>
      <h1 className="font-display font-extrabold text-2xl text-duo-ink">
        {passed ? '¡Lección completada!' : '¡Casi! Vuelve a intentarlo'}
      </h1>
      <p className="text-duo-gray mt-2">
        {unit.icon} {unit.title}
      </p>

      <div className="flex gap-4 my-8">
        <div className="card px-6 py-4">
          <div className="text-xs uppercase text-duo-gray">Aciertos</div>
          <div className="font-display font-extrabold text-2xl text-duo-green">{pct}%</div>
        </div>
        <div className="card px-6 py-4">
          <div className="text-xs uppercase text-duo-gray">XP ganada</div>
          <div className="font-display font-extrabold text-2xl text-duo-yellow">+{xp}</div>
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button onClick={() => { haptics.tap(); onHome() }} className="btn-green w-full">Ir al mapa</button>
        <button onClick={() => { haptics.tap(); onRetry() }} className="btn-gray w-full">Repetir</button>
      </div>
    </div>
  )
}
