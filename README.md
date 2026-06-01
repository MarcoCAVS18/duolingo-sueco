# 🦉 Menyspråket — Sueco para camareros de Strömstad Spa

App tipo **Duolingo** (React + Vite + Tailwind + Firebase) para que un hispanohablante
aprenda el **sueco** necesario para trabajar como camarero/a en
[Strömstad Spa & Resort](https://stromstadspa.se/menyer): el menú real, los alérgenos
y las frases de servicio. Interfaz 100% en español.

## ✨ Funciones

- **Perfiles separados** (Belu y Marco): cada uno con su XP, racha y progreso.
- **Lecciones interactivas** estilo Duolingo: opción múltiple (sueco↔español) y "ordena la frase".
- **Pronunciación en sueco** 🔊 con la Web Speech API (voz `sv-SE`), igual que Duolingo. Funciona en iOS.
- **Guía de bolsillo** buscable con todo el menú y las frases.
- **PWA instalable en iOS/Android**: añádela a la pantalla de inicio y se abre a pantalla completa.
- **Totalmente responsiva**, con soporte de notch (safe-area).
- **Firebase** (Auth anónimo + Firestore) para sincronizar el progreso; si no hay
  credenciales, funciona offline con `localStorage`.

## 📚 Menús cubiertos (todos los publicados en el sitio)

À la carte (entrantes, principales, postres, clásicos), Barmeny, **Barnmeny**,
Pizzeria Dockyard y Maritimus buffé. Más una unidad extra de bebidas y cierre de cuenta
(el restaurante no publica carta de bebidas online).

## 🚀 Desarrollo

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera /dist
npm run preview  # sirve el build
```

## 🔥 Firebase

Las credenciales del proyecto `duolingo-sueco` ya están en `.env`
(son claves públicas del cliente web; la seguridad real va en `firestore.rules`).

Para que el progreso se sincronice debes:

1. En la consola de Firebase activar **Authentication → método Anónimo**.
2. Crear una base de datos **Firestore**.
3. Desplegar las reglas:

```bash
npm i -g firebase-tools
firebase login
firebase deploy --only firestore:rules
```

Las reglas (`firestore.rules`) solo permiten leer/escribir en `progress/belu` y `progress/marco`
a usuarios autenticados.

## ☁️ Despliegue en Netlify

El repo ya incluye `netlify.toml` y `public/_redirects` (redirección SPA para que el
routing no rompa el build).

- **Build command:** `npm run build`
- **Publish directory:** `dist`

Conecta el repo en Netlify y listo. (Alternativa: `firebase deploy --only hosting`.)

## 🗂️ Estructura

```
src/
├─ data/lessons.js        # Contenido del curso (menú + frases, sv/es)
├─ lib/exercises.js       # Generador de ejercicios
├─ lib/speech.js          # Text-to-Speech en sueco
├─ context/ProgressContext.jsx  # Perfiles + progreso (Firebase/local)
├─ components/            # Layout, SpeakButton
└─ pages/                 # ProfileGate, Home, Lesson, Phrasebook, Profile
```
