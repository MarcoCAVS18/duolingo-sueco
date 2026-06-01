import { useState } from 'react'
import { units } from '../data/lessons'
import SpeakButton from '../components/SpeakButton.jsx'
import { speak, speakSlow } from '../lib/speech'
import { haptics } from '../lib/haptics'

// Guía de consulta rápida: todo el vocabulario y frases por unidad.
export default function Phrasebook() {
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()

  return (
    <div>
      <h1 className="font-display font-extrabold text-2xl text-duo-ink mb-1">Guía de bolsillo</h1>
      <p className="text-duo-gray mb-4">Todo el menú y las frases, para consultar en plena mesa.</p>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar en sueco o español…"
        className="w-full rounded-2xl border-2 border-duo-line px-4 py-3 mb-6 focus:outline-none focus:border-duo-blue"
      />

      <div className="flex flex-col gap-6">
        {units.map((unit) => {
          const items = unit.items.filter(
            (it) =>
              !q ||
              it.sv.toLowerCase().includes(q) ||
              it.es.toLowerCase().includes(q)
          )
          if (items.length === 0) return null
          return (
            <section key={unit.id}>
              <h2 className="font-display font-extrabold text-lg mb-2 flex items-center gap-2" style={{ color: unit.color }}>
                <span>{unit.icon}</span> {unit.title}
              </h2>
              <div className="card divide-y divide-duo-line p-0 overflow-hidden">
                {items.map((it) => (
                  <div key={it.sv} className="flex items-start justify-between gap-3 px-4 py-3">
                    <div className="flex items-start gap-2 min-w-0">
                      <SpeakButton text={it.sv} size="sm" className="mt-0.5" />
                      {it.sv.includes(' ') && (
                        <button
                          type="button"
                          onClick={() => { haptics.light(); speakSlow(it.sv) }}
                          aria-label="Escuchar más despacio"
                          title="Más despacio (0.5x)"
                          className="shrink-0 mt-0.5 w-8 h-8 inline-flex items-center justify-center rounded-xl text-white bg-duo-purple text-base active:translate-y-0.5"
                          style={{ boxShadow: '0 3px 0 0 #b15ef0' }}
                        >
                          🐢
                        </button>
                      )}
                      <div className="min-w-0">
                        {/* Palabras tocables: toca una palabra para oírla suelta */}
                        <div className="flex flex-wrap gap-x-1 gap-y-0.5">
                          {it.sv.split(' ').map((w, i) => (
                            <button
                              key={`${w}-${i}`}
                              type="button"
                              onClick={() => { haptics.light(); speak(w.replace(/[.,!?¿¡]/g, '')) }}
                              className="font-display font-extrabold text-duo-ink rounded hover:bg-blue-50 active:bg-blue-100 px-0.5"
                            >
                              {w}
                            </button>
                          ))}
                        </div>
                        {it.hint && <div className="text-xs text-duo-gray mt-0.5">{it.hint}</div>}
                      </div>
                    </div>
                    <div className="text-right text-duo-gray font-semibold shrink-0 max-w-[40%]">
                      {it.es}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
