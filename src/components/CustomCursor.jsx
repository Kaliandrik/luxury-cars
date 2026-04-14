import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'

const CustomCursor = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const cursorRef = useRef(null)

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }

    const handleMouseOver = (e) => {
      const target = e.target.closest('a, button, .nav-btn, .dot, .car-thumb, .compare-card, .ficha-tab, .perfil-card, .manut-card')
      if (target) setIsHovering(true)
      else setIsHovering(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseover', handleMouseOver)
    document.body.style.cursor = 'none'

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleMouseOver)
      document.body.style.cursor = 'auto'
    }
  }, [])

  return (
    <motion.div
      ref={cursorRef}
      className="custom-cursor"
      animate={{
        x: mousePos.x - 24,   // centraliza (metade da largura 48)
        y: mousePos.y - 24,
        scale: isHovering ? 1.2 : 1,
        rotate: isHovering ? 8 : 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 28,
        mass: 0.5,
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 48,
        height: 48,
        pointerEvents: 'none',
        zIndex: 9999,
        filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.3))',
      }}
    >
      <img
        src="/imagens/iconemouse.png"
        alt="cursor carro"
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </motion.div>
  )
}

export default CustomCursor