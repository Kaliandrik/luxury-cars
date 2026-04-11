import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const LoadingScreen = ({ onComplete }) => {
  const [speed, setSpeed] = useState(0)
  const [percent, setPercent] = useState(0)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    // Simula carregamento progressivo em ~2.8s
    const steps = [
      { delay: 0,    spd: 0,   pct: 0   },
      { delay: 200,  spd: 40,  pct: 15  },
      { delay: 600,  spd: 80,  pct: 35  },
      { delay: 1000, spd: 130, pct: 58  },
      { delay: 1500, spd: 170, pct: 75  },
      { delay: 2000, spd: 220, pct: 90  },
      { delay: 2500, spd: 240, pct: 100 },
    ]

    const timers = steps.map(({ delay, spd, pct }) =>
      setTimeout(() => {
        setSpeed(spd)
        setPercent(pct)
      }, delay)
    )

    // Dispara saída após chegar a 100%
    const exitTimer = setTimeout(() => {
      setLeaving(true)
      setTimeout(onComplete, 600)
    }, 3000)

    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(exitTimer)
    }
  }, [onComplete])

  // Converte velocidade (0–240) para ângulo do ponteiro (-130° a +130°)
  const maxSpeed = 240
  const minAngle = -130
  const maxAngle = 130
  const needleAngle = minAngle + (speed / maxSpeed) * (maxAngle - minAngle)

  // Arco do velocímetro
  const cx = 150
  const cy = 150
  const r = 110
  const toRad = (deg) => (deg * Math.PI) / 180
  const arcStart = { x: cx + r * Math.cos(toRad(minAngle - 90)), y: cy + r * Math.sin(toRad(minAngle - 90)) }
  const arcEnd   = { x: cx + r * Math.cos(toRad(maxAngle - 90)), y: cy + r * Math.sin(toRad(maxAngle - 90)) }

  // Arco de progresso colorido
  const progressAngle = minAngle + (speed / maxSpeed) * (maxAngle - minAngle)
  const progEnd = {
    x: cx + r * Math.cos(toRad(progressAngle - 90)),
    y: cy + r * Math.sin(toRad(progressAngle - 90)),
  }
  const largeArc = progressAngle - minAngle > 180 ? 1 : 0

  // Marcações do velocímetro
  const ticks = []
  for (let i = 0; i <= 24; i++) {
    const angle = minAngle + (i / 24) * (maxAngle - minAngle)
    const rad = toRad(angle - 90)
    const isMajor = i % 4 === 0
    const innerR = isMajor ? r - 18 : r - 10
    ticks.push({
      x1: cx + r * Math.cos(rad),
      y1: cy + r * Math.sin(rad),
      x2: cx + innerR * Math.cos(rad),
      y2: cy + innerR * Math.sin(rad),
      major: isMajor,
      speed: i * 10,
      angle,
    })
  }

  const color = speed < 80 ? '#4caf93' : speed < 160 ? '#c8a96e' : '#ff3a3a'

  return (
    <AnimatePresence>
      {!leaving && (
        <motion.div
          key="loading"
          className="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          {/* grade de fundo */}
          <div className="loading-grid" />

          {/* luz central suave */}
          <div
            className="loading-glow"
            style={{ background: `radial-gradient(ellipse at center, ${color}18 0%, transparent 65%)`, transition: 'background 0.8s ease' }}
          />

          <div className="loading-content">

            {/* título */}
            <motion.div
              className="loading-brand"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="loading-brand-tag">Carros Populares Brasil</span>
            </motion.div>

            {/* velocímetro SVG */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <svg
                viewBox="0 0 300 220"
                className="loading-speedo"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* arco base (cinza) */}
                <path
                  d={`M ${arcStart.x} ${arcStart.y} A ${r} ${r} 0 1 1 ${arcEnd.x} ${arcEnd.y}`}
                  fill="none"
                  stroke="rgba(255,255,255,0.07)"
                  strokeWidth="6"
                  strokeLinecap="round"
                />

                {/* arco de progresso colorido */}
                <motion.path
                  d={`M ${arcStart.x} ${arcStart.y} A ${r} ${r} 0 ${largeArc} 1 ${progEnd.x} ${progEnd.y}`}
                  fill="none"
                  stroke={color}
                  strokeWidth="6"
                  strokeLinecap="round"
                  style={{ filter: `drop-shadow(0 0 6px ${color})`, transition: 'stroke 0.5s ease' }}
                />

                {/* marcações */}
                {ticks.map((t, i) => (
                  <line
                    key={i}
                    x1={t.x1} y1={t.y1}
                    x2={t.x2} y2={t.y2}
                    stroke={t.angle <= needleAngle ? color : 'rgba(255,255,255,0.15)'}
                    strokeWidth={t.major ? 2 : 1}
                    strokeLinecap="round"
                    style={{ transition: 'stroke 0.4s ease' }}
                  />
                ))}

                {/* números das marcações maiores */}
                {ticks.filter((t) => t.major).map((t, i) => {
                  const labelR = r - 30
                  const rad = toRad(t.angle - 90)
                  return (
                    <text
                      key={i}
                      x={cx + labelR * Math.cos(rad)}
                      y={cy + labelR * Math.sin(rad)}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="rgba(255,255,255,0.25)"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      {t.speed}
                    </text>
                  )
                })}

                {/* ponteiro */}
                <motion.g
                  style={{ transformOrigin: `${cx}px ${cy}px` }}
                  animate={{ rotate: needleAngle }}
                  transition={{ type: 'spring', stiffness: 60, damping: 18 }}
                >
                  {/* sombra do ponteiro */}
                  <line
                    x1={cx} y1={cy + 14}
                    x2={cx} y2={cy - r + 22}
                    stroke="rgba(0,0,0,0.4)"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  {/* ponteiro */}
                  <line
                    x1={cx} y1={cy + 14}
                    x2={cx} y2={cy - r + 22}
                    stroke={color}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    style={{ filter: `drop-shadow(0 0 4px ${color})`, transition: 'stroke 0.5s ease' }}
                  />
                </motion.g>

                {/* centro do ponteiro */}
                <circle cx={cx} cy={cy} r="8" fill="#111" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                <circle cx={cx} cy={cy} r="3" fill={color} style={{ transition: 'fill 0.5s ease' }} />

                {/* velocidade digital */}
                <text
                  x={cx} y={cy + 38}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.9)"
                  fontSize="28"
                  fontWeight="700"
                  fontFamily="monospace"
                >
                  <motion.tspan
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  >
                    {speed}
                  </motion.tspan>
                </text>
                <text
                  x={cx} y={cy + 52}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.2)"
                  fontSize="8"
                  letterSpacing="3"
                  fontFamily="monospace"
                >
                  KM/H
                </text>
              </svg>
            </motion.div>

            {/* barra de progresso + percentual */}
            <motion.div
              className="loading-bar-wrapper"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="loading-bar-track">
                <motion.div
                  className="loading-bar-fill"
                  animate={{ width: `${percent}%`, background: color }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
              <span className="loading-bar-pct" style={{ color }}>
                {percent}%
              </span>
            </motion.div>

            {/* status */}
            <motion.p
              className="loading-status"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {percent < 40
                ? 'Iniciando sistema...'
                : percent < 75
                ? 'Carregando modelos...'
                : percent < 100
                ? 'Quase lá...'
                : 'Pronto!'}
            </motion.p>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LoadingScreen
