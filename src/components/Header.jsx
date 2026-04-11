import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const Header = () => {
  const [open, setOpen] = useState(false)

  const links = [
    { to: '/',               label: 'Modelos' },
    { to: '/comparar',       label: 'Comparar' },
    { to: '/ficha-tecnica',  label: 'Ficha Técnica' },
  ]

  return (
    <>
      <header className="header">
        <div className="header-line" />

        {/* Logo */}
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
            <div className="header-subtitle">Showcase · {new Date().getFullYear()}</div>
          </div>
        </div>

        {/* Nav desktop */}
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

        {/* Botão hambúrguer — só aparece no mobile */}
        <button
          className="header-menu-btn"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      {/* Drawer mobile */}
      <nav className={`mobile-nav ${open ? 'open' : ''}`}>
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === '/'}
            className={({ isActive }) =>
              isActive ? 'mobile-nav-item active' : 'mobile-nav-item'
            }
            onClick={() => setOpen(false)}
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
    </>
  )
}

export default Header
