// ──────────────────────────────────────────────────────────────────────────
//  Síntesis de voz (Text-To-Speech) en SUECO
//  Usa la Web Speech API nativa del navegador — igual que la idea de Duolingo:
//  el dispositivo lee y pronuncia el texto. Funciona en Safari iOS, Chrome,
//  Edge y Firefox sin servidores ni claves de API.
//
//  iOS/macOS traen voces suecas (sv-SE) instaladas. Si no hay voz sueca,
//  el sistema usa la voz por defecto (la pronunciación será menos precisa).
// ──────────────────────────────────────────────────────────────────────────

let cachedVoice = null
let voicesLoaded = false

function loadVoices() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return []
  const voices = window.speechSynthesis.getVoices()
  if (voices.length) voicesLoaded = true
  return voices
}

// Las voces se cargan de forma asíncrona; nos suscribimos al evento.
if (typeof window !== 'undefined' && window.speechSynthesis) {
  loadVoices()
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = null
    loadVoices()
  }
}

function pickSwedishVoice() {
  if (cachedVoice) return cachedVoice
  const voices = loadVoices()
  // Preferimos una voz sueca (sv-SE / sv)
  cachedVoice =
    voices.find((v) => v.lang?.toLowerCase().startsWith('sv')) || null
  return cachedVoice
}

export function isSpeechSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function hasSwedishVoice() {
  return Boolean(pickSwedishVoice())
}

// Reproduce `text` en sueco. Debe llamarse desde un gesto del usuario en iOS.
export function speak(text, { rate = 0.9 } = {}) {
  if (!isSpeechSupported() || !text) return
  const synth = window.speechSynthesis
  synth.cancel() // corta lo que estuviera sonando
  const utter = new SpeechSynthesisUtterance(text)
  const voice = pickSwedishVoice()
  if (voice) utter.voice = voice
  utter.lang = voice?.lang || 'sv-SE'
  utter.rate = rate // un poco más lento para aprender
  utter.pitch = 1
  synth.speak(utter)
}

export { voicesLoaded }
