import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipe } from "../hooks/useSwipe";
import type { Pair } from "../data/pairs";

interface SwipeCardProps {
  pairs: Pair[];
  onFinish: (score: number) => void;
}

type Feedback = "correct" | "wrong" | null;

export function SwipeCard({ pairs, onFinish }: SwipeCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [exitDirection, setExitDirection] = useState(0);
  const [showCard, setShowCard] = useState(true);

  const currentPair = pairs[currentIndex];
  const total = pairs.length;

  const handleAnswer = useCallback(
    (userSaysMatch: boolean) => {
      if (feedback) return;
      const isCorrect = userSaysMatch === currentPair.match;
      const newScore = isCorrect ? score + 1 : score;

      setFeedback(isCorrect ? "correct" : "wrong");
      setExitDirection(userSaysMatch ? 1 : -1);

      if (isCorrect) setScore(newScore);

      setTimeout(() => {
        setShowCard(false);
        setTimeout(() => {
          if (currentIndex + 1 >= total) {
            onFinish(newScore);
          } else {
            setCurrentIndex((i) => i + 1);
            setFeedback(null);
            setExitDirection(0);
            setShowCard(true);
          }
        }, 150);
      }, 400);
    },
    [currentIndex, currentPair, feedback, score, total, onFinish]
  );

  const handleSwipeRight = useCallback(() => handleAnswer(true), [handleAnswer]);
  const handleSwipeLeft = useCallback(() => handleAnswer(false), [handleAnswer]);

  const { offsetX, isSwiping, handlers } = useSwipe({
    threshold: 100,
    onSwipeRight: handleSwipeRight,
    onSwipeLeft: handleSwipeLeft,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleSwipeRight();
      if (e.key === "ArrowLeft") handleSwipeLeft();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSwipeRight, handleSwipeLeft]);

  const rotation = isSwiping ? offsetX * 0.1 : 0;
  const swipeIndicatorOpacity = Math.min(Math.abs(offsetX) / 100, 1);

  return (
    <div className="screen game-screen">
      <div className="game-header">
        <div className="score-display">
          Acertos: <strong>{score}</strong>
        </div>
        <div className="progress-display">
          {currentIndex + 1} / {total}
        </div>
      </div>

      <div className="card-area">
        <AnimatePresence mode="wait">
          {showCard && (
            <motion.div
              key={currentIndex}
              className={`swipe-card ${feedback ?? ""}`}
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                x: feedback ? exitDirection * 300 : offsetX,
                rotate: feedback ? exitDirection * 20 : rotation,
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
              }}
              {...handlers}
              style={{ touchAction: "pan-y" }}
            >
              {/* Swipe indicators */}
              <div
                className="swipe-indicator nope"
                style={{ opacity: offsetX < 0 ? swipeIndicatorOpacity : 0 }}
              >
                ✗
              </div>
              <div
                className="swipe-indicator like"
                style={{ opacity: offsetX > 0 ? swipeIndicatorOpacity : 0 }}
              >
                ✓
              </div>

              <div className="card-content">
                <div className="concept concept-a">
                  <span className="concept-icon">{"{ }"}</span>
                  <span className="concept-text">{currentPair.a}</span>
                </div>

                <div className="separator">+</div>

                <div className="concept concept-b">
                  <span className="concept-icon">{"< />"}</span>
                  <span className="concept-text">{currentPair.b}</span>
                </div>
              </div>

              {feedback && (
                <div className={`feedback-overlay ${feedback}`}>
                  {feedback === "correct" ? "✓" : "✗"}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="action-buttons">
        <motion.button
          className="btn-action btn-nope"
          onClick={() => handleAnswer(false)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          disabled={!!feedback}
        >
          ✗
        </motion.button>
        <motion.button
          className="btn-action btn-like"
          onClick={() => handleAnswer(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          disabled={!!feedback}
        >
          ✓
        </motion.button>
      </div>
    </div>
  );
}
