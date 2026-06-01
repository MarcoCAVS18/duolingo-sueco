// ──────────────────────────────────────────────────────────────────────────
//  Vibración háptica (como Duolingo)
//  Usa la Vibration API del navegador. Funciona en Android/Chrome.
//  ⚠️ iOS Safari NO soporta la Vibration API: en iPhone no vibrará desde la
//  web (es una limitación de Apple, no del código). En Android sí.
// ──────────────────────────────────────────────────────────────────────────

function canVibrate() {
  return typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function'
}

// Patrones tipo Duolingo
export const haptics = {
  // Toque ligero (botones, seleccionar opción, tocar palabra)
  light() {
    if (canVibrate()) navigator.vibrate(10)
  },
  // Pulsación de botón principal (Continuar / Comprobar)
  tap() {
    if (canVibrate()) navigator.vibrate(15)
  },
  // Respuesta correcta: doble toque suave
  success() {
    if (canVibrate()) navigator.vibrate([0, 30, 40, 30])
  },
  // Respuesta incorrecta: vibración más larga
  error() {
    if (canVibrate()) navigator.vibrate([0, 80, 40, 80])
  },
}
