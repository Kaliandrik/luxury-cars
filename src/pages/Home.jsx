import React, { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { cars } from '../data/cars'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CarDisplay from '../components/CarDisplay'

const isSlowConnection = () => {
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection
  if (!conn) return false
  return conn.saveData || ['slow-2g', '2g'].includes(conn.effectiveType)
}

const Home = () => {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [videoVisible, setVideoVisible] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const videoRef = useRef(null)
  const activeCar = cars[index]
  const hasVideo = !!activeCar.video
  const shouldPlayVideo = hasVideo && !isSlowConnection()

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    setVideoVisible(false)
    setVideoLoaded(false)

    if (!shouldPlayVideo) {
      video.src = ''
      video.load()
      return
    }

    const loadTimer = setTimeout(() => {
      video.src = activeCar.video
      video.load()
      const onCanPlay = () => {
        setVideoLoaded(true)
        video.play().catch(() => {})
        setTimeout(() => setVideoVisible(true), 100)
      }
      video.addEventListener('canplay', onCanPlay, { once: true })
    }, 300)

    return () => clearTimeout(loadTimer)
  }, [index, shouldPlayVideo])

  const nextCar = () => {
    setDirection(1)
    setIndex((p) => (p === cars.length - 1 ? 0 : p + 1))
  }

  const prevCar = () => {
    setDirection(-1)
    setIndex((p) => (p === 0 ? cars.length - 1 : p - 1))
  }

  const goTo = (i) => {
    setDirection(i > index ? 1 : -1)
    setIndex(i)
  }

  const showStaticBg = !shouldPlayVideo || !videoLoaded

  return (
    <div className="showcase">
      <Header />

      <div className="stage">
        <video
          ref={videoRef}
          loop muted playsInline preload="none"
          className="bg-video"
          style={{ opacity: videoVisible ? 1 : 0 }}
        />

        {/* Fundo estático */}
        <div
          className="no-video-bg"
          style={{
            opacity: showStaticBg ? 1 : 0,
            transition: 'opacity 0.8s ease, background 1s ease',
            background: `
              radial-gradient(ellipse at 30% 40%, ${activeCar.color}22 0%, transparent 55%),
              radial-gradient(ellipse at 75% 70%, ${activeCar.color}11 0%, transparent 50%),
              linear-gradient(135deg, #0a0a0a 0%, #111 40%, #0d0d0d 100%)
            `,
          }}
        />
        <div
          className="no-video-grid"
          style={{ opacity: showStaticBg ? 1 : 0, transition: 'opacity 0.8s ease' }}
        />

        <div className="overlay-radial" />
        <div className="overlay-top" />
        <div className="overlay-bottom" />
        <div
          className="overlay-color"
          style={{
            background: `radial-gradient(ellipse at center, ${activeCar.color}15 0%, transparent 55%)`,
            transition: 'background 1s ease',
          }}
        />

        {/* Seta esquerda com animação de hover */}
        <motion.button
          className="nav-btn left"
          onClick={prevCar}
          aria-label="Anterior"
          whileHover={{ scale: 1.15, x: -3 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          <ChevronLeft size={22} strokeWidth={1.5} />
        </motion.button>

        <CarDisplay activeCar={activeCar} direction={direction} />

        {/* Seta direita */}
        <motion.button
          className="nav-btn right"
          onClick={nextCar}
          aria-label="Próximo"
          whileHover={{ scale: 1.15, x: 3 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          <ChevronRight size={22} strokeWidth={1.5} />
        </motion.button>

        {/* Dots */}
        <div className="dots">
          {cars.map((car, i) => (
            <motion.button
              key={i}
              className="dot"
              onClick={() => goTo(i)}
              style={{
                width: i === index ? '32px' : '8px',
                backgroundColor: i === index ? activeCar.color : 'rgba(255,255,255,0.2)',
              }}
              whileHover={{ scaleY: 2 }}
              aria-label={`Ir para ${cars[i].name}`}
            />
          ))}
        </div>

        {/* Miniaturas dos outros carros (canto inferior) */}
        <div className="car-thumbnails">
          {cars.map((car, i) => (
            <motion.button
              key={car.id}
              className={`car-thumb ${i === index ? 'car-thumb--active' : ''}`}
              style={{ '--car-color': car.color }}
              onClick={() => goTo(i)}
              whileHover={{ y: -4, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img src={car.image} alt={car.name} />
              <span style={{ color: i === index ? car.color : 'rgba(255,255,255,0.35)' }}>
                {car.name}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <Footer activeCar={activeCar} index={index} total={cars.length} />
    </div>
  )
}

export default Home
