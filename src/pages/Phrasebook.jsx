import { useState } from 'react'
import { units } from '../data/lessons'
import SpeakButton from '../components/SpeakButton.jsx'

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
                      <div className="min-w-0">
                        <div className="font-display font-extrabold text-duo-ink">{it.sv}</div>
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
