import React, { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
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
  const [videoVisible, setVideoVisible] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const videoRef = useRef(null)
  const activeCar = cars[index]
  const hasVideo = !!activeCar.video

  // Só bloqueia em conexão muito ruim (2G) — mobile agora recebe vídeo
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

    // Carrega o vídeo com um pequeno delay pra não competir
    // com o render inicial da página
    const loadTimer = setTimeout(() => {
      video.src = activeCar.video
      video.load()

      const onCanPlay = () => {
        setVideoLoaded(true)
        video.play().catch(() => {})
        // Fade in suave só depois de estar pronto
        setTimeout(() => setVideoVisible(true), 100)
      }

      video.addEventListener('canplay', onCanPlay, { once: true })
    }, 300)

    return () => {
      clearTimeout(loadTimer)
    }
  }, [index, shouldPlayVideo])

  const nextCar = () => setIndex((p) => (p === cars.length - 1 ? 0 : p + 1))
  const prevCar = () => setIndex((p) => (p === 0 ? cars.length - 1 : p - 1))

  const showStaticBg = !shouldPlayVideo || !videoLoaded

  return (
    <div className="showcase">
      <Header />

      <div className="stage">

        {/* Vídeo */}
        <video
          ref={videoRef}
          loop
          muted
          playsInline
          preload="none"          /* não baixa nada até o useEffect pedir */
          className="bg-video"
          style={{ opacity: videoVisible ? 1 : 0 }}
        />

        {/* Fundo estático — aparece enquanto o vídeo carrega
            e permanece em conexões 2G ou carros sem vídeo */}
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

        <button className="nav-btn left" onClick={prevCar} aria-label="Anterior">
          <ChevronLeft size={22} strokeWidth={1.5} />
        </button>

        <CarDisplay activeCar={activeCar} />

        <button className="nav-btn right" onClick={nextCar} aria-label="Próximo">
          <ChevronRight size={22} strokeWidth={1.5} />
        </button>

        <div className="dots">
          {cars.map((_, i) => (
            <button
              key={i}
              className="dot"
              onClick={() => setIndex(i)}
              style={{
                width: i === index ? '32px' : '8px',
                backgroundColor: i === index ? activeCar.color : 'rgba(255,255,255,0.2)',
              }}
              aria-label={`Ir para ${cars[i].name}`}
            />
          ))}
        </div>
      </div>

      <Footer activeCar={activeCar} index={index} total={cars.length} />
    </div>
  )
}

export default Home
