import { useEffect, useMemo, useState } from "react";
import rawStory from "../story/story.json";
import type { Story } from "../story/types";
import "./StoryPlayer.css";

const SAVE_KEY = "slasher-choice.save.v1";

function loadHistory(startId: string, nodes: Story["nodes"]): string[] {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (
        Array.isArray(parsed) &&
        parsed.length > 0 &&
        parsed.every((id) => typeof id === "string" && id in nodes)
      ) {
        return parsed;
      }
    }
  } catch {
    // corrupted save — fall through to default
  }
  return [startId];
}

export function StoryPlayer() {
  const story = useMemo(() => rawStory as Story, []);
  const [history, setHistory] = useState<string[]>(() =>
    loadHistory(story.startId, story.nodes)
  );

  useEffect(() => {
    localStorage.setItem(SAVE_KEY, JSON.stringify(history));
  }, [history]);

  const nodeId = history[history.length - 1];
  const node = story.nodes[nodeId];

  function navigate(to: string) {
    setHistory((h) => [...h, to]);
  }

  function goBack() {
    setHistory((h) => h.slice(0, -1));
  }

  function restart() {
    setHistory([story.startId]);
  }

  if (!node) {
    return (
      <div className="vn-error">
        <h1>Missing Node</h1>
        <p>
          The story tried to go to: <code>{nodeId}</code>
        </p>
        <button className="vn-nav-btn" onClick={restart}>
          Restart
        </button>
      </div>
    );
  }

  const bgStyle = node.background
    ? { backgroundImage: `url(/graphics/backgrounds/${node.background})` }
    : {};

  const pathLabel = history
    .map((id) => story.nodes[id]?.title ?? id)
    .join(" › ");

  return (
    <div className="vn-container">
      <div className="vn-background" style={bgStyle} />
      <div className="vn-overlay" />

      {node.sprite && (
        <img
          key={node.sprite}
          className={`vn-sprite vn-sprite--${node.spritePosition ?? "center"}`}
          src={`/graphics/sprites/${node.sprite}`}
          alt=""
        />
      )}

      <div key={nodeId} className="vn-dialogue">
        <p className="vn-title">{node.title}</p>
        <p className="vn-text">{node.text}</p>

        <div className="vn-choices">
          {node.choices.map((c) => (
            <button key={c.to} className="vn-choice" onClick={() => navigate(c.to)}>
              {c.text}
            </button>
          ))}
        </div>

        <div className="vn-nav">
          <button
            className="vn-nav-btn"
            onClick={goBack}
            disabled={history.length <= 1}
          >
            Back
          </button>
          <button className="vn-nav-btn" onClick={restart}>
            Restart
          </button>
          <span className="vn-path">{pathLabel}</span>
        </div>
      </div>
    </div>
  );
}
