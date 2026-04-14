import { useState } from 'react'
import { motion } from 'framer-motion'
import { cars } from '../data/cars'
import Header from '../components/Header'
import Footer from '../components/Footer'

const maxTotal = Math.max(...cars.map((c) => c.vendas.total))

const manutencaoCor = {
  baixo: { cor: '#4caf93',  bg: 'rgba(76,175,147,0.1)',  borda: 'rgba(76,175,147,0.25)'  },
  medio: { cor: '#c8a96e',  bg: 'rgba(200,169,110,0.1)', borda: 'rgba(200,169,110,0.25)' },
  alto:  { cor: '#ff3a3a',  bg: 'rgba(255,58,58,0.1)',   borda: 'rgba(255,58,58,0.25)'   },
}

const ManutencaoDot = ({ nivel }) => {
  const dots = ['baixo', 'medio', 'alto']
  const { cor } = manutencaoCor[nivel]
  return (
    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
      {dots.map((d) => (
        <div
          key={d}
          style={{
            width: 8, height: 8, borderRadius: '50%',
            background: dots.indexOf(d) <= dots.indexOf(nivel) ? cor : 'rgba(255,255,255,0.1)',
            transition: 'background 0.3s',
          }}
        />
      ))}
    </div>
  )
}

const Comparar = () => {
  const [selected, setSelected] = useState(null)
  const activeCar = selected !== null ? cars[selected] : cars[0]

  return (
    <div className="page-layout">
      <Header />

      <main className="page-main">
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

          {/* cabeçalho */}
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
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ type: 'spring', stiffness: 80, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
              >
                <img src={car.image} alt={car.name} className="compare-card-img" />
                <div className="compare-card-info">
                  <span className="compare-card-brand">{car.brand}</span>
                  <span className="compare-card-name" style={{ color: car.color }}>{car.name}</span>
                  <span className="compare-card-total">
                    {car.vendas.total.toLocaleString('pt-BR')}
                    <span className="compare-card-unit"> unidades</span>
                  </span>
                  <span style={{ fontSize: '0.7rem', opacity: 0.5, marginTop: '4px' }}>▼</span>
                </div>
                <div className="compare-card-bar-bg">
                  <motion.div
                    className="compare-card-bar-fill"
                    style={{ background: `linear-gradient(90deg, ${car.color}, rgba(255,255,255,0.6))` }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(car.vendas.total / maxTotal) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: 'easeOut' }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* gráfico anual */}
          {selected !== null && (
            <motion.div
              className="year-chart"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
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
                    <div key={item.ano} className="year-bar-col" title={`${item.qtd.toLocaleString()} unidades`}>
                      <span className="year-bar-value">{(item.qtd / 1000).toFixed(1)}k</span>
                      <div className="year-bar-track">
                        <motion.div
                          className="year-bar-fill"
                          style={{ background: `linear-gradient(180deg, ${cars[selected].color}, rgba(255,255,255,0.4))` }}
                          initial={{ height: 0 }}
                          whileInView={{ height: `${(item.qtd / maxQtd) * 100}%` }}
                          viewport={{ once: true }}
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

          {/* ── PERFIL DE USO ── */}
          <motion.div
            className="section-header"
            style={{ marginTop: '3rem' }}
            initial={{ opacity: 0, y: -12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="section-tag">Análise</span>
            <h2 className="section-title">Perfil de Uso</h2>
            <p className="section-sub">Para qual situação cada modelo se destaca</p>
          </motion.div>

          <div className="perfil-grid">
            {cars.map((car, i) => (
              <motion.div
                key={car.id}
                className="perfil-card"
                style={{ '--car-color': car.color }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ type: 'spring', stiffness: 80, delay: i * 0.12 }}
                whileHover={{ y: -4 }}
              >
                <div className="perfil-card-header">
                  <img src={car.image} alt={car.name} className="perfil-card-img" />
                  <div>
                    <span className="perfil-card-brand">{car.brand}</span>
                    <span className="perfil-card-name" style={{ color: car.color }}>{car.name}</span>
                  </div>
                </div>
                <div className="perfil-badges">
                  {car.perfil.map((p, j) => (
                    <div key={j} className="perfil-badge" style={{ borderColor: `${car.color}40`, background: `${car.color}0d` }}>
                      <span className="perfil-badge-icon" style={{ animation: 'pulse-icon 2s infinite' }}>{p.icone}</span>
                      <span className="perfil-badge-label">{p.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* ── CUSTO DE MANUTENÇÃO ── */}
          <motion.div
            className="section-header"
            style={{ marginTop: '3rem' }}
            initial={{ opacity: 0, y: -12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <span className="section-tag">Custo</span>
            <h2 className="section-title">Manutenção</h2>
            <p className="section-sub">Nível de custo para manter cada modelo</p>
          </motion.div>

          <div className="manut-grid">
            {cars.map((car, i) => {
              const m = manutencaoCor[car.manutencao.nivel]
              return (
                <motion.div
                  key={car.id}
                  className="manut-card"
                  style={{ borderColor: m.borda, background: m.bg }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ type: 'spring', stiffness: 80, delay: i * 0.12 }}
                  whileHover={{ y: -4 }}
                >
                  <div className="manut-card-top">
                    <div>
                      <span className="manut-card-brand">{car.brand}</span>
                      <span className="manut-card-name" style={{ color: car.color }}>{car.name}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <ManutencaoDot nivel={car.manutencao.nivel} />
                      <span className="manut-card-nivel" style={{ color: m.cor, fontWeight: 800, textShadow: `0 0 4px ${m.cor}` }}>
                        {car.manutencao.label}
                      </span>
                    </div>
                  </div>
                  <p className="manut-card-detalhe">{car.manutencao.detalhe}</p>
                </motion.div>
              )
            })}
          </div>

          <div style={{ height: '2rem' }} />
        </div>
      </main>

      <Footer activeCar={activeCar} index={0} total={cars.length} />
    </div>
  )
}

export default Comparar