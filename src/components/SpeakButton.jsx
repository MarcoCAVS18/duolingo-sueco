import { speak, isSpeechSupported } from '../lib/speech'

// Botón de altavoz que pronuncia un texto en sueco.
export default function SpeakButton({ text, size = 'md', className = '' }) {
  if (!isSpeechSupported()) return null

  const dims = size === 'sm' ? 'w-8 h-8 text-base' : 'w-11 h-11 text-xl'

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        speak(text)
      }}
      aria-label={`Escuchar: ${text}`}
      title="Escuchar pronunciación"
      className={`shrink-0 inline-flex items-center justify-center rounded-xl text-white bg-duo-blue
        active:translate-y-0.5 transition-transform ${dims} ${className}`}
      style={{ boxShadow: '0 3px 0 0 #1899d6' }}
    >
      🔊
    </button>
  )
}
