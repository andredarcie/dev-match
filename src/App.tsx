import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { StartScreen } from "./components/StartScreen";
import { RoadmapScreen } from "./components/RoadmapScreen";
import { SwipeCard } from "./components/SwipeCard";
import { ScoreScreen } from "./components/ScoreScreen";
import { getShuffledNodePairs, getNodeById } from "./data/roadmap";
import type { Pair } from "./data/pairs";

type Screen = "start" | "roadmap" | "game" | "score";

const PASS_THRESHOLD = 0.7;
const STORAGE_KEY = "devmatch-progress";

function loadProgress(): string[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function App() {
  const [screen, setScreen] = useState<Screen>("start");
  const [pairs, setPairs] = useState<Pair[]>([]);
  const [finalScore, setFinalScore] = useState(0);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [completedNodes, setCompletedNodes] = useState<string[]>(loadProgress);

  const goToRoadmap = useCallback(() => setScreen("roadmap"), []);

  const selectNode = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
    setPairs(getShuffledNodePairs(nodeId, 10));
    setScreen("game");
  }, []);

  const finishGame = useCallback(
    (score: number) => {
      setFinalScore(score);

      if (selectedNodeId && score / pairs.length >= PASS_THRESHOLD) {
        setCompletedNodes((prev) => {
          if (prev.includes(selectedNodeId)) return prev;
          const updated = [...prev, selectedNodeId];
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          return updated;
        });
      }

      setScreen("score");
    },
    [selectedNodeId, pairs.length]
  );

  const selectedNode = selectedNodeId ? getNodeById(selectedNodeId) : null;
  const passed = pairs.length > 0 && finalScore / pairs.length >= PASS_THRESHOLD;

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        {screen === "start" && (
          <StartScreen key="start" onStart={goToRoadmap} />
        )}
        {screen === "roadmap" && (
          <RoadmapScreen
            key="roadmap"
            completedNodes={completedNodes}
            onSelectNode={selectNode}
          />
        )}
        {screen === "game" && (
          <SwipeCard key="game" pairs={pairs} onFinish={finishGame} />
        )}
        {screen === "score" && (
          <ScoreScreen
            key="score"
            score={finalScore}
            total={pairs.length}
            pairs={pairs}
            onRestart={goToRoadmap}
            nodeTitle={selectedNode?.title}
            passed={passed}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
