const Footer = ({ activeCar, index, total }) => {
  return (
    <footer className="footer">
      <div className="footer-left">
        <div
          className="footer-dot"
          style={{ background: activeCar?.color ?? '#fff', opacity: 0.7 }}
        />
        <span className="footer-text">Sistema de Navegação Ativo</span>
      </div>

      <div className="footer-center">
        <div className="footer-bar" />
        <span className="footer-label">
          {String((index ?? 0) + 1).padStart(2, '0')} / {String(total ?? 1).padStart(2, '0')}
        </span>
        <div className="footer-bar" />
      </div>

      <div className="footer-right">
        <span className="footer-text">Modelo atual —</span>
        <strong style={{ color: activeCar?.color, marginLeft: '6px', fontSize: '0.6rem', letterSpacing: '2px' }}>
          {activeCar?.brand} {activeCar?.name}
        </strong>
      </div>
    </footer>
  )
}

export default Footer
