import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const Header = () => {
  const [open, setOpen] = useState(false)
  const [firstVisit, setFirstVisit] = useState(false)

  useEffect(() => {
    const alreadyClicked = localStorage.getItem('menuClicked')
    if (!alreadyClicked) {
      setFirstVisit(true)
      // Agora dura 10 segundos antes de remover o destaque automaticamente
      const timer = setTimeout(() => {
        setFirstVisit(false)
        localStorage.setItem('menuClicked', 'true')
      }, 10000) // 10 segundos
      return () => clearTimeout(timer)
    }
  }, [])

  const handleMenuClick = () => {
    setOpen(!open)
    if (firstVisit) {
      localStorage.setItem('menuClicked', 'true')
      setFirstVisit(false)
    }
  }

  const links = [
    { to: '/',               label: 'Modelos' },
    { to: '/comparar',       label: 'Comparar' },
    { to: '/ficha-tecnica',  label: 'Ficha Técnica' },
  ]

  return (
    <>
      <header className="header">
        <div className="header-line" />

        <div className="header-logo">
          <div className="header-logo-icon">
            <svg viewBox="0 0 16 16" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2">
              <circle cx="8" cy="8" r="6" />
              <path d="M8 8 L11 5" strokeLinecap="round" />
              <circle cx="8" cy="8" r="1" fill="rgba(255,255,255,0.7)" stroke="none" />
            </svg>
          </div>
          <div>
            <div className="header-title">Carros Populares Brasil</div>
            <div className="header-subtitle">Kaliandrik · {new Date().getFullYear()}</div>
          </div>
        </div>

        <nav>
          <ul className="header-nav">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.to === '/'}
                  className={({ isActive }) =>
                    isActive ? 'header-nav-item active' : 'header-nav-item'
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-badge">v1.0 · Beta</div>

        {/* Botão menu com indicador de chamariz */}
        <motion.button
          className="header-menu-btn"
          onClick={handleMenuClick}
          aria-label="Menu"
          animate={firstVisit ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
          transition={{ duration: 0.6, repeat: 2, repeatDelay: 1 }}
          style={{ position: 'relative' }}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
          
          {/* Bolinha pulsante (dourada) */}
          {firstVisit && (
            <motion.span
              style={{
                position: 'absolute',
                top: -8,
                right: -8,
                width: 12,
                height: 12,
                background: '#c8a96e',
                borderRadius: '50%',
                boxShadow: '0 0 0 2px #050505',
              }}
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </motion.button>
      </header>

      {/* Drawer mobile refinado */}
      <AnimatePresence>
        {open && (
          <motion.nav
            className="mobile-nav"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {links.map((l, i) => (
              <motion.div
                key={l.to}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <NavLink
                  to={l.to}
                  end={l.to === '/'}
                  className={({ isActive }) =>
                    isActive ? 'mobile-nav-item active' : 'mobile-nav-item'
                  }
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </NavLink>
              </motion.div>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}

export default Header