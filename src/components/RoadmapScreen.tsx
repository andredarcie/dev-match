import { useEffect, useRef, Fragment } from "react";
import { motion } from "framer-motion";
import { roadmapNodes, type RoadmapNode } from "../data/roadmap";

interface Props {
  completedNodes: string[];
  onSelectNode: (nodeId: string) => void;
}

type NodeStatus = "completed" | "unlocked" | "locked";

function getNodeStatus(node: RoadmapNode, completed: string[]): NodeStatus {
  if (completed.includes(node.id)) return "completed";
  if (node.prerequisites.every((p) => completed.includes(p))) return "unlocked";
  return "locked";
}

// Pre-compute levels (0–6)
const levels: RoadmapNode[][] = [];
for (let i = 0; i <= 6; i++) {
  levels.push(roadmapNodes.filter((n) => n.level === i));
}

/* ── SVG connector between levels ── */
function Connector({ type }: { type: "split" | "merge" }) {
  return (
    <svg
      className="roadmap-connector"
      viewBox="0 0 300 50"
      preserveAspectRatio="xMidYMid meet"
    >
      {type === "split" ? (
        <>
          <path d="M 150,0 C 150,30 84,20 84,50" />
          <path d="M 150,0 C 150,30 216,20 216,50" />
        </>
      ) : (
        <>
          <path d="M 84,0 C 84,30 150,20 150,50" />
          <path d="M 216,0 C 216,30 150,20 150,50" />
        </>
      )}
    </svg>
  );
}

/* ── Single connector (center → center) ── */
function StraightConnector() {
  return (
    <svg
      className="roadmap-connector"
      viewBox="0 0 300 50"
      preserveAspectRatio="xMidYMid meet"
    >
      <path d="M 150,0 L 150,50" />
    </svg>
  );
}

function getConnectorType(
  prevLevel: RoadmapNode[],
  currentLevel: RoadmapNode[]
): "split" | "merge" | "straight" {
  if (prevLevel.length === 1 && currentLevel.length > 1) return "split";
  if (prevLevel.length > 1 && currentLevel.length === 1) return "merge";
  return "straight";
}

export function RoadmapScreen({ completedNodes, onSelectNode }: Props) {
  const firstUnlockedRef = useRef<HTMLButtonElement>(null);
  let firstUnlockedFound = false;

  const progress = completedNodes.length;
  const total = roadmapNodes.length;

  useEffect(() => {
    const timer = setTimeout(() => {
      firstUnlockedRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="screen roadmap-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="roadmap-header">
        <h2>Arquiteto de Software</h2>
        <p className="roadmap-subtitle">Trilha do basico ao avancado</p>
        <div className="roadmap-progress-bar">
          <div
            className="roadmap-progress-fill"
            style={{ width: `${(progress / total) * 100}%` }}
          />
        </div>
        <p className="roadmap-progress-text">
          {progress} de {total} completos
        </p>
      </div>

      <div className="roadmap-tree">
        {levels.map((levelNodes, levelIndex) => {
          const isBranch = levelNodes.length > 1;

          return (
            <Fragment key={levelIndex}>
              {/* Connector from previous level */}
              {levelIndex > 0 && (() => {
                const type = getConnectorType(levels[levelIndex - 1], levelNodes);
                if (type === "straight") return <StraightConnector />;
                return <Connector type={type} />;
              })()}

              {/* Level row */}
              <div className={`roadmap-level ${isBranch ? "branch" : ""}`}>
                {levelNodes.map((node, nodeIndex) => {
                  const status = getNodeStatus(node, completedNodes);
                  const isFirstUnlocked =
                    status === "unlocked" && !firstUnlockedFound;
                  if (isFirstUnlocked) firstUnlockedFound = true;

                  return (
                    <motion.button
                      key={node.id}
                      ref={isFirstUnlocked ? firstUnlockedRef : undefined}
                      className={`roadmap-node ${status}`}
                      onClick={() =>
                        status !== "locked" && onSelectNode(node.id)
                      }
                      disabled={status === "locked"}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: levelIndex * 0.08 + nodeIndex * 0.04,
                      }}
                      whileHover={status !== "locked" ? { scale: 1.1 } : {}}
                      whileTap={status !== "locked" ? { scale: 0.92 } : {}}
                    >
                      <div className="node-circle">
                        <span className="node-icon">{node.icon}</span>
                        {status === "locked" && (
                          <span className="node-badge lock">{"\u{1F512}"}</span>
                        )}
                        {status === "completed" && (
                          <span className="node-badge check">{"\u2713"}</span>
                        )}
                      </div>
                      <span className="node-title">{node.title}</span>
                    </motion.button>
                  );
                })}
              </div>
            </Fragment>
          );
        })}
      </div>
    </motion.div>
  );
}
