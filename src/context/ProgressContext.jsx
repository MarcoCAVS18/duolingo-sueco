// ──────────────────────────────────────────────────────────────────────────
//  ProgressContext
//  Maneja PERFILES (Belu y Marco), cada uno con su propio progreso:
//  XP, racha (streak), corazones y unidades completadas.
//  Persiste en Firestore (doc por perfil) si Firebase está activo,
//  y siempre en localStorage como respaldo / modo offline.
// ──────────────────────────────────────────────────────────────────────────
import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import {
  isFirebaseEnabled,
  auth,
  db,
  signInAnonymously,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
} from '../firebase'

// Perfiles disponibles (auth súper simple: solo elegir quién eres)
export const PROFILES = [
  { id: 'belu', name: 'Belu', emoji: '🦊', color: '#ce82ff' },
  { id: 'marco', name: 'Marco', emoji: '🐼', color: '#1cb0f6' },
]

const PROFILE_KEY = 'menyspraket_profile'
const progressKey = (profileId) => `menyspraket_progress_${profileId}_v1`

const defaultProgress = {
  xp: 0,
  streak: 0,
  lastPracticeDay: null, // 'YYYY-MM-DD'
  hearts: 5,
  completedUnits: {}, // { unitId: { best: 100, done: true } }
}

const ProgressContext = createContext(null)

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function readLocal(profileId) {
  try {
    const raw = localStorage.getItem(progressKey(profileId))
    return raw ? { ...defaultProgress, ...JSON.parse(raw) } : { ...defaultProgress }
  } catch {
    return { ...defaultProgress }
  }
}

export function ProgressProvider({ children }) {
  const [profileId, setProfileId] = useState(() => localStorage.getItem(PROFILE_KEY) || null)
  const [progress, setProgress] = useState(() =>
    profileId ? readLocal(profileId) : { ...defaultProgress }
  )
  const [uid, setUid] = useState(null)

  // Login anónimo (solo para tener permisos en Firestore; el "quién eres"
  // lo decide el perfil elegido, no Firebase).
  useEffect(() => {
    if (!isFirebaseEnabled) return
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) setUid(user.uid)
      else signInAnonymously(auth).catch((e) => console.warn('Login anónimo falló:', e))
    })
    return unsub
  }, [])

  // Al cambiar de perfil: cargar su progreso (local y, si hay, Firestore)
  useEffect(() => {
    if (!profileId) return
    setProgress(readLocal(profileId))
    if (isFirebaseEnabled) {
      getDoc(doc(db, 'progress', profileId))
        .then((snap) => {
          if (snap.exists()) setProgress({ ...defaultProgress, ...snap.data() })
        })
        .catch((e) => console.warn('No se pudo leer Firestore:', e))
    }
  }, [profileId])

  // Persistencia de cada cambio
  useEffect(() => {
    if (!profileId) return
    localStorage.setItem(progressKey(profileId), JSON.stringify(progress))
    if (isFirebaseEnabled && uid) {
      setDoc(doc(db, 'progress', profileId), progress, { merge: true }).catch((e) =>
        console.warn('No se pudo guardar en Firestore:', e)
      )
    }
  }, [progress, profileId, uid])

  const selectProfile = useCallback((id) => {
    localStorage.setItem(PROFILE_KEY, id)
    setProfileId(id)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(PROFILE_KEY)
    setProfileId(null)
  }, [])

  const addXp = useCallback((amount) => {
    setProgress((p) => {
      const today = todayStr()
      let { streak, lastPracticeDay } = p
      if (lastPracticeDay !== today) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
        streak = lastPracticeDay === yesterday ? streak + 1 : 1
        lastPracticeDay = today
      }
      return { ...p, xp: p.xp + amount, streak, lastPracticeDay }
    })
  }, [])

  const completeUnit = useCallback((unitId, scorePct) => {
    setProgress((p) => {
      const prev = p.completedUnits[unitId]?.best ?? 0
      return {
        ...p,
        completedUnits: {
          ...p.completedUnits,
          [unitId]: { done: true, best: Math.max(prev, scorePct) },
        },
      }
    })
  }, [])

  const loseHeart = useCallback(() => {
    setProgress((p) => ({ ...p, hearts: Math.max(0, p.hearts - 1) }))
  }, [])

  const refillHearts = useCallback(() => {
    setProgress((p) => ({ ...p, hearts: 5 }))
  }, [])

  const resetProgress = useCallback(() => {
    setProgress({ ...defaultProgress })
  }, [])

  const profile = PROFILES.find((p) => p.id === profileId) || null

  const value = {
    profile,
    profileId,
    selectProfile,
    logout,
    progress,
    addXp,
    completeUnit,
    loseHeart,
    refillHearts,
    resetProgress,
    isFirebaseEnabled,
  }

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress debe usarse dentro de <ProgressProvider>')
  return ctx
}
