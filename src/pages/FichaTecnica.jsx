import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cars } from '../data/cars'
import Header from '../components/Header'
import Footer from '../components/Footer'

const specs = [
  { key: 'motor',           label: 'Motor',            icon: '⚙' },
  { key: 'potencia',        label: 'Potência',         icon: '⚡' },
  { key: 'torque',          label: 'Torque',           icon: '🔩' },
  { key: 'cambio',          label: 'Câmbio',           icon: '🔧' },
  { key: 'tracao',          label: 'Tração',           icon: '🛞' },
  { key: 'peso',            label: 'Peso',             icon: '⚖' },
  { key: 'comprimento',     label: 'Comprimento',      icon: '📐' },
  { key: 'largura',         label: 'Largura',          icon: '↔' },
  { key: 'altura',          label: 'Altura',           icon: '↕' },
  { key: 'porta_malas',     label: 'Porta-malas',      icon: '📦' },
  { key: 'consumo_cidade',  label: 'Consumo cidade',   icon: '🏙' },
  { key: 'consumo_estrada', label: 'Consumo estrada',  icon: '🛣' },
]

const FichaTecnica = () => {
  const [selected, setSelected] = useState(0)
  const car = cars[selected]

  return (
    <div className="page-layout">
      <Header />

      <main className="page-main">
        <div className="page-bg" />
        <div
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
            background: `radial-gradient(ellipse at 75% 40%, ${car.color}12 0%, transparent 55%)`,
            transition: 'background 0.8s ease',
          }}
        />

        <div className="ficha-wrapper">

          {/* seletor de carro */}
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="section-tag">Especificações</span>
            <h1 className="section-title">Ficha Técnica</h1>
            <p className="section-sub">Dados técnicos oficiais de cada modelo</p>
          </motion.div>

          {/* tabs de seleção */}
          <div className="ficha-tabs">
            {cars.map((c, i) => (
              <button
                key={c.id}
                className={`ficha-tab ${selected === i ? 'ficha-tab--active' : ''}`}
                style={{ '--car-color': c.color }}
                onClick={() => setSelected(i)}
              >
                <img src={c.image} alt={c.name} className="ficha-tab-img" />
                <span className="ficha-tab-name" style={{ color: selected === i ? c.color : 'rgba(255,255,255,0.4)' }}>
                  {c.name}
                </span>
              </button>
            ))}
          </div>

          {/* conteúdo da ficha */}
          <AnimatePresence mode="wait">
            <motion.div
              key={car.id}
              className="ficha-content"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
            >
              {/* imagem + nome */}
              <div className="ficha-hero">
                <img src={car.image} alt={car.name} className="ficha-hero-img" />
                <div className="ficha-hero-info">
                  <span className="ficha-hero-brand">{car.brand}</span>
                  <h2 className="ficha-hero-name" style={{ color: car.color }}>{car.name}</h2>
                  <span className="ficha-hero-year">{car.year}</span>
                </div>
              </div>

              {/* grid de specs */}
              <div className="ficha-grid">
                {specs.map((spec, i) => (
                  <motion.div
                    key={spec.key}
                    className="ficha-item"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                  >
                    <span className="ficha-item-icon">{spec.icon}</span>
                    <span className="ficha-item-label">{spec.label}</span>
                    <span className="ficha-item-value" style={{ color: car.color }}>
                      {car.ficha[spec.key]}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

        </div>
      </main>

      <Footer activeCar={car} index={selected} total={cars.length} />
    </div>
  )
}

export default FichaTecnica
