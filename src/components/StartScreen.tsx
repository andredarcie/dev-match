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
        <h1>ArchPull</h1>
        <p className="tagline">
          Prepare-se para entrevistas de desenvolvedor pleno e sênior.
          Pratique arquitetura de software, mensageria, boas práticas e muito mais, um conceito por vez por dia.
        </p>
      </div>

      <motion.button
        className="btn-play"
        onClick={onStart}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Fazer exercício diário
      </motion.button>
    </motion.div>
  );
}
