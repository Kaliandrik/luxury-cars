import { motion, AnimatePresence } from 'framer-motion'
import { memo, useState, useEffect } from 'react'

// Hook para detectar mobile (largura <= 768px)
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

const QuickSpec = ({ label, value, color, delay, isMobile }) => (
  <motion.div
    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={isMobile ? { duration: 0.2, delay } : { duration: 0.3, delay }}
  >
    <span style={{ fontSize: isMobile ? '0.8rem' : '0.95rem', fontWeight: 800, color, letterSpacing: '-0.5px' }}>
      {value}
    </span>
    <span style={{ fontSize: '0.5rem', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)' }}>
      {label}
    </span>
  </motion.div>
)

const CarDisplay = ({ activeCar, direction = 1 }) => {
  const isMobile = useIsMobile()

  const specs = [
    { label: 'Motor',    value: activeCar.ficha.motor.split(' ').slice(0, 2).join(' ') },
    { label: 'Potência', value: activeCar.ficha.potencia.split('(')[0].trim() },
    { label: 'Câmbio',   value: activeCar.ficha.cambio.split(' ').slice(0, 2).join(' ') },
    { label: 'Peso',     value: activeCar.ficha.peso },
  ]

  // Duração da transição: um pouco mais lenta em mobile para dar fluidez
  const transitionDuration = isMobile ? 0.35 : 0.45
  const transitionEase = [0.25, 0.46, 0.45, 0.94]

  // Variantes de animação (funcionam igual em mobile, mas com duração ajustada)
  const variants = {
    enter: (d) => ({
      opacity: 0,
      x: d > 0 ? (isMobile ? 40 : 60) : (isMobile ? -40 : -60),
      scale: isMobile ? 0.98 : 0.96,
    }),
    center: {
      opacity: 1,
      x: 0,
      scale: 1,
    },
    exit: (d) => ({
      opacity: 0,
      x: d > 0 ? (isMobile ? -40 : -60) : (isMobile ? 40 : 60),
      scale: isMobile ? 0.98 : 0.96,
    }),
  }

  // Efeito hover na imagem (desabilitado em mobile)
  const imgHover = isMobile ? {} : {
    whileHover: {
      rotateY: 6,
      rotateX: 3,
      scale: 1.02,
      y: -8,
      transition: { type: 'spring', stiffness: 300, damping: 15 }
    }
  }

  return (
    <div className="car-display">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={activeCar.id}
          className="car-motion"
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            duration: transitionDuration,
            ease: transitionEase,
          }}
          style={{ willChange: isMobile ? 'transform, opacity' : 'transform, opacity' }}
        >
          {/* Specs rápidos */}
          <motion.div
            style={{
              display: 'flex',
              gap: isMobile ? '1rem' : '2rem',
              marginBottom: '0.8rem',
              padding: isMobile ? '0.4rem 1rem' : '0.6rem 1.5rem',
              borderTop: `1px solid ${activeCar.color}22`,
              borderBottom: `1px solid ${activeCar.color}22`,
              background: 'rgba(0,0,0,0.4)',
              borderRadius: '8px',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {specs.map((s, i) => (
              <QuickSpec
                key={s.label}
                label={s.label}
                value={s.value}
                color={activeCar.color}
                delay={0.1 + i * 0.05}
                isMobile={isMobile}
              />
            ))}
          </motion.div>

          {/* Wrapper da imagem */}
          <div className="car-img-wrapper" style={{ position: 'relative', zIndex: 10 }}>
            {/* Reflexo embaixo (mais leve em mobile) */}
            <div style={{
              position: 'absolute',
              bottom: '-5px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: isMobile ? '60%' : '70%',
              height: isMobile ? '15px' : '30px',
              background: `radial-gradient(ellipse, ${activeCar.color}30 0%, transparent 70%)`,
              filter: isMobile ? 'blur(4px)' : 'blur(8px)',
              zIndex: 0,
            }} />

            {/* Imagem do carro */}
            <motion.img
              src={activeCar.image}
              alt={activeCar.name}
              className="car-img"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: transitionDuration, ease: transitionEase }}
              {...imgHover}
              style={{
                filter: `drop-shadow(0 15px 25px rgba(0,0,0,0.6))`,
                position: 'relative',
                zIndex: 10,
              }}
            />
          </div>

          {/* Informações do carro */}
          <div className="car-info">
            <motion.div
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '0.35rem' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              <div style={{ width: '15px', height: '1px', background: `${activeCar.color}66` }} />
              <p className="car-meta">{activeCar.brand}</p>
              <div style={{ width: '15px', height: '1px', background: `${activeCar.color}66` }} />
            </motion.div>

            <motion.h3
              className="car-title"
              style={{
                color: activeCar.color,
                textShadow: `0 0 30px ${activeCar.color}55`,
                fontSize: isMobile ? 'clamp(1.8rem, 8vw, 2.8rem)' : 'clamp(2rem, 5.5vw, 4rem)',
              }}
              initial={{ opacity: 0, y: 8, letterSpacing: '2px' }}
              animate={{ opacity: 1, y: 0, letterSpacing: '-1px' }}
              transition={{ duration: 0.35, delay: 0.1 }}
            >
              {activeCar.name}
            </motion.h3>

            {/* Divisor animado (simplificado) */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', margin: '0.4rem 0' }}>
              <motion.div
                style={{ height: '1px', background: activeCar.color, opacity: 0.35 }}
                initial={{ width: 0 }}
                animate={{ width: 24 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              />
              <motion.div
                style={{ width: 3, height: 3, borderRadius: '50%', background: activeCar.color, opacity: 0.6 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.25 }}
              />
              <motion.div
                style={{ height: '1px', background: activeCar.color, opacity: 0.35 }}
                initial={{ width: 0 }}
                animate={{ width: 24 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              />
            </div>

            <motion.p
              className="car-desc"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.35 }}
              style={{ fontSize: isMobile ? '0.7rem' : '0.78rem', maxWidth: isMobile ? '280px' : '340px' }}
            >
              {activeCar.description}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default memo(CarDisplay)