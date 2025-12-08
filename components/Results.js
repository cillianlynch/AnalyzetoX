// components/Results.js
import { useState } from "react";

export default function Results({ output, mode }) {
  const [copied, setCopied] = useState(false);

  if (!output) {
    return (
      <div style={{ marginTop: 30, fontSize: 14, color: "#666" }}>
        <p>No AI output yet. Load some sources and click “Generate Output”.</p>
      </div>
    );
  }

  const readableModeNames = {
    summary: "Summary",
    long_summary: "Long summary",
    tweet: "Tweet",
    thread: "Thread",
    timeline: "Timeline",
    claims: "Claims",
  };

  const modeLabel = readableModeNames[mode] || "Output";

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
      setCopied(false);
    }
  }

  return (
    <div
      style={{
        marginTop: 30,
        padding: 16,
        borderRadius: 12,
        border: "1px solid #ddd",
        background: "#ffffff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 8,
          gap: 8,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 18,
          }}
        >
          AI Output
        </h2>
        <span
          style={{
            fontSize: 11,
            padding: "2px 8px",
            borderRadius: 999,
            background: "#f0f0f0",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          {modeLabel}
        </span>
        <div style={{ flex: 1 }} />
        <button
          onClick={handleCopy}
          style={{
            fontSize: 12,
            padding: "4px 10px",
            borderRadius: 999,
            border: "1px solid #ccc",
            background: copied ? "#e6ffe6" : "#f7f7f7",
            cursor: "pointer",
          }}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      <div
        style={{
          maxHeight: 400,
          overflowY: "auto",
          borderRadius: 8,
          background: "#fafafa",
          padding: 12,
          fontSize: 14,
          lineHeight: 1.5,
          whiteSpace: "pre-wrap",
        }}
      >
        {output}
      </div>
    </div>
  );
}
