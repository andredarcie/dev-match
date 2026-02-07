import { motion } from "framer-motion";

interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <motion.div
      className="screen start-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="logo">
        <span className="logo-icon">{"</>"}</span>
        <h1>DevMatch</h1>
      </div>

      <p className="tagline">Será que esses conceitos combinam?</p>

      <div className="instructions">
        <div className="instruction">
          <span className="swipe-arrow left">←</span>
          <span>Não combinam</span>
        </div>
        <div className="instruction">
          <span>Combinam</span>
          <span className="swipe-arrow right">→</span>
        </div>
      </div>

      <motion.button
        className="btn-play"
        onClick={onStart}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Jogar
      </motion.button>
    </motion.div>
  );
}
