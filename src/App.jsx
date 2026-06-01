import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Lesson from './pages/Lesson.jsx'
import Phrasebook from './pages/Phrasebook.jsx'
import Flashcards from './pages/Flashcards.jsx'
import Profile from './pages/Profile.jsx'
import ProfileGate from './pages/ProfileGate.jsx'
import { useProgress } from './context/ProgressContext.jsx'

export default function App() {
  const { profileId } = useProgress()

  // Auth mínima: si no hay perfil elegido, mostramos la pantalla "¿Quién eres?"
  if (!profileId) return <ProfileGate />

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/guia" element={<Phrasebook />} />
        <Route path="/tarjetas" element={<Flashcards />} />
        <Route path="/perfil" element={<Profile />} />
      </Route>
      <Route path="/leccion/:unitId" element={<Lesson />} />
    </Routes>
  )
}
