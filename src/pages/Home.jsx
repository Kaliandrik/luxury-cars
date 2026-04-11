import React, { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cars } from '../data/cars'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CarDisplay from '../components/CarDisplay'

const Home = () => {
  const [index, setIndex] = useState(0)
  const [videoVisible, setVideoVisible] = useState(false)
  const videoRef = useRef(null)
  const activeCar = cars[index]
  const hasVideo = !!activeCar.video

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    setVideoVisible(false)

    if (activeCar.video) {
      video.src = activeCar.video
      video.load()
      const onCanPlay = () => {
        video.play().catch(() => {})
        setVideoVisible(true)
      }
      video.addEventListener('canplay', onCanPlay, { once: true })
      return () => video.removeEventListener('canplay', onCanPlay)
    }
  }, [index])

  const nextCar = () => setIndex((p) => (p === cars.length - 1 ? 0 : p + 1))
  const prevCar = () => setIndex((p) => (p === 0 ? cars.length - 1 : p - 1))

  return (
    <div className="showcase">
      <Header />

      <div className="stage">

        {/* Vídeo — só aparece quando o carro tem vídeo */}
        <video
          ref={videoRef}
          loop muted playsInline preload="metadata"
          className="bg-video"
          style={{ opacity: videoVisible ? 1 : 0 }}
        />

        {/* Fundo especial para carros sem vídeo (Celta) */}
        {!hasVideo && (
          <div
            className="no-video-bg"
            style={{
              background: `
                radial-gradient(ellipse at 30% 40%, ${activeCar.color}22 0%, transparent 55%),
                radial-gradient(ellipse at 75% 70%, ${activeCar.color}11 0%, transparent 50%),
                linear-gradient(135deg, #0a0a0a 0%, #111 40%, #0d0d0d 100%)
              `,
            }}
          />
        )}

        {/* Grade tecnológica de fundo para o Celta */}
        {!hasVideo && <div className="no-video-grid" />}

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
