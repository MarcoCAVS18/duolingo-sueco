// ──────────────────────────────────────────────────────────────────────────
//  Inicialización de Firebase
//  Lee la configuración desde las variables VITE_FIREBASE_* del archivo .env
//  Si no hay configuración, `isFirebaseEnabled` queda en false y la app
//  funciona en modo offline (localStorage). Así nunca rompe el build.
// ──────────────────────────────────────────────────────────────────────────
import { initializeApp } from 'firebase/app'
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

// Solo activamos Firebase si al menos hay apiKey y projectId.
export const isFirebaseEnabled = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
)

let app = null
let auth = null
let db = null

if (isFirebaseEnabled) {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
}

export { app, auth, db, signInAnonymously, onAuthStateChanged, doc, getDoc, setDoc }
