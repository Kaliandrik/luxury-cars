import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Home from './pages/Home'
import Comparar from './pages/Comparar'
import FichaTecnica from './pages/FichaTecnica'
import LoadingScreen from './components/LoadingScreen'
import CustomCursor from './components/CustomCursor'   // ← adicionado
import './App.css'

function App() {
  const [loaded, setLoaded] = useState(false)

  return (
    <>
      {/* Cursor personalizado sempre visível (até mesmo sobre a loading screen) */}
      <CustomCursor />

      <AnimatePresence>
        {!loaded && (
          <LoadingScreen onComplete={() => setLoaded(true)} />
        )}
      </AnimatePresence>

      {loaded && (
        <Routes>
          <Route path="/"              element={<Home />} />
          <Route path="/comparar"      element={<Comparar />} />
          <Route path="/ficha-tecnica" element={<FichaTecnica />} />
        </Routes>
      )}
    </>
  )
}

export default App