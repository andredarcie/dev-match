import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { StartScreen } from "./components/StartScreen";
import { SwipeCard } from "./components/SwipeCard";
import { ScoreScreen } from "./components/ScoreScreen";
import { getShuffledPairs, type Pair } from "./data/pairs";

type Screen = "start" | "game" | "score";

function App() {
  const [screen, setScreen] = useState<Screen>("start");
  const [pairs, setPairs] = useState<Pair[]>([]);
  const [finalScore, setFinalScore] = useState(0);

  const startGame = useCallback(() => {
    setPairs(getShuffledPairs(10));
    setScreen("game");
  }, []);

  const finishGame = useCallback((score: number) => {
    setFinalScore(score);
    setScreen("score");
  }, []);

  const restart = useCallback(() => {
    startGame();
  }, [startGame]);

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        {screen === "start" && <StartScreen key="start" onStart={startGame} />}
        {screen === "game" && (
          <SwipeCard key="game" pairs={pairs} onFinish={finishGame} />
        )}
        {screen === "score" && (
          <ScoreScreen
            key="score"
            score={finalScore}
            total={pairs.length}
            pairs={pairs}
            onRestart={restart}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
