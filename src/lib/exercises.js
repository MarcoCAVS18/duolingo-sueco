// ──────────────────────────────────────────────────────────────────────────
//  Generador de ejercicios
//  A partir de los `items` de una unidad crea una tanda variada de
//  ejercicios tipo Duolingo:
//   · choice-sv-es : ves el sueco, eliges el español
//   · choice-es-sv : ves el español, eliges el sueco
//   · build        : ordena las palabras para formar la frase en sueco
// ──────────────────────────────────────────────────────────────────────────
import { units } from '../data/lessons'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function sample(arr, n, exclude) {
  return shuffle(arr.filter((x) => x !== exclude)).slice(0, n)
}

// Pozo ACUMULATIVO: solo las palabras de esta unidad y de las ANTERIORES.
// Así los distractores refuerzan lo ya aprendido y nunca muestran palabras
// de categorías que todavía no viste.
function learnedPool(unit) {
  const idx = units.findIndex((u) => u.id === unit.id)
  const upTo = idx >= 0 ? units.slice(0, idx + 1) : units
  return upTo.flatMap((u) => u.items)
}

function distractorsEs(correct, n, pool) {
  const opts = [...new Set(pool.map((i) => i.es))].filter((x) => x !== correct)
  return sample(opts, n)
}
function distractorsSv(correct, n, pool) {
  const opts = [...new Set(pool.map((i) => i.sv))].filter((x) => x !== correct)
  return sample(opts, n)
}

function makeChoiceSvEs(item, pool) {
  const options = shuffle([item.es, ...distractorsEs(item.es, 3, pool)])
  return {
    type: 'choice-sv-es',
    prompt: '¿Qué significa en español?',
    word: item.sv,
    hint: item.hint,
    answer: item.es,
    options,
  }
}

function makeChoiceEsSv(item, pool) {
  const options = shuffle([item.sv, ...distractorsSv(item.sv, 3, pool)])
  return {
    type: 'choice-es-sv',
    prompt: 'Selecciona la traducción al sueco',
    word: item.es,
    hint: item.hint,
    answer: item.sv,
    options,
  }
}

function makeListen(item, pool) {
  // Escuchas el sueco (audio) y eliges el significado en español.
  const options = shuffle([item.es, ...distractorsEs(item.es, 3, pool)])
  return {
    type: 'listen',
    prompt: 'Escucha y elige el significado',
    audio: item.sv,
    answer: item.es,
    reveal: item.sv,
    options,
  }
}

function makeMatch(items) {
  // Empareja sueco ↔ español (varios pares a la vez).
  const pairs = items.map((it, i) => ({ id: i, sv: it.sv, es: it.es }))
  return {
    type: 'match',
    prompt: 'Empareja cada palabra con su traducción',
    pairs,
  }
}

function makeBuild(item, pool) {
  const correctTokens = item.sv.split(' ')
  // Palabras señuelo tomadas de frases ya aprendidas.
  const extraPool = shuffle(
    pool
      .flatMap((i) => i.sv.split(' '))
      .filter((w) => !correctTokens.includes(w) && w.length > 1)
  ).slice(0, 2)
  return {
    type: 'build',
    prompt: 'Ordena las palabras para formar la frase',
    word: item.es,
    answer: item.sv,
    tokens: shuffle([...correctTokens, ...extraPool]),
  }
}

export function buildLesson(unit) {
  const items = shuffle(unit.items)
  const pool = learnedPool(unit) // esta unidad + todas las anteriores
  const exercises = []

  // Ejercicio de emparejar al inicio, con palabras cortas (1 sola palabra).
  const shortItems = items.filter((it) => !it.sv.includes(' ')).slice(0, 5)
  if (shortItems.length >= 4) {
    exercises.push(makeMatch(shortItems))
  }

  items.forEach((item, idx) => {
    const isPhrase = item.sv.includes(' ')
    if (isPhrase && idx % 3 === 0) {
      exercises.push(makeBuild(item, pool))
    } else if (idx % 4 === 1) {
      exercises.push(makeListen(item, pool))
    } else if (idx % 2 === 0) {
      exercises.push(makeChoiceSvEs(item, pool))
    } else {
      exercises.push(makeChoiceEsSv(item, pool))
    }
  })
  return exercises
}
