import { useEffect, useMemo, useState } from "react";
import rawStory from "../story/story.json";
import type { Story } from "../story/types";

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
  const [history, setHistory] = useState<string[]>(() => loadHistory(story.startId, story.nodes));

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
      <div style={{ padding: 24, fontFamily: "system-ui" }}>
        <h1>Missing node</h1>
        <p>
          The story tried to go to: <code>{nodeId}</code>
        </p>
        <button onClick={restart}>Restart</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, fontFamily: "system-ui", maxWidth: 720 }}>
      <h1 style={{ marginBottom: 8 }}>{node.title}</h1>
      <p style={{ lineHeight: 1.6, marginTop: 0 }}>{node.text}</p>

      <div style={{ display: "grid", gap: 12, marginTop: 20 }}>
        {node.choices.map((c) => (
          <button
            key={c.to}
            onClick={() => navigate(c.to)}
            style={{ padding: "10px 12px", cursor: "pointer" }}
          >
            {c.text}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <button
          onClick={goBack}
          disabled={history.length <= 1}
          style={{ padding: "6px 12px", cursor: history.length > 1 ? "pointer" : "default" }}
        >
          Back
        </button>
        <button onClick={restart} style={{ padding: "6px 12px", cursor: "pointer" }}>
          Restart
        </button>
      </div>

      <div style={{ marginTop: 24, opacity: 0.7, fontSize: 12 }}>
        <strong>Path</strong>
        <ol style={{ margin: "4px 0 0", paddingLeft: 20 }}>
          {history.map((id, i) => (
            <li key={i}>{story.nodes[id]?.title ?? id}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}