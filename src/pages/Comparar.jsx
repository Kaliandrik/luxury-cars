import { useState } from 'react'
import { motion } from 'framer-motion'
import { cars } from '../data/cars'
import Header from '../components/Header'
import Footer from '../components/Footer'

const maxTotal = Math.max(...cars.map((c) => c.vendas.total))

const Comparar = () => {
  const [selected, setSelected] = useState(null)

  const activeCar = selected !== null ? cars[selected] : cars[0]

  return (
    <div className="page-layout">
      <Header />

      <main className="page-main">
        {/* fundo */}
        <div className="page-bg" />
        <div
          className="overlay-color"
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
            background: `radial-gradient(ellipse at 20% 50%, ${activeCar.color}10 0%, transparent 55%)`,
            transition: 'background 0.8s ease',
          }}
        />

        <div className="compare-wrapper">

          {/* título da seção */}
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="section-tag">Dados de mercado</span>
            <h1 className="section-title">Comparativo de Vendas</h1>
            <p className="section-sub">Volume total de unidades vendidas no Brasil</p>
          </motion.div>

          {/* cards de total */}
          <div className="compare-cards">
            {cars.map((car, i) => (
              <motion.div
                key={car.id}
                className={`compare-card ${selected === i ? 'compare-card--active' : ''}`}
                style={{ '--car-color': car.color }}
                onClick={() => setSelected(selected === i ? null : i)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <img src={car.image} alt={car.name} className="compare-card-img" />
                <div className="compare-card-info">
                  <span className="compare-card-brand">{car.brand}</span>
                  <span className="compare-card-name" style={{ color: car.color }}>{car.name}</span>
                  <span className="compare-card-total">
                    {car.vendas.total.toLocaleString('pt-BR')}
                    <span className="compare-card-unit"> unidades</span>
                  </span>
                </div>
                {/* barra de progresso */}
                <div className="compare-card-bar-bg">
                  <motion.div
                    className="compare-card-bar-fill"
                    style={{ background: car.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(car.vendas.total / maxTotal) * 100}%` }}
                    transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: 'easeOut' }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* gráfico de barras por ano do carro selecionado */}
          {selected !== null && (
            <motion.div
              className="year-chart"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <div className="year-chart-header">
                <span className="section-tag">Evolução anual</span>
                <h2 className="year-chart-title" style={{ color: cars[selected].color }}>
                  {cars[selected].brand} {cars[selected].name}
                </h2>
              </div>

              <div className="year-bars">
                {(() => {
                  const maxQtd = Math.max(...cars[selected].vendas.porAno.map((a) => a.qtd))
                  return cars[selected].vendas.porAno.map((item, i) => (
                    <div key={item.ano} className="year-bar-col">
                      <span className="year-bar-value">
                        {(item.qtd / 1000).toFixed(1)}k
                      </span>
                      <div className="year-bar-track">
                        <motion.div
                          className="year-bar-fill"
                          style={{ background: cars[selected].color }}
                          initial={{ height: 0 }}
                          animate={{ height: `${(item.qtd / maxQtd) * 100}%` }}
                          transition={{ duration: 0.7, delay: i * 0.08, ease: 'easeOut' }}
                        />
                      </div>
                      <span className="year-bar-label">{item.ano}</span>
                    </div>
                  ))
                })()}
              </div>
            </motion.div>
          )}

        </div>
      </main>

      <Footer activeCar={activeCar} index={0} total={cars.length} />
    </div>
  )
}

export default Comparar
