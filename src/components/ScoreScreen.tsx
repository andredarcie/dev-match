import { motion } from "framer-motion";
import type { Pair } from "../data/pairs";

interface ScoreScreenProps {
  score: number;
  total: number;
  pairs: Pair[];
  onRestart: () => void;
}

function getMessage(percentage: number): string {
  if (percentage === 100) return "Perfeito! Você é um arquiteto nato! 🏆";
  if (percentage >= 80) return "Excelente! Você manja muito! 🔥";
  if (percentage >= 60) return "Bom trabalho! Está no caminho certo! 💪";
  if (percentage >= 40) return "Pode melhorar! Continue estudando! 📚";
  return "Hora de revisar os fundamentos! 🎯";
}

export function ScoreScreen({ score, total, pairs, onRestart }: ScoreScreenProps) {
  const percentage = Math.round((score / total) * 100);

  return (
    <motion.div
      className="screen score-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2 className="score-title">Resultado</h2>

      <motion.div
        className="score-circle"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
      >
        <span className="score-number">{score}</span>
        <span className="score-of">de {total}</span>
        <span className="score-percent">{percentage}%</span>
      </motion.div>

      <p className="score-message">{getMessage(percentage)}</p>

      <div className="pairs-review">
        <h3>Respostas</h3>
        {pairs.map((pair, i) => (
          <motion.div
            key={i}
            className={`pair-review ${pair.match ? "match" : "no-match"}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.05 }}
          >
            <div className="pair-concepts">
              <span>{pair.a}</span>
              <span className="pair-plus">+</span>
              <span>{pair.b}</span>
            </div>
            <span className={`pair-badge ${pair.match ? "match" : "no-match"}`}>
              {pair.match ? "Combinam" : "Não combinam"}
            </span>
          </motion.div>
        ))}
      </div>

      <motion.button
        className="btn-play"
        onClick={onRestart}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Jogar Novamente
      </motion.button>
    </motion.div>
  );
}
