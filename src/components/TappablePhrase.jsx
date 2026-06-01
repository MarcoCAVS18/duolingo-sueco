import { speak, isSpeechSupported } from '../lib/speech'
import { haptics } from '../lib/haptics'
import SpeakButton from './SpeakButton.jsx'

// ──────────────────────────────────────────────────────────────────────────
//  Frase en sueco con palabras tocables.
//  · Al tocar una palabra → suena esa palabra suelta (+ vibración).
//  · Botón 🔊 → lee la frase completa.
//  · Botón 🐢 → lee la frase completa MÁS DESPACIO (0.5x).
// ──────────────────────────────────────────────────────────────────────────
export default function TappablePhrase({ text, size = 'lg', controls = true }) {
  const words = text.split(' ')
  const isPhrase = words.length > 1
  const textCls = size === 'lg' ? 'text-2xl' : 'text-lg'

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`flex flex-wrap justify-center gap-x-1.5 gap-y-2 font-display font-extrabold text-duo-ink ${textCls}`}>
        {words.map((w, i) => (
          <button
            key={`${w}-${i}`}
            type="button"
            onClick={() => {
              haptics.light()
              // pronunciamos la palabra sin signos de puntuación
              speak(w.replace(/[.,!?¿¡]/g, ''))
            }}
            className="px-1.5 py-0.5 rounded-lg border-b-2 border-dashed border-duo-line hover:bg-blue-50 active:bg-blue-100 transition-colors"
            title="Tocar para escuchar esta palabra"
          >
            {w}
          </button>
        ))}
      </div>

      {controls && isSpeechSupported() && (
        <div className="flex items-center gap-2">
          <SpeakButton text={text} />
          {isPhrase && (
            <button
              type="button"
              onClick={() => {
                haptics.light()
                speak(text, { rate: 0.5 })
              }}
              aria-label="Escuchar más despacio"
              title="Escuchar más despacio (0.5x)"
              className="shrink-0 inline-flex items-center justify-center rounded-xl text-white bg-duo-purple w-11 h-11 text-xl active:translate-y-0.5 transition-transform"
              style={{ boxShadow: '0 3px 0 0 #b15ef0' }}
            >
              🐢
            </button>
          )}
        </div>
      )}
    </div>
  )
}
