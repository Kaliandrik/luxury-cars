import { motion, AnimatePresence } from "framer-motion";

const CarDisplay = ({ activeCar }) => {
  return (
    <div className="car-display">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCar.id}
          className="car-motion"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {/* Nome decorativo de fundo */}
          <span className="car-name-bg">{activeCar.name}</span>

          {/* Imagem do carro */}
          <div className="car-img-wrapper">
            <motion.img
              src={activeCar.image}
              alt={activeCar.name}
              className="car-img"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
          </div>

          {/* Informações */}
          <div className="car-info">
            <p className="car-meta">{activeCar.brand}</p>

            <h3
              className="car-title"
              style={{
                color: activeCar.color,
                textShadow: `0 0 50px ${activeCar.color}44`,
              }}
            >
              {activeCar.name}
            </h3>

            <div className="car-divider" style={{ backgroundColor: activeCar.color }} />

            <p className="car-desc">{activeCar.description}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CarDisplay;
