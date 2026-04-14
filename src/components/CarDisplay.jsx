import { motion, AnimatePresence } from 'framer-motion'
import { memo } from 'react'

const QuickSpec = ({ label, value, color, delay }) => (
  <motion.div
    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
  >
    <span style={{ fontSize: '0.95rem', fontWeight: 800, color, letterSpacing: '-0.5px', lineHeight: 1 }}>
      {value}
    </span>
    <span style={{ fontSize: '0.52rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)' }}>
      {label}
    </span>
  </motion.div>
)

const CarDisplay = ({ activeCar, direction = 1 }) => {
  const specs = [
    { label: 'Motor',    value: activeCar.ficha.motor.split(' ').slice(0, 2).join(' ') },
    { label: 'Potência', value: activeCar.ficha.potencia.split('(')[0].trim() },
    { label: 'Câmbio',   value: activeCar.ficha.cambio.split(' ').slice(0, 2).join(' ') },
    { label: 'Peso',     value: activeCar.ficha.peso },
  ]

  return (
    <div className="car-display">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={activeCar.id}
          className="car-motion"
          custom={direction}
          variants={{
            enter: (d) => ({ opacity: 0, x: d > 0 ? 60 : -60, scale: 0.96 }),
            center: { opacity: 1, x: 0, scale: 1 },
            exit:  (d) => ({ opacity: 0, x: d > 0 ? -60 : 60, scale: 0.96 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ willChange: 'transform, opacity' }}
        >
          {/* Specs rápidos */}
          <motion.div
            style={{
              display: 'flex',
              gap: '2rem',
              marginBottom: '1rem',
              position: 'relative',
              zIndex: 20,
              padding: '0.6rem 1.5rem',
              borderTop: `1px solid ${activeCar.color}22`,
              borderBottom: `1px solid ${activeCar.color}22`,
              background: 'rgba(0,0,0,0.25)',
              backdropFilter: 'blur(8px)',
              borderRadius: '8px',
            }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
          >
            {specs.map((s, i) => (
              <QuickSpec
                key={s.label}
                label={s.label}
                value={s.value}
                color={activeCar.color}
                delay={0.15 + i * 0.05}
              />
            ))}
          </motion.div>

          {/* Wrapper da imagem */}
          <div className="car-img-wrapper" style={{ position: 'relative', zIndex: 10 }}>
            {/* Reflexo embaixo */}
            <div style={{
              position: 'absolute',
              bottom: '-10px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '70%',
              height: '30px',
              background: `radial-gradient(ellipse, ${activeCar.color}30 0%, transparent 70%)`,
              filter: 'blur(8px)',
              zIndex: 0,
            }} />

            {/* Imagem do carro com efeito de inclinação e elevação no hover */}
            <motion.img
              src={activeCar.image}
              alt={activeCar.name}
              className="car-img"
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileHover={{
                rotateY: 6,
                rotateX: 3,
                scale: 1.02,
                y: -8,
                transition: { type: 'spring', stiffness: 300, damping: 15 }
              }}
              style={{
                filter: `drop-shadow(0 30px 50px rgba(0,0,0,0.75)) drop-shadow(0 0 30px ${activeCar.color}22)`,
                position: 'relative',
                zIndex: 10,
                willChange: 'transform, opacity',
              }}
            />
          </div>

          {/* Informações */}
          <div className="car-info">
            <motion.div
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '0.35rem' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div style={{ width: '20px', height: '1px', background: `${activeCar.color}66` }} />
              <p className="car-meta">{activeCar.brand}</p>
              <div style={{ width: '20px', height: '1px', background: `${activeCar.color}66` }} />
            </motion.div>

            <motion.h3
              className="car-title"
              style={{
                color: activeCar.color,
                textShadow: `0 0 60px ${activeCar.color}55, 0 0 120px ${activeCar.color}22`,
              }}
              initial={{ opacity: 0, y: 8, letterSpacing: '4px' }}
              animate={{ opacity: 1, y: 0, letterSpacing: '-1px' }}
              transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
            >
              {activeCar.name}
            </motion.h3>

            {/* Divisor animado */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', margin: '0.4rem 0' }}>
              <motion.div
                style={{ height: '1px', background: activeCar.color, opacity: 0.35 }}
                initial={{ width: 0 }}
                animate={{ width: 36 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              />
              <motion.div
                style={{ width: 4, height: 4, borderRadius: '50%', background: activeCar.color, opacity: 0.6 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
              />
              <motion.div
                style={{ height: '1px', background: activeCar.color, opacity: 0.35 }}
                initial={{ width: 0 }}
                animate={{ width: 36 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              />
            </div>

            <motion.p
              className="car-desc"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.35 }}
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